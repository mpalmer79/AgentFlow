from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import asyncio
import json
import time

from app.models.workflow import ExecuteRequest, ExecuteResponse, NodeResult
from app.services.workflow_executor import WorkflowExecutor

router = APIRouter()


@router.post("/")
async def execute_workflow(request: ExecuteRequest) -> ExecuteResponse:
    """Execute a workflow and return results."""
    start_time = time.time()
    
    try:
        executor = WorkflowExecutor(request.nodes, request.edges)
        results = await executor.execute(request.input)
        
        total_duration = int((time.time() - start_time) * 1000)
        
        # Get final output from last output node
        final_output = None
        for result in reversed(results):
            if result.status == "success" and result.output is not None:
                final_output = result.output
                break
        
        return ExecuteResponse(
            success=all(r.status == "success" for r in results),
            results=results,
            finalOutput=final_output,
            totalDuration=total_duration,
        )
        
    except Exception as e:
        total_duration = int((time.time() - start_time) * 1000)
        return ExecuteResponse(
            success=False,
            results=[
                NodeResult(
                    nodeId="error",
                    status="error",
                    error=str(e),
                )
            ],
            finalOutput=None,
            totalDuration=total_duration,
        )


@router.post("/stream")
async def execute_workflow_stream(request: ExecuteRequest):
    """Execute a workflow with streaming results."""
    
    async def generate():
        try:
            executor = WorkflowExecutor(request.nodes, request.edges)
            
            async for result in executor.execute_stream(request.input):
                yield f"data: {json.dumps(result.model_dump())}\n\n"
                
            yield f"data: {json.dumps({'type': 'complete'})}\n\n"
            
        except Exception as e:
            error_data = {
                "type": "error",
                "error": str(e),
            }
            yield f"data: {json.dumps(error_data)}\n\n"
    
    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    )


@router.post("/validate")
async def validate_workflow(request: ExecuteRequest) -> dict:
    """Validate a workflow without executing it."""
    errors = []
    warnings = []
    
    nodes_by_id = {node.id: node for node in request.nodes}
    
    # Check for orphan nodes (no connections)
    connected_nodes = set()
    for edge in request.edges:
        connected_nodes.add(edge.source)
        connected_nodes.add(edge.target)
    
    for node in request.nodes:
        if node.id not in connected_nodes and len(request.nodes) > 1:
            warnings.append(f"Node '{node.data.label}' has no connections")
    
    # Check for missing input nodes
    has_input = any(node.type == "input" for node in request.nodes)
    if not has_input and len(request.nodes) > 0:
        errors.append("Workflow must have at least one Input node")
    
    # Check for missing output nodes
    has_output = any(node.type == "output" for node in request.nodes)
    if not has_output and len(request.nodes) > 0:
        warnings.append("Workflow has no Output node - results may not be visible")
    
    # Check LLM nodes have prompts
    for node in request.nodes:
        if node.type == "llm" and not node.data.prompt:
            errors.append(f"LLM node '{node.data.label}' has no prompt configured")
    
    # Check for cycles (basic check)
    # TODO: Implement proper cycle detection
    
    return {
        "valid": len(errors) == 0,
        "errors": errors,
        "warnings": warnings,
    }
