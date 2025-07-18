# contextManager.py - Essential Functionality + Simple Output Chain

import networkx as nx
import json
import time
from datetime import datetime
from pathlib import Path
import asyncio
from action.executor import run_user_code
from agentLoop.session_serializer import SessionSerializer
from agentLoop.graph_validator import GraphValidator
from utils.utils import log_step, log_error
import pdb
from config.log_config import get_logger, logger_step, logger_json_block, logger_prompt, logger_code_block, logger_error

logger = get_logger(__name__)

class ExecutionContextManager:
    def __init__(self, plan_graph: dict, session_id: str = None, original_query: str = None, file_manifest: list = None, debug_mode: bool = False):
        # Build NetworkX graph
        self.plan_graph = nx.DiGraph()
        
        # Store metadata
        self.plan_graph.graph['session_id'] = session_id or str(int(time.time()))[-8:]
        self.plan_graph.graph['original_query'] = original_query
        self.plan_graph.graph['file_manifest'] = file_manifest or []
        self.plan_graph.graph['created_at'] = datetime.utcnow().isoformat()
        self.plan_graph.graph['status'] = 'running'
        self.plan_graph.graph['output_chain'] = {}  # SIMPLE: Store raw outputs
        
        # Add ROOT node
        self.plan_graph.add_node("ROOT", description="Initial Query", agent="System", status='completed')

        # Build plan DAG
        for node in plan_graph.get("nodes", []):
            self.plan_graph.add_node(node["id"], **node, 
                status='pending', output=None, error=None, cost=0.0,
                start_time=None, end_time=None, execution_time=0.0)
            
        for edge in plan_graph.get("edges", []):
            self.plan_graph.add_edge(edge["source"], edge["target"])

        # Validate graph
        validator = GraphValidator()
        validation_results = validator.validate_execution_graph(self.plan_graph, verbose=not debug_mode)
        if not validation_results["is_valid"]:
            raise ValueError(f"Invalid execution graph: {'; '.join(validation_results['errors'])}")
        
        self.plan_graph.graph['validation_results'] = validation_results
        self.debug_mode = debug_mode

    def get_ready_steps(self):
        """Return steps ready to run"""
        try:
            topo_order = list(nx.topological_sort(self.plan_graph))
            return [node for node in topo_order 
                    if node != "ROOT" and 
                    self.plan_graph.nodes[node]['status'] == 'pending' and
                    all(self.plan_graph.nodes[pred]['status'] == 'completed' 
                       for pred in self.plan_graph.predecessors(node))]
        except nx.NetworkXError:
            return []

    def get_inputs(self, reads):
        """SIMPLE: Just pass previous outputs - NO COMPLEX EXTRACTION!"""
        inputs = {}
        output_chain = self.plan_graph.graph['output_chain']
        
        for step_id in reads:
            if step_id in output_chain:
                inputs[step_id] = output_chain[step_id]  # Direct output passing!
            else:
                log_step(f"⚠️  Missing dependency: '{step_id}' not found", symbol="❓")
        
        return inputs

    def mark_running(self, step_id):
        """Mark step as running"""
        self.plan_graph.nodes[step_id]['status'] = 'running'
        self.plan_graph.nodes[step_id]['start_time'] = datetime.utcnow().isoformat()
        self._auto_save()

    def _has_executable_code_or_files(self, step_id, iteration, output):
        """Check if output contains executable code"""
        if not isinstance(output, dict):
            return False
        is_code_or_files = ("files" in output or "code_variants" in output or "code" in output or
                any(k.startswith("CODE_") for k in output.keys()) or
                any(key in output for key in ["tool_calls", "schedule_tool", "browser_commands", "python_code"]))
        
        logger_step(logger, f"🔄 Executing Step [{step_id}] - Iteration {iteration} - Executable code or files found: {is_code_or_files}", symbol="🔍")
        return is_code_or_files
    
    
    def update_iterations_in_output_chain(self, step_id, iteration_number, iteration_output):
        """
        Update iterations in the output chain for a specific step
        
        Args:
            step_id: The step identifier (e.g., "T001")
            iteration_number: The iteration number (1, 2, 3, etc.)
            iteration_output: The output from this iteration
        """
        # Get current output chain entry for this step
        current_output = self.plan_graph.graph['output_chain'].get(step_id, {})
        
        # Initialize iterations structure if it doesn't exist
        if not isinstance(current_output, dict) or "iterations" not in current_output:
            current_output = {
                "iterations": [],
                "final_output": None,
                "iteration_count": 0
            }
        
        # Find if this iteration already exists
        iteration_found = False
        for i, iteration in enumerate(current_output["iterations"]):
            if iteration.get("iteration") == iteration_number:
                # Update existing iteration
                current_output["iterations"][i]["output"] = iteration_output
                iteration_found = True
                logger_step(logger, f"🔄 Updated iteration {iteration_number} for step {step_id}", symbol="📝")
                break
        
        if not iteration_found:
            # Add new iteration
            current_output["iterations"].append({
                "iteration": iteration_number,
                "output": iteration_output
            })
            current_output["iteration_count"] = len(current_output["iterations"])
            logger_step(logger, f"🔄 Added iteration {iteration_number} for step {step_id}", symbol="➕")
        
        # Update the output chain
        self.plan_graph.graph['output_chain'][step_id] = current_output
        
        logger_json_block(logger, f"🔄 Updated output chain for step {step_id} - Iteration {iteration_number}", {
            "step_id": step_id,
            "iteration_number": iteration_number,
            "total_iterations": current_output["iteration_count"],
            "iteration_output_keys": list(iteration_output.keys()) if isinstance(iteration_output, dict) else "non_dict"
        })
        
        # Auto-save the updated state
        self._auto_save()

    async def _auto_execute_code_or_files(self, step_id, iteration, output, previous_iteration_output=None):
        """Execute code - ESSENTIAL functionality"""
        node_data = self.plan_graph.nodes[step_id]
        reads = node_data.get("reads", [])
        
        # Get input data for execution context
        reads_data = {}
        output_chain = self.plan_graph.graph['output_chain']
        for read_key in reads:
            if read_key in output_chain:
                reads_data[read_key] = output_chain[read_key]

        if previous_iteration_output:
            reads_data.update({"previous_output": previous_iteration_output})
        '''
        # NEW STEP: Add all iteration outputs from output chain
        for step_key, step_output in output_chain.items():
            if step_key != step_id:  # Don't include current step's own output
                if isinstance(step_output, dict) and "iterations" in step_output:
                    # This step has iterations - add all iteration outputs
                    iterations = step_output.get("iterations", [])
                    for i, iteration_data in enumerate(iterations):
                        iteration_num = iteration_data.get("iteration", i + 1)
                        iteration_output = iteration_data.get("output", {})
                        
                        if isinstance(iteration_output, dict):
                            # Add each iteration output with a clear prefix
                            for key, value in iteration_output.items():
                                if key not in ["call_self", "reasoning", "execution_result", "initial_thoughts",
                                            "next_instruction", "output", "files", "code_variants", "code",
                                            "cost", "input_tokens", "output_tokens", "session_id", "operations",
                                            "status", "total_tokens", "created_files", "file_results", "code_results"]:
                                    iteration_key = f"{step_key}_iter_{iteration_num}_{key}"
                                    reads_data[iteration_key] = value
                                    logger_step(logger, f"🔄 Auto Execute Code Step [{step_id}] - Iteration {iteration} - Added iteration output: {iteration_key}", symbol="��")
        '''

        logger_json_block(logger, f"🔄 Auto Execute Code Step [{step_id}] - Iteration {iteration} - Reads Data", reads_data)

        try:
            result = await run_user_code(
                output_data=output,
                multi_mcp=getattr(self, 'multi_mcp', None),
                session_id=self.plan_graph.graph['session_id'],
                inputs=reads_data,  # ONLY pass inputs - no globals_schema
                step_id=step_id,
                iteration=iteration
            )
            
            # 🚨 PRINT EXECUTOR RESULT HERE
            print(f"\n🚨 EXECUTOR RESULT for {step_id}:")
            print(f"Status: {result.get('status', 'NO_STATUS')}")
            print(f"Result: {result.get('result', 'NO_RESULT')}")
            print(f"Full executor response: {result}")
            print("=" * 80)
            
            node_data["execution_result"] = result
            return result
        except Exception as e:
            error_msg = f"Code execution failed: {str(e)}"
            log_error(error_msg)
            return {"status": "failed", "error": error_msg}

    async def mark_done(self, step_id, output=None, cost=None, input_tokens=None, output_tokens=None):
        """SIMPLE: Store output directly - NO COMPLEX EXTRACTION!"""
        
        # Execute code if present
        final_output = output
        execution_result = output.get("execution_result", None)
        
        '''
        if output and self._has_executable_code_or_files(output):
            log_step(f"🔧 Executing code for {step_id}", symbol="⚙️")
            execution_result = await self._auto_execute_code_or_files(step_id, output)
            
            # Merge execution results properly
            if isinstance(output, dict) and execution_result.get("status") == "success":
                final_output = output.copy()
                final_output["execution_result"] = execution_result
                
                # FIXED: Extract actual data from execution result
                if execution_result.get("result"):
                    # If result is a dict, merge it
                    if isinstance(execution_result["result"], dict):
                        final_output.update(execution_result["result"])
                    else:
                        # If result is not a dict, store it as 'data'
                        final_output["data"] = execution_result["result"]
                
                # Also include any tool outputs or files
                if execution_result.get("created_files"):
                    final_output["created_files"] = execution_result["created_files"]
        '''

        logger_json_block(logger, f"✅ Mark Done Step [{step_id}] - Execution Result", execution_result)
        logger_json_block(logger, f"✅✅ Mark Done Step [{step_id}] - Final Output", final_output)

         # Get existing iterations from node data
        node_data = self.plan_graph.nodes[step_id]
        existing_iterations = node_data.get('iterations', [])

        # Create structured output for the output chain
        if existing_iterations:
            structured_output = {
                "iterations": existing_iterations,
                "final_output": final_output,
                "iteration_count": len(existing_iterations)
            }
        
            self.plan_graph.graph['output_chain'][step_id] = structured_output
        
            logger_json_block(logger, f"✅ Mark Done Step [{step_id}] - Stored {len(existing_iterations)} existing iterations + final output", structured_output)
        else:
            # No iterations, store output normally
            self.plan_graph.graph['output_chain'][step_id] = final_output
        
        # Update node status
        node_data = self.plan_graph.nodes[step_id]
        node_data.update({
            'status': 'completed',
            'output': final_output,
            'cost': cost or 0.0,
            'input_tokens': input_tokens or 0,
            'output_tokens': output_tokens or 0,
            'end_time': datetime.utcnow().isoformat(),
            'execution_result': execution_result  # ← FIXED: Store execution result in node
        })
        
        if node_data['start_time']:
            start = datetime.fromisoformat(node_data['start_time'])
            end = datetime.fromisoformat(node_data['end_time'])
            node_data['execution_time'] = (end - start).total_seconds()
        
        # 🔍 DEBUG: Check for empty output and trigger breakpoint
        if isinstance(final_output, dict):
            is_empty = (
                not final_output or 
                final_output == {} or
                all(not v for k, v in final_output.items() if k not in ["call_self", "reasoning", "execution_result"])
            )
            
            if is_empty:
                print(f"\n🚨 DEBUG: {step_id} has EMPTY output after execution!")
                print(f"   Original output: {output}")
                print(f"   Execution result: {execution_result}")
                print(f"   Final output: {final_output}")
                print(f"   Node data: {node_data}")
                print(f"   Output chain: {self.plan_graph.graph['output_chain'].get(step_id, 'NOT_FOUND')}")
                print(f"   Starting PDB debugger...")

        log_step(f"✅ {step_id} completed - output stored in chain", symbol="📦")
        logger_step(logger, f"✅ {step_id} completed - output stored in chain", symbol="📦")
        self._auto_save()

    def mark_failed(self, step_id, error=None):
        """Mark step as failed"""
        node_data = self.plan_graph.nodes[step_id]
        node_data.update({
            'status': 'failed',
            'end_time': datetime.utcnow().isoformat(),
            'error': str(error) if error else None
        })
        
        if node_data['start_time']:
            start = datetime.fromisoformat(node_data['start_time'])
            end = datetime.fromisoformat(node_data['end_time'])
            node_data['execution_time'] = (end - start).total_seconds()
            
        log_error(f"❌ {step_id} failed: {error}")
        self._auto_save()

    def get_step_data(self, step_id):
        """Get step data"""
        return self.plan_graph.nodes[step_id]

    def all_done(self):
        """Check if execution is complete"""
        return all(self.plan_graph.nodes[node_id]['status'] in ['completed', 'failed']
                  for node_id in self.plan_graph.nodes if node_id != "ROOT")

    def get_execution_summary(self):
        """Get execution summary"""
        completed = sum(1 for node_id in self.plan_graph.nodes 
                       if node_id != "ROOT" and 
                       self.plan_graph.nodes[node_id].get('status') == 'completed')
        failed = sum(1 for node_id in self.plan_graph.nodes 
                    if node_id != "ROOT" and 
                    self.plan_graph.nodes[node_id].get('status') == 'failed')
        total = len(self.plan_graph.nodes) - 1
        
        # Calculate costs and tokens
        total_cost = sum(self.plan_graph.nodes[node_id].get('cost', 0.0) 
                        for node_id in self.plan_graph.nodes if node_id != "ROOT")
        
        total_input_tokens = sum(self.plan_graph.nodes[node_id].get('input_tokens', 0) 
                               for node_id in self.plan_graph.nodes if node_id != "ROOT")
        
        total_output_tokens = sum(self.plan_graph.nodes[node_id].get('output_tokens', 0) 
                                for node_id in self.plan_graph.nodes if node_id != "ROOT")
        
        return {
            "session_id": self.plan_graph.graph['session_id'],
            "original_query": self.plan_graph.graph['original_query'],
            "completed_steps": completed,
            "failed_steps": failed,
            "total_steps": total,
            "total_cost": total_cost,
            "total_input_tokens": total_input_tokens,
            "total_output_tokens": total_output_tokens,
            "output_chain": self.plan_graph.graph['output_chain']
        }

    def set_multi_mcp(self, multi_mcp):
        """Set multi_mcp reference"""
        self.multi_mcp = multi_mcp

    def _auto_save(self):
        """Auto-save session"""
        if not self.debug_mode:
            try:
                SessionSerializer.save_session(self.plan_graph, session_type="regular")
            except Exception as e:
                log_error(f"Auto-save failed: {e}")

    def get_session_data(self):
        """Get session data for analysis - ESSENTIAL for output_analyzer"""
        return {
            "session_id": self.plan_graph.graph['session_id'],
            "output_chain": self.plan_graph.graph['output_chain'],
            "nodes": dict(self.plan_graph.nodes(data=True)),
            "links": list(self.plan_graph.edges()),
            "original_query": self.plan_graph.graph.get('original_query', ''),
            "created_at": self.plan_graph.graph.get('created_at', ''),
            "execution_summary": self.get_execution_summary()
        }

    @classmethod
    def load_session(cls, session_file: Path, debug_mode: bool = False):
        """Load session from disk"""
        plan_graph = SessionSerializer.load_session(session_file)
        context = cls.__new__(cls)
        context.plan_graph = plan_graph
        context.debug_mode = debug_mode
        return context
