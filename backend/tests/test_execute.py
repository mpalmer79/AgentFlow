import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock

from app.main import app

client = TestClient(app)


def test_health_check():
    """Test health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_root_endpoint():
    """Test root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "AgentFlow API"
    assert data["version"] == "0.1.0"


def test_validate_workflow_empty():
    """Test validating an empty workflow."""
    request = {
        "nodes": [],
        "edges": [],
        "input": "test"
    }
    
    response = client.post("/api/v1/execute/validate", json=request)
    assert response.status_code == 200
    data = response.json()
    assert data["valid"] == True


def test_validate_workflow_missing_input():
    """Test validating a workflow without input node."""
    request = {
        "nodes": [
            {
                "id": "llm-1",
                "type": "llm",
                "position": {"x": 0, "y": 0},
                "data": {"label": "LLM", "model": "claude-4-sonnet", "prompt": "test"}
            }
        ],
        "edges": [],
        "input": "test"
    }
    
    response = client.post("/api/v1/execute/validate", json=request)
    assert response.status_code == 200
    data = response.json()
    assert data["valid"] == False
    assert any("Input node" in error for error in data["errors"])


def test_validate_workflow_missing_prompt():
    """Test validating a workflow with LLM missing prompt."""
    request = {
        "nodes": [
            {
                "id": "input-1",
                "type": "input",
                "position": {"x": 0, "y": 0},
                "data": {"label": "Input", "inputType": "text"}
            },
            {
                "id": "llm-1",
                "type": "llm",
                "position": {"x": 100, "y": 0},
                "data": {"label": "LLM", "model": "claude-4-sonnet", "prompt": ""}
            }
        ],
        "edges": [
            {"id": "e1", "source": "input-1", "target": "llm-1"}
        ],
        "input": "test"
    }
    
    response = client.post("/api/v1/execute/validate", json=request)
    assert response.status_code == 200
    data = response.json()
    assert data["valid"] == False
    assert any("prompt" in error.lower() for error in data["errors"])


def test_validate_workflow_no_output_warning():
    """Test validating a workflow without output node shows warning."""
    request = {
        "nodes": [
            {
                "id": "input-1",
                "type": "input",
                "position": {"x": 0, "y": 0},
                "data": {"label": "Input", "inputType": "text"}
            }
        ],
        "edges": [],
        "input": "test"
    }
    
    response = client.post("/api/v1/execute/validate", json=request)
    assert response.status_code == 200
    data = response.json()
    assert any("Output" in warning for warning in data["warnings"])


@patch('app.services.workflow_executor.ClaudeService')
def test_execute_simple_workflow(mock_claude_class):
    """Test executing a simple input -> output workflow."""
    request = {
        "nodes": [
            {
                "id": "input-1",
                "type": "input",
                "position": {"x": 0, "y": 0},
                "data": {"label": "Input", "inputType": "text"}
            },
            {
                "id": "output-1",
                "type": "output",
                "position": {"x": 200, "y": 0},
                "data": {"label": "Output", "outputType": "display"}
            }
        ],
        "edges": [
            {"id": "e1", "source": "input-1", "target": "output-1"}
        ],
        "input": "Hello World"
    }
    
    response = client.post("/api/v1/execute/", json=request)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert data["finalOutput"] == "Hello World"
    assert len(data["results"]) == 2


@patch('app.services.workflow_executor.ClaudeService')
def test_execute_with_llm(mock_claude_class):
    """Test executing a workflow with LLM node."""
    # Mock the Claude service
    mock_instance = AsyncMock()
    mock_instance.complete.return_value = "This is a test response"
    mock_claude_class.return_value = mock_instance
    
    request = {
        "nodes": [
            {
                "id": "input-1",
                "type": "input",
                "position": {"x": 0, "y": 0},
                "data": {"label": "Input", "inputType": "text"}
            },
            {
                "id": "llm-1",
                "type": "llm",
                "position": {"x": 200, "y": 0},
                "data": {"label": "LLM", "model": "claude-4-sonnet", "prompt": "Say hello to {{input}}"}
            },
            {
                "id": "output-1",
                "type": "output",
                "position": {"x": 400, "y": 0},
                "data": {"label": "Output", "outputType": "display"}
            }
        ],
        "edges": [
            {"id": "e1", "source": "input-1", "target": "llm-1"},
            {"id": "e2", "source": "llm-1", "target": "output-1"}
        ],
        "input": "World"
    }
    
    response = client.post("/api/v1/execute/", json=request)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert len(data["results"]) == 3


def test_execute_with_calculator():
    """Test executing a workflow with calculator tool."""
    request = {
        "nodes": [
            {
                "id": "input-1",
                "type": "input",
                "position": {"x": 0, "y": 0},
                "data": {"label": "Input", "inputType": "text"}
            },
            {
                "id": "tool-1",
                "type": "tool",
                "position": {"x": 200, "y": 0},
                "data": {"label": "Calculator", "toolType": "calculator"}
            },
            {
                "id": "output-1",
                "type": "output",
                "position": {"x": 400, "y": 0},
                "data": {"label": "Output", "outputType": "display"}
            }
        ],
        "edges": [
            {"id": "e1", "source": "input-1", "target": "tool-1"},
            {"id": "e2", "source": "tool-1", "target": "output-1"}
        ],
        "input": "2 + 2"
    }
    
    response = client.post("/api/v1/execute/", json=request)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert data["finalOutput"] == 4


def test_execute_with_transform_json():
    """Test executing a workflow with JSON transform."""
    request = {
        "nodes": [
            {
                "id": "input-1",
                "type": "input",
                "position": {"x": 0, "y": 0},
                "data": {"label": "Input", "inputType": "text"}
            },
            {
                "id": "transform-1",
                "type": "transform",
                "position": {"x": 200, "y": 0},
                "data": {"label": "Parse JSON", "transformType": "json-parse"}
            },
            {
                "id": "output-1",
                "type": "output",
                "position": {"x": 400, "y": 0},
                "data": {"label": "Output", "outputType": "display"}
            }
        ],
        "edges": [
            {"id": "e1", "source": "input-1", "target": "transform-1"},
            {"id": "e2", "source": "transform-1", "target": "output-1"}
        ],
        "input": '{"name": "test", "value": 123}'
    }
    
    response = client.post("/api/v1/execute/", json=request)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert data["finalOutput"]["name"] == "test"
    assert data["finalOutput"]["value"] == 123


def test_execute_returns_duration():
    """Test that execution returns duration."""
    request = {
        "nodes": [
            {
                "id": "input-1",
                "type": "input",
                "position": {"x": 0, "y": 0},
                "data": {"label": "Input", "inputType": "text"}
            }
        ],
        "edges": [],
        "input": "test"
    }
    
    response = client.post("/api/v1/execute/", json=request)
    assert response.status_code == 200
    data = response.json()
    assert "totalDuration" in data
    assert data["totalDuration"] >= 0
