from typing import Optional, Any, Literal
from pydantic import BaseModel, Field
from enum import Enum


class NodeType(str, Enum):
    INPUT = "input"
    LLM = "llm"
    TOOL = "tool"
    ROUTER = "router"
    LOOP = "loop"
    TRANSFORM = "transform"
    OUTPUT = "output"


class NodeData(BaseModel):
    """Base data for all node types."""
    label: str
    description: Optional[str] = None
    
    # Input node fields
    inputType: Optional[Literal["text", "file", "webhook"]] = None
    placeholder: Optional[str] = None
    
    # LLM node fields
    model: Optional[Literal["claude-4-opus", "claude-4-sonnet", "claude-4-haiku"]] = None
    prompt: Optional[str] = None
    temperature: Optional[float] = Field(default=0.7, ge=0, le=1)
    maxTokens: Optional[int] = None
    
    # Tool node fields
    toolType: Optional[Literal["web-search", "calculator", "code-executor", "api-call"]] = None
    config: Optional[dict[str, Any]] = None
    
    # Router node fields
    condition: Optional[str] = None
    trueLabel: Optional[str] = None
    falseLabel: Optional[str] = None
    
    # Loop node fields
    iteratorVariable: Optional[str] = None
    maxIterations: Optional[int] = None
    
    # Transform node fields
    transformType: Optional[Literal["json-parse", "extract-field", "format-text", "filter"]] = None
    
    # Output node fields
    outputType: Optional[Literal["display", "file", "api-response"]] = None
    format: Optional[str] = None


class Position(BaseModel):
    """Node position on canvas."""
    x: float
    y: float


class WorkflowNode(BaseModel):
    """A node in the workflow."""
    id: str
    type: NodeType
    position: Position
    data: NodeData


class WorkflowEdge(BaseModel):
    """An edge connecting two nodes."""
    id: str
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None


class Workflow(BaseModel):
    """Complete workflow definition."""
    id: Optional[str] = None
    name: str
    description: Optional[str] = None
    nodes: list[WorkflowNode]
    edges: list[WorkflowEdge]


class ExecuteRequest(BaseModel):
    """Request to execute a workflow."""
    nodes: list[WorkflowNode]
    edges: list[WorkflowEdge]
    input: Any


class NodeResult(BaseModel):
    """Result of executing a single node."""
    nodeId: str
    status: Literal["success", "error", "running"]
    input: Optional[Any] = None
    output: Optional[Any] = None
    error: Optional[str] = None
    duration: Optional[int] = None  # milliseconds


class ExecuteResponse(BaseModel):
    """Response from workflow execution."""
    success: bool
    results: list[NodeResult]
    finalOutput: Optional[Any] = None
    totalDuration: int  # milliseconds
