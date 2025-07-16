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
from config.log_config import get_logger, logger_step, logger_json_block, logger_prompt, logger_code_block , logger_error

logger = get_logger(__name__)    


class AgentLoop4:
    def __init__(self, multi_mcp, strategy="conservative", max_self_iter=5):
        self.multi_mcp = multi_mcp
        self.strategy = strategy
        self.agent_runner = AgentRunner(multi_mcp)
        self.max_self_iter = max_self_iter  # Maximum number of call_self iterations

    async def run(self, query, file_manifest, uploaded_files):
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
                }
            )
            if file_result["success"]:
                file_profiles = file_result["output"]
                logger_json_block(logger, "Phase 1: File Profiling - File Profiles", file_profiles)
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
            }
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
            file_manifest=file_manifest
        )
        
        context.set_multi_mcp(self.multi_mcp)
        
        # Store initial files in output chain
        if file_profiles:
            context.plan_graph.graph['output_chain']['file_profiles'] = file_profiles
            logger_json_block(logger, "Phase 2: Plan Graph - File Profiles", file_profiles)

        # Store uploaded files directly
        for file_info in file_manifest:
            context.plan_graph.graph['output_chain'][file_info['name']] = file_info['path']
            logger_json_block(logger, "Phase 2: Plan Graph - File Manifest", file_manifest)

        # Phase 4: Execute with simple output chaining
        await self._execute_dag(context)
        logger_step(logger, "Phase 4: Execution - Executing DAG Complete")
        #logger_json_block(logger, "Phase 4: Execution - Execution Context", context.plan_graph.graph)
        return context

    async def _execute_dag(self, context):
        """Execute DAG with simple output chaining"""
        visualizer = ExecutionVisualizer(context)
        console = Console()
        
        MAX_CONCURRENT_AGENTS = 4
        max_iterations = 20
        iteration = 0

        logger_step(logger, "Phase 4: Execution - DAG Execution Started")

        while not context.all_done() and iteration < max_iterations:
            iteration += 1
            console.print(visualizer.get_layout())
            
            ready_steps = context.get_ready_steps()
            logger_step(logger, f"Executing DAG: Iteration {iteration} - Ready Steps: {ready_steps}")
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
            logger_step(logger, f"Executing DAG: Iteration {iteration} - Executing Batch: {current_batch}")

            # Mark running
            for step_id in current_batch:
                context.mark_running(step_id)
            
            # Execute batch
            tasks = [self._execute_step(step_id, context) for step_id in current_batch]
            results = await asyncio.gather(*tasks, return_exceptions=True)

            # Process results - SIMPLE!
            for step_id, result in zip(current_batch, results):
                if isinstance(result, Exception):
                    logger_error(logger, f"Execute Step: {step_id} - Exception, calling mark_failed", result)
                    context.mark_failed(step_id, str(result))
                elif result["success"]:
                    logger_step(logger, f"Execute Step: {step_id} - Success, Calling mark_done")
                    await context.mark_done(step_id, result["output"])
                else:
                    context.mark_failed(step_id, result["error"])

            if len(ready_steps) > batch_size:
                await asyncio.sleep(1)

    async def _execute_step(self, step_id, context):
        """SIMPLE: Execute step with direct output passing and code execution"""
        step_data = context.get_step_data(step_id)
        agent_type = step_data["agent"]
        
        # SIMPLE: Get raw outputs from previous steps
        inputs = context.get_inputs(step_data.get("reads", []))

        logger_json_block(logger, f"Execute Step: {step_id} - Step Inputs", inputs)
        
        # Build agent input
        def build_agent_input(instruction=None, previous_output=None):
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
        agent_input = build_agent_input()

        logger_json_block(logger, f"Execute Step: {step_id} - Agent Input", agent_input)
        result = await self.agent_runner.run_agent(agent_type, agent_input)
        logger_json_block(logger, f"Execute Step: {step_id} - Agent Result", result)
        
        # NEW: Handle code execution if agent returned code variants
        if result["success"] and "code" in result["output"]:
            log_step(f"🔧 {step_id}: Agent returned code variants, executing...", symbol="⚙️")
            
            # Prepare executor input
            executor_input = {
                "code_variants": result["output"]["code"],  # CODE_1, CODE_2, etc.
            }

            logger_json_block(logger, f"Execute Step: {step_id} - Executor Input - Code Variants", executor_input)
            logger_json_block(logger, f"Execute Step: {step_id} - Step Inputs", inputs)
            
            # Execute code variants sequentially until one succeeds
            try:
                execution_result = await run_user_code(
                    executor_input, 
                    self.multi_mcp, 
                    context.plan_graph.graph['session_id'] or "default_session",
                    inputs,  # Pass inputs to code execution
                    step_id
                )

                logger_json_block(logger, f"Execute Step: {step_id} - Executor Result", execution_result)
                
                # Handle execution results
                if execution_result["status"] == "success":
                    log_step(f"✅ {step_id}: Code execution succeeded", symbol="🎉")
                    logger_step(logger, f"✅ {step_id}: Code execution succeeded")
                    
                    # Extract the actual result from code execution
                    #code_output = execution_result.get("code_results", {}).get("result", {})

                    logger_json_block(logger, f"Execute Step: {step_id} - Execution Output", execution_result) #This has the varaiale alone
                    logger_json_block(logger, f"Execute Step: {step_id} - Agent Output", result["output"])

                    
                    # Combine agent output with code execution results
                    #combined_output = {
                    #    #**result["output"].get("output", {}),  # Agent's direct output
                    #    **result["output"], # Agent's direct output
                    #    **code_output  # Code execution results
                    #}

                    combined_agent_output = await context.merge_execution_results(step_id, result["output"], execution_result)
                    
                    # After this step result["output"] has the agent output and the variable alone
                    
                    # Update result with combined output
                    #result["output"] = combined_output

                    #need to change result["output"] to combined_agent_output'
                    result["output"] = combined_agent_output

                    logger_json_block(logger, f"Execute Step: {step_id} - Combined Agent Output", result["output"])
                    
                elif execution_result["status"] == "partial_failure":
                    log_step(f"⚠️ {step_id}: Code execution partial failure", symbol="⚠️")
                    
                    # Try to extract any successful results
                    #### Handle the partial failure
                    code_output = execution_result.get("code_results", {}).get("result", {})
                    if code_output:
                        combined_output = {
                            **result["output"].get("output", {}),
                            **code_output
                        }
                        previous_output = result["output"]
                        result["output"] = combined_output
                    else:
                        # Mark as failed
                        result["success"] = False
                        result["error"] = f"Code execution failed: {execution_result.get('error', 'Unknown error')}"
                        
                else:
                    log_step(f"❌ {step_id}: Code execution failed", symbol="🚨")
                    result["success"] = False
                    result["error"] = f"Code execution failed: {execution_result.get('error', 'Unknown error')}"


                # The check for call_Self should be done here
                
            except Exception as e:
                log_step(f"💥 {step_id}: Code execution exception: {e}", symbol="❌")
                result["success"] = False
                result["error"] = f"Code execution exception: {str(e)}"
        
        # Handle call_self if needed
        if result["success"] and result["output"].get("call_self"):
            log_step(f"🔄 CALL_SELF triggered for {step_id}", symbol="🔄")
            logger_step(logger, f"🔄 CALL_SELF triggered for {step_id}")
            
            # Initialize iteration tracking
            current_iteration = 1
            iterations_data = [{"iteration": 1, "output": result["output"]}]
            current_result = result
            
            # While loop for call_self iterations
            while (current_result["success"] and 
                   current_result["output"].get("call_self") and 
                   current_iteration < self.max_self_iter):
                
                current_iteration += 1
                log_step(f"🔄 CALL_SELF iteration {current_iteration} for {step_id}", symbol="🔄")
                logger_step(logger, f"🔄 CALL_SELF iteration {current_iteration} for {step_id}")
                
                # Build input for next iteration
                next_input = build_agent_input(
                    instruction=current_result["output"].get("next_instruction", "Continue"),
                    previous_output=current_result["output"]
                )

                logger_json_block(logger, f"Execute Step: {step_id}, iteration {current_iteration} - Agent Input", next_input)
                
                # Run next iteration
                next_result = await self.agent_runner.run_agent(agent_type, next_input)

                logger_json_block(logger, f"Execute Step: {step_id}, iteration {current_iteration} - Agent Result", next_result)
                
                # Handle code execution for this iteration too
                if next_result["success"] and "code" in next_result["output"]:
                    log_step(f"🔧 {step_id}: Iteration {current_iteration} returned code variants", symbol="⚙️")
                    logger_step(logger, f"🔧 {step_id}: Iteration {current_iteration} returned code variants")
                    
                    executor_input = {
                        "code_variants": next_result["output"]["code"],
                    }

                    try:
                        execution_result = await run_user_code(
                            executor_input,
                            self.multi_mcp,
                            context.plan_graph.graph['session_id'] or "default_session",
                            {**inputs, **next_input}
                        )

                        logger_json_block(logger, f"Execute Step: {step_id}, iteration {current_iteration} - Executor Result", execution_result)
                        logger_json_block(logger, f"Execute Step: {step_id}, iteration {current_iteration} - Agent Result", next_result)
                        
                        if execution_result["status"] == "success":
                            code_output = execution_result.get("code_results", {}).get("result", {})
                            combined_output = {
                                **next_result["output"],
                                #**next_result["output"].get("output", {}),
                                **code_output
                            }
                            next_result["output"] = combined_output
                            logger_json_block(logger, f"Execute Step: {step_id}, iteration {current_iteration} - Combined Output", combined_output)
                        else:
                            next_result["success"] = False
                            next_result["error"] = f"Code execution failed: {execution_result.get('error')}"
                            
                    except Exception as e:
                        next_result["success"] = False
                        next_result["error"] = f"Code execution exception: {str(e)}"
                
                # Store iteration data
                iterations_data.append({
                    "iteration": current_iteration, 
                    "output": next_result["output"] if next_result["success"] else None
                })
                
                # Update current result for next iteration
                current_result = next_result
                
                # Log the iteration result
                logger_json_block(logger, f"Execute Step: {step_id} - Iteration {current_iteration} Final Result", next_result)
            
            # Store final iteration data
            step_data['iterations'] = iterations_data
            step_data['call_self_used'] = True
            step_data['total_iterations'] = current_iteration
            
            # Return the final result (last successful iteration or fallback to previous)
            if current_result["success"]:
                return current_result
            else:
                # Find the last successful iteration
                for iteration_data in reversed(iterations_data):
                    if iteration_data["output"] is not None:
                        return {"success": True, "output": iteration_data["output"]}
                # Fallback to original result
                return result
        
        if result["success"] and "clarification_request" in result:
            log_step(f"🤔 {step_id}: Clarification needed", symbol="❓")
            
            # Get user input
            clarification = result["clarification_request"]
            user_response = await self._get_user_input(clarification)
            
            # CREATE the actual node output (ClarificationAgent doesn't do this)
            result["output"] = {
                "user_choice": user_response,
                "clarification_provided": clarification["message"]
            }
            
            # Mark as successful
            result["success"] = True
        
        return result

