from fastapi import APIRouter, HTTPException
from typing import Optional
from uuid import uuid4

from app.models.workflow import Workflow

router = APIRouter()

# In-memory storage (replace with database in production)
workflows_db: dict[str, Workflow] = {}


@router.get("/")
async def list_workflows(
    limit: int = 10,
    offset: int = 0,
) -> dict:
    """List all workflows with pagination."""
    all_workflows = list(workflows_db.values())
    total = len(all_workflows)
    workflows = all_workflows[offset:offset + limit]
    
    return {
        "workflows": workflows,
        "total": total,
        "limit": limit,
        "offset": offset,
    }


@router.get("/{workflow_id}")
async def get_workflow(workflow_id: str) -> Workflow:
    """Get a specific workflow by ID."""
    if workflow_id not in workflows_db:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    return workflows_db[workflow_id]


@router.post("/")
async def create_workflow(workflow: Workflow) -> Workflow:
    """Create a new workflow."""
    workflow_id = str(uuid4())
    workflow.id = workflow_id
    workflows_db[workflow_id] = workflow
    
    return workflow


@router.put("/{workflow_id}")
async def update_workflow(workflow_id: str, workflow: Workflow) -> Workflow:
    """Update an existing workflow."""
    if workflow_id not in workflows_db:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    workflow.id = workflow_id
    workflows_db[workflow_id] = workflow
    
    return workflow


@router.delete("/{workflow_id}")
async def delete_workflow(workflow_id: str) -> dict:
    """Delete a workflow."""
    if workflow_id not in workflows_db:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    del workflows_db[workflow_id]
    
    return {"deleted": True, "id": workflow_id}


@router.post("/{workflow_id}/duplicate")
async def duplicate_workflow(workflow_id: str) -> Workflow:
    """Duplicate an existing workflow."""
    if workflow_id not in workflows_db:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    original = workflows_db[workflow_id]
    new_id = str(uuid4())
    
    duplicate = Workflow(
        id=new_id,
        name=f"{original.name} (Copy)",
        description=original.description,
        nodes=original.nodes,
        edges=original.edges,
    )
    
    workflows_db[new_id] = duplicate
    
    return duplicate
