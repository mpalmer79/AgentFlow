import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.routers.workflows import workflows_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def clear_db():
    """Clear the database before each test."""
    workflows_db.clear()
    yield
    workflows_db.clear()


def test_list_workflows_empty():
    """Test listing workflows when empty."""
    response = client.get("/api/v1/workflows/")
    assert response.status_code == 200
    data = response.json()
    assert data["workflows"] == []
    assert data["total"] == 0


def test_create_workflow():
    """Test creating a workflow."""
    workflow = {
        "name": "Test Workflow",
        "description": "A test workflow",
        "nodes": [
            {
                "id": "input-1",
                "type": "input",
                "position": {"x": 0, "y": 0},
                "data": {"label": "Input", "inputType": "text"}
            }
        ],
        "edges": []
    }
    
    response = client.post("/api/v1/workflows/", json=workflow)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Workflow"
    assert data["id"] is not None


def test_get_workflow():
    """Test getting a specific workflow."""
    # Create workflow first
    workflow = {
        "name": "Test Workflow",
        "nodes": [],
        "edges": []
    }
    create_response = client.post("/api/v1/workflows/", json=workflow)
    workflow_id = create_response.json()["id"]
    
    # Get workflow
    response = client.get(f"/api/v1/workflows/{workflow_id}")
    assert response.status_code == 200
    assert response.json()["name"] == "Test Workflow"


def test_get_workflow_not_found():
    """Test getting a non-existent workflow."""
    response = client.get("/api/v1/workflows/nonexistent-id")
    assert response.status_code == 404


def test_update_workflow():
    """Test updating a workflow."""
    # Create workflow first
    workflow = {
        "name": "Original Name",
        "nodes": [],
        "edges": []
    }
    create_response = client.post("/api/v1/workflows/", json=workflow)
    workflow_id = create_response.json()["id"]
    
    # Update workflow
    updated = {
        "name": "Updated Name",
        "nodes": [],
        "edges": []
    }
    response = client.put(f"/api/v1/workflows/{workflow_id}", json=updated)
    assert response.status_code == 200
    assert response.json()["name"] == "Updated Name"


def test_delete_workflow():
    """Test deleting a workflow."""
    # Create workflow first
    workflow = {
        "name": "To Delete",
        "nodes": [],
        "edges": []
    }
    create_response = client.post("/api/v1/workflows/", json=workflow)
    workflow_id = create_response.json()["id"]
    
    # Delete workflow
    response = client.delete(f"/api/v1/workflows/{workflow_id}")
    assert response.status_code == 200
    assert response.json()["deleted"] == True
    
    # Verify it's gone
    get_response = client.get(f"/api/v1/workflows/{workflow_id}")
    assert get_response.status_code == 404


def test_duplicate_workflow():
    """Test duplicating a workflow."""
    # Create workflow first
    workflow = {
        "name": "Original",
        "description": "Original description",
        "nodes": [
            {
                "id": "input-1",
                "type": "input",
                "position": {"x": 0, "y": 0},
                "data": {"label": "Input", "inputType": "text"}
            }
        ],
        "edges": []
    }
    create_response = client.post("/api/v1/workflows/", json=workflow)
    workflow_id = create_response.json()["id"]
    
    # Duplicate workflow
    response = client.post(f"/api/v1/workflows/{workflow_id}/duplicate")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Original (Copy)"
    assert data["id"] != workflow_id
    assert len(data["nodes"]) == 1


def test_list_workflows_pagination():
    """Test pagination of workflow listing."""
    # Create multiple workflows
    for i in range(5):
        workflow = {
            "name": f"Workflow {i}",
            "nodes": [],
            "edges": []
        }
        client.post("/api/v1/workflows/", json=workflow)
    
    # Test limit
    response = client.get("/api/v1/workflows/?limit=2")
    data = response.json()
    assert len(data["workflows"]) == 2
    assert data["total"] == 5
    
    # Test offset
    response = client.get("/api/v1/workflows/?limit=2&offset=2")
    data = response.json()
    assert len(data["workflows"]) == 2
    assert data["offset"] == 2
