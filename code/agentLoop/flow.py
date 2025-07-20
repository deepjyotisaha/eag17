# flow.py – SIMPLIFIED Output Chain System

import networkx as nx
import asyncio
from agentLoop.contextManager import ExecutionContextManager
from agentLoop.agents import AgentRunner
from utils.utils import log_step, log_error
from agentLoop.visualizer import ExecutionVisualizer
from rich.console import Console
from pathlib import Path
from action.executor import run_user_code
from config.log_config import get_logger, logger_step, logger_json_block, logger_prompt, logger_code_block, logger_error

logger = get_logger(__name__)

class AgentLoop4:
    def __init__(self, multi_mcp, strategy="conservative", max_self_iter=5):
        self.multi_mcp = multi_mcp
        self.strategy = strategy
        self.agent_runner = AgentRunner(multi_mcp)
        self.max_self_iter = max_self_iter

    async def run(self, query, file_manifest, uploaded_files, template_content):
        # Phase 1: File Profiling (if files exist)
        file_profiles = {}
        if uploaded_files:
            logger_json_block(logger, "Phase 1: File Profiling - Running DistillerAgent", uploaded_files)
            file_list_text = "\n".join([f"- File {i+1}: {Path(f).name} (full path: {f})" 
                                       for i, f in enumerate(uploaded_files)])
            
            grounded_instruction = f"""Profile and summarize each file's structure, columns, content type.

IMPORTANT: Use these EXACT file names in your response:
{file_list_text}

Profile each file separately and return details."""

            file_result = await self.agent_runner.run_agent(
                "DistillerAgent",
                {
                    "task": "profile_files",
                    "files": uploaded_files,
                    "instruction": grounded_instruction,
                    "writes": ["file_profiles"]
                },
                "DistillerAgent",
                "DistillerAgent",
            )
            if file_result["success"]:
                file_profiles = file_result["output"]
                logger_json_block(logger, "Phase 1: File Profiling - File Profiles", file_profiles)
            else:
                logger_error(logger, "Phase 1: File Profiling - File Profiling failed", file_result)
        else:
            logger_step(logger, "Phase 1: File Profiling - No files uploaded")

        logger_step(logger, "Phase 2: Planning - Running PlannerAgent")

        # Phase 2: Planning
        plan_result = await self.agent_runner.run_agent(
            "PlannerAgent",
            {
                "original_query": query,
                "planning_strategy": self.strategy,
                "file_manifest": file_manifest,
                "file_profiles": file_profiles
            },
            "PlannerAgent",
            "PlannerAgent",
        )

        if not plan_result["success"]:
            raise RuntimeError(f"Planning failed: {plan_result['error']}")

        if 'plan_graph' not in plan_result['output']:
            raise RuntimeError(f"PlannerAgent output missing 'plan_graph' key")
        
        plan_graph = plan_result["output"]["plan_graph"]

        logger_json_block(logger, "Phase 2: Planning - Plan Graph", plan_graph)

        # Phase 3: Simple Output Chain Execution
        context = ExecutionContextManager(
            plan_graph,
            session_id=None,
            original_query=query,
            file_manifest=file_manifest,
            template_content=template_content
        )
        
        context.set_multi_mcp(self.multi_mcp)
        
        # Store initial files in output chain
        if file_profiles:
            context.plan_graph.graph['output_chain']['file_profiles'] = file_profiles
            logger_json_block(logger, "Phase 2: Updating Plan Graph - File Profiles", file_profiles)

        # Store uploaded files directly
        for file_info in file_manifest:
            context.plan_graph.graph['output_chain'][file_info['name']] = file_info['path']
            logger_json_block(logger, "Phase 2: Updating Plan Graph - File Manifest", file_manifest)

        # Phase 4: Execute with simple output chaining
        await self._execute_dag(context)
        logger_step(logger, "Phase 4: Execution - Executing DAG Complete")
        return context

    async def _execute_dag(self, context):
        """Execute DAG with simple output chaining"""
        visualizer = ExecutionVisualizer(context)
        console = Console()

        logger_step(logger, "🚀 Phase 3: Execution - DAG Execution Started")
        
        MAX_CONCURRENT_AGENTS = 1
        max_iterations = 20
        iteration = 0

        while not context.all_done() and iteration < max_iterations:
            iteration += 1
            console.print(visualizer.get_layout())
            
            ready_steps = context.get_ready_steps()
            logger_step(logger, f"🔄 Executing DAG: Main Loop - Iteration {iteration} - Ready Steps: {ready_steps}")
            if not ready_steps:
                if any(context.plan_graph.nodes[n]['status'] == 'failed' 
                       for n in context.plan_graph.nodes):
                    break
                await asyncio.sleep(0.3)
                continue

            # Rate limiting
            batch_size = min(len(ready_steps), MAX_CONCURRENT_AGENTS)
            current_batch = ready_steps[:batch_size]
            
            print(f"🚀 Executing batch: {current_batch}")
            logger_step(logger, f"🚀 Executing DAG: Main Loop - Iteration {iteration} - Executing Batch: {current_batch}")

            # Mark running
            for step_id in current_batch:
                context.mark_running(step_id)
            
            # Execute batch
            tasks = [self._execute_step(step_id, context) for step_id in current_batch]
            results = await asyncio.gather(*tasks, return_exceptions=True)

            logger_json_block(logger, f"🔄 Executing DAG: Main Loop - Iteration {iteration} - Completed Batch {current_batch} Results:", results)


            # Process results - SIMPLE!
            for step_id, result in zip(current_batch, results):
                if isinstance(result, Exception):
                    context.mark_failed(step_id, str(result))
                    logger_error(logger, f"❌ Executing DAG: Main Loop - Iteration {iteration} - Step {step_id} Failed", str(result))
                elif result["success"]:
                    await context.mark_done(step_id, result["output"])
                    logger_json_block(logger, f"✅ Executing DAG: Main Loop - Iteration {iteration} - Step {step_id} Completed, Updating Plan Graph:", result["output"])
                else:
                    logger_error(logger, f"❌ Executing DAG: Main Loop - Iteration {iteration} - Step {step_id} Failed", result["error"])
                    context.mark_failed(step_id, result["error"])

            if len(ready_steps) > batch_size:
                await asyncio.sleep(5)

    async def _execute_step(self, step_id, context):
        """SIMPLE: Execute step with direct output passing and code execution"""
        step_data = context.get_step_data(step_id)
        agent_type = step_data["agent"]
        iteration = 1
        
        # SIMPLE: Get raw outputs from previous steps
        inputs = context.get_inputs(step_data.get("reads", []))

        logger_json_block(logger, f"🔄 Executing Step [{step_id}] - Iteration {iteration} - Inputs", inputs)
        
        # Build agent input
        def build_agent_input(agent_type,instruction=None, previous_output=None):

            if agent_type == "FormatterAgent" or agent_type == "ReportGeneratorAgent":
                output_chain = context.plan_graph.graph['output_chain'].copy()
                return {
                    "step_id": step_id,
                    "agent_prompt": instruction or step_data.get("agent_prompt", step_data["description"]),
                    "reads": step_data.get("reads", []),
                    "writes": step_data.get("writes", []),
                    "inputs": inputs,  # Direct output passing!
                    "output_chain": output_chain,
                    "original_query": context.plan_graph.graph['original_query'],
                    "session_context": {
                        "session_id": context.plan_graph.graph['session_id'],
                        "file_manifest": context.plan_graph.graph['file_manifest']
                    },
                    **({"previous_output": previous_output} if previous_output else {})
                }

            else:
                return {
                    "step_id": step_id,
                    "agent_prompt": instruction or step_data.get("agent_prompt", step_data["description"]),
                    "reads": step_data.get("reads", []),
                    "writes": step_data.get("writes", []),
                    "inputs": inputs,  # Direct output passing!
                    "original_query": context.plan_graph.graph['original_query'],
                    "session_context": {
                        "session_id": context.plan_graph.graph['session_id'],
                        "file_manifest": context.plan_graph.graph['file_manifest']
                    },
                    **({"previous_output": previous_output} if previous_output else {})
                }
        

        # Execute first iteration
        agent_input = build_agent_input(agent_type)

        logger_json_block(logger, f"🔄 Executing Step [{step_id}] - Iteration {iteration} - Agent Input", agent_input)

        if agent_type == "FormatterAgent" or agent_type == "ReportGeneratorAgent":
            result = await self.agent_runner.run_agent(agent_type, agent_input, step_id, iteration, context.template_content)
        else:
            result = await self.agent_runner.run_agent(agent_type, agent_input, step_id, iteration)
        
        logger_json_block(logger, f"🔄 Executing Step [{step_id}] - Iteration {iteration} - Agent Result", result)
        
        # This is where the agent output is successfully returned
        if result["success"]:
            step_output = result["output"]
            #logger_json_block(logger, f"🔄 Executing Step [{step_id}] - Iteration {iteration} - Agent Output Successful, Executing...", step_output)

            if context._has_executable_code_or_files(step_id, iteration, step_output):
                logger_step(logger, f"🔄 Executing Step [{step_id}] - Iteration {iteration} - Agent returned executable code or files, executing...")
                try:
                    execution_result = await context._auto_execute_code_or_files(step_id, iteration, step_output)
                    logger_json_block(logger, f"🔄 Executing Step [{step_id}] - Iteration {iteration} - Execution Result", execution_result)
                     # Merge execution results properly
                    if isinstance(step_output, dict) and execution_result.get("status") == "success":
                        log_step(f"✅ {step_id}, iteration {iteration}: Code execution succeeded", symbol="🎉")
                        final_step_output = step_output.copy()
                        final_step_output["execution_result"] = execution_result
                        
                        # FIXED: Extract actual data from execution result
                        if execution_result.get("result"):
                            # If result is a dict, merge it
                            if isinstance(execution_result["result"], dict):
                                final_step_output.update(execution_result["result"])
                            else:
                                # If result is not a dict, store it as 'data'
                                final_step_output["data"] = execution_result["result"]
                        
                        # Also include any tool outputs or files
                        if execution_result.get("created_files"):
                            final_step_output["created_files"] = execution_result["created_files"]

                        result["output"] = final_step_output

                        logger_json_block(logger, f"✅ Executing Step [{step_id}] - Iteration {iteration} - Step Output", final_step_output)

                    elif execution_result["status"] == "partial_failure":
                        log_step(f"⚠️ {step_id}: Code execution partial failure", symbol="⚠️")
                        logger_step(logger, f"⚠️ {step_id}, Iteration {iteration}: Code execution partial failure")

                        # Try to extract any successful results
                        code_output = execution_result.get("code_results", {}).get("result", {})
                        if code_output:
                            combined_output = {
                                **result["output"].get("output", {}),
                                **code_output
                            }
                            result["output"] = combined_output
                        else:
                            # Mark as failed
                            result["success"] = False
                            result["error"] = f"Code execution failed: {execution_result.get('error', 'Unknown error')}"
                            logger_error(logger, f"❌ {step_id}, Iteration {iteration}: Code execution failed", result["error"])
                            
                    else:
                        log_step(f"❌ {step_id}: Code execution failed", symbol="🚨")
                        result["success"] = False
                        result["error"] = f"Code execution failed: {execution_result.get('error', 'Unknown error')}"
                        logger_error(logger, f"❌ {step_id}, Iteration {iteration}: Code execution failed", result["error"]) 
                except Exception as e:
                    log_step(f"💥 {step_id}: Code execution exception: {e}", symbol="❌")
                    logger_error(logger, f"💥 Executing Step [{step_id}] - Iteration {iteration} - Code execution failed", str(e))
                    result["success"] = False
                    result["error"] = f"Code execution failed: {str(e)}"
                    return result

               
            else:
                logger_step(logger, f"🔄 Executing Step [{step_id}] - Iteration {iteration} - Agent returned No code or files, skipping execution...")

        else:
            logger_error(logger, f"❌ Executing Step [{step_id}] - Iteration {iteration} - Agent Output not found", result["output"])
            return result
        
        # Handle call_self if needed
        if result["success"] and result["output"].get("call_self"):
            log_step(f"🔄 CALL_SELF triggered for {step_id}", symbol="🔄")
            logger_step(logger, f"🔄 CALL_SELF triggered for step {step_id}")

            #Initialize iteration tracking
            iterations_data = [{"iteration": iteration, "output": result["output"]}]
            previous_iteration_output = result

            previous_code_results = result["output"].get("execution_result", {}).get("code_results", {}).get("result", {})
            context.update_iterations_in_output_chain(step_id, iteration, previous_code_results)
    
             # While loop for call_self iterations
            while (previous_iteration_output["success"] and 
                   previous_iteration_output["output"].get("call_self") and 
                   iteration < self.max_self_iter):
                
                iteration += 1
                
                print(f"🔄 {step_id}: Call_self triggered, now executing iteration {iteration}")
                logger_step(logger, f"🔄 {step_id}: Call_self triggered, now executing iteration {iteration}")

                # Second iteration with previous output
                agent_iteration_input = build_agent_input(
                    agent_type,
                    instruction=previous_iteration_output["output"].get("next_instruction", "Continue"),
                    previous_output=iterations_data
                )

                logger_json_block(logger, f"🔄 Executing Step [{step_id}] - Iteration {iteration} - Agent Input", agent_iteration_input)

                if agent_type == "FormatterAgent" or agent_type == "ReportGeneratorAgent":
                    current_iteration_output = await self.agent_runner.run_agent(agent_type, agent_iteration_input, step_id, iteration, context.template_content)
                else:
                    current_iteration_output = await self.agent_runner.run_agent(agent_type, agent_iteration_input, step_id, iteration)
            
                logger_json_block(logger, f"🔄 Executing Step [{step_id}] - Iteration {iteration} - Agent Result", current_iteration_output)

                # This is where the agent output is successfully returned
                if current_iteration_output["success"]:
                    step_output = current_iteration_output["output"]
                    logger_json_block(logger, f"🔄 Executing Step [{step_id}] - Iteration {iteration} - Agent Output Successful, Executing...", step_output)

                    if context._has_executable_code_or_files(step_id, iteration, step_output):
                        logger_step(logger, f"🔄 Executing Step [{step_id}] - Iteration {iteration} - Agent returned executable code or files, executing...")
                        try:
                            execution_result = await context._auto_execute_code_or_files(step_id, iteration, step_output, iterations_data)
                            logger_json_block(logger, f"🔄 Executing Step [{step_id}] - Iteration {iteration} - Execution Result", execution_result)
                            # Merge execution results properly
                            if isinstance(step_output, dict) and execution_result.get("status") == "success":
                                log_step(f"✅ {step_id}: Code execution succeeded", symbol="🎉")
                                final_step_output = step_output.copy()
                                final_step_output["execution_result"] = execution_result
                                
                                # FIXED: Extract actual data from execution result
                                if execution_result.get("result"):
                                    # If result is a dict, merge it
                                    if isinstance(execution_result["result"], dict):
                                        final_step_output.update(execution_result["result"])
                                    else:
                                        # If result is not a dict, store it as 'data'
                                        final_step_output["data"] = execution_result["result"]

                                code_output = execution_result.get("code_results", {}).get("result", {})
                                context.update_iterations_in_output_chain(step_id, iteration, code_output)
                                
                                # Also include any tool outputs or files
                                if execution_result.get("created_files"):
                                    final_step_output["created_files"] = execution_result["created_files"]

                                current_iteration_output["output"] = final_step_output

                                logger_json_block(logger, f"✅ Executing Step [{step_id}] - Iteration {iteration} - Step Output", final_step_output)

                            elif execution_result["status"] == "partial_failure":
                                log_step(f"⚠️ {step_id}: Code execution partial failure", symbol="⚠️")
                                logger_step(logger, f"⚠️ {step_id}, Iteration {iteration}: Code execution partial failure")

                                # Try to extract any successful results
                                code_output = execution_result.get("code_results", {}).get("result", {})
                                if code_output:
                                    combined_output = {
                                        **current_iteration_output["output"].get("output", {}),
                                        **code_output
                                    }
                                    result["output"] = combined_output
                                else:
                                    # Mark as failed
                                    current_iteration_output["success"] = False
                                    current_iteration_output["error"] = f"Code execution failed: {execution_result.get('error', 'Unknown error')}"
                                    logger_error(logger, f"❌ {step_id}, Iteration {iteration}: Code execution failed", current_iteration_output["error"])
                                    
                            else:
                                log_step(f"❌ {step_id}: Code execution failed", symbol="🚨")
                                current_iteration_output["success"] = False
                                current_iteration_output["error"] = f"Code execution failed: {execution_result.get('error', 'Unknown error')}"
                                logger_error(logger, f"❌ {step_id}, Iteration {iteration}: Code execution failed", current_iteration_output["error"]) 
                        except Exception as e:
                            log_step(f"💥 {step_id}: Code execution exception: {e}", symbol="❌")
                            logger_error(logger, f"💥 Executing Step [{step_id}] - Iteration {iteration} - Code execution failed", str(e))
                            current_iteration_output["success"] = False
                            current_iteration_output["error"] = f"Code execution failed: {str(e)}"
                            return current_iteration_output 
                    else:
                        logger_step(logger, f"🔄 Executing Step [{step_id}] - Iteration {iteration} - Agent returned No code or files, skipping execution...")

                else:
                    logger_error(logger, f"❌ Executing Step [{step_id}] - Iteration {iteration} - Agent Output not found", current_iteration_output["output"])
                    return current_iteration_output
                 # Store iteration data
                iterations_data.append({
                    "iteration": iteration, 
                    "output": current_iteration_output["output"] if current_iteration_output["success"] else None
                })
                
                # Update current result for next iteration
                previous_iteration_output = current_iteration_output
                result = current_iteration_output
                
                # Log the iteration result
                logger_json_block(logger, f"Execute Step: {step_id} - Iteration {iteration} Final Result", current_iteration_output)
            
            logger_json_block(logger, f"✅ {step_id} Completed with {iteration} interations, Iterations Data:", iterations_data)
            
            # Store final iteration data
            step_data['iterations'] = iterations_data
            step_data['call_self_used'] = True
            step_data['total_iterations'] = iteration

            #TODO: Incorporate the logic to find last successful iteration
            return result
        
        if result["success"] and "clarification_request" in result:
            log_step(f"🤔 {step_id}: Clarification needed", symbol="❓")
            
            # Get user input
            clarification = previous_iteration_output["clarification_request"]
            user_response = await self._get_user_input(clarification)
            
            # CREATE the actual node output (ClarificationAgent doesn't do this)
            result["output"] = {
                "user_choice": user_response,
                "clarification_provided": clarification["message"]
            }
            
            # Mark as successful
            result["success"] = True
        
        return result



