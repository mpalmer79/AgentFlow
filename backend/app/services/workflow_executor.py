import time
import json
import re
from typing import Any, AsyncGenerator
from collections import defaultdict

from app.models.workflow import WorkflowNode, WorkflowEdge, NodeResult, NodeType
from app.services.claude_service import ClaudeService


class WorkflowExecutor:
    """Executes workflow graphs."""
    
    def __init__(self, nodes: list[WorkflowNode], edges: list[WorkflowEdge]):
        self.nodes = {node.id: node for node in nodes}
        self.edges = edges
        self.results: dict[str, Any] = {}
        
        self.outgoing: dict[str, list[str]] = defaultdict(list)
        self.incoming: dict[str, list[str]] = defaultdict(list)
        
        for edge in edges:
            self.outgoing[edge.source].append(edge.target)
            self.incoming[edge.target].append(edge.source)
        
        self.start_nodes = [
            node_id for node_id in self.nodes
            if not self.incoming[node_id]
        ]
        
        self.claude = None
    
    def _get_claude(self) -> ClaudeService:
        if self.claude is None:
            self.claude = ClaudeService()
        return self.claude
    
    async def execute(self, initial_input: Any) -> list[NodeResult]:
        results = []
        async for result in self.execute_stream(initial_input):
            results.append(result)
        return results
    
    async def execute_stream(self, initial_input: Any) -> AsyncGenerator[NodeResult, None]:
        self.results["__input__"] = initial_input
        executed = set()
        queue = list(self.start_nodes)
        
        while queue:
            node_id = queue.pop(0)
            if node_id in executed:
                continue
            
            deps = self.incoming[node_id]
            if not all(dep in executed for dep in deps):
                queue.append(node_id)
                continue
            
            node = self.nodes[node_id]
            result = await self._execute_node(node)
            yield result
            executed.add(node_id)
            
            if result.status == "success":
                self.results[node_id] = result.output
            
            for next_node_id in self.outgoing[node_id]:
                if next_node_id not in executed:
                    queue.append(next_node_id)
    
    async def _execute_node(self, node: WorkflowNode) -> NodeResult:
        start_time = time.time()
        try:
            node_input = self._gather_inputs(node.id)
            output = await self._process_node(node, node_input)
            duration = int((time.time() - start_time) * 1000)
            return NodeResult(nodeId=node.id, status="success", input=node_input, output=output, duration=duration)
        except Exception as e:
            duration = int((time.time() - start_time) * 1000)
            return NodeResult(nodeId=node.id, status="error", error=str(e), duration=duration)
    
    def _gather_inputs(self, node_id: str) -> Any:
        deps = self.incoming[node_id]
        if not deps:
            return self.results.get("__input__")
        if len(deps) == 1:
            return self.results.get(deps[0])
        return {dep: self.results.get(dep) for dep in deps}
    
    async def _process_node(self, node: WorkflowNode, input_data: Any) -> Any:
        node_type = node.type
        data = node.data
        
        if node_type == NodeType.INPUT:
            return input_data
        elif node_type == NodeType.LLM:
            return await self._process_llm(data, input_data)
        elif node_type == NodeType.TOOL:
            return await self._process_tool(data, input_data)
        elif node_type == NodeType.ROUTER:
            return self._process_router(data, input_data)
        elif node_type == NodeType.TRANSFORM:
            return self._process_transform(data, input_data)
        elif node_type == NodeType.OUTPUT:
            return input_data
        else:
            raise ValueError(f"Unknown node type: {node_type}")
    
    async def _process_llm(self, data: Any, input_data: Any) -> str:
        prompt = data.prompt or ""
        prompt = self._replace_variables(prompt, input_data)
        claude = self._get_claude()
        return await claude.complete(prompt=prompt, model=data.model or "claude-3-sonnet", temperature=data.temperature or 0.7)
    
    async def _process_tool(self, data: Any, input_data: Any) -> Any:
        tool_type = data.toolType
        if tool_type == "calculator":
            expression = str(input_data)
            if re.match(r'^[\d\s\+\-\*\/\.\(\)]+$', expression):
                return eval(expression)
            raise ValueError("Invalid expression")
        elif tool_type == "web-search":
            return f"Search results for: {input_data}"
        elif tool_type == "api-call":
            return {"status": "ok", "data": input_data}
        else:
            raise ValueError(f"Unknown tool type: {tool_type}")
    
    def _process_router(self, data: Any, input_data: Any) -> dict:
        condition = data.condition or "true"
        condition = self._replace_variables(condition, input_data)
        try:
            result = eval(condition, {"__builtins__": {}}, {"input": input_data})
            return {"branch": "true" if result else "false", "value": input_data}
        except Exception:
            return {"branch": "false", "value": input_data}
    
    def _process_transform(self, data: Any, input_data: Any) -> Any:
        transform_type = data.transformType
        if transform_type == "json-parse":
            return json.loads(input_data) if isinstance(input_data, str) else input_data
        elif transform_type == "extract-field":
            field = data.config.get("field") if data.config else None
            return input_data.get(field) if field and isinstance(input_data, dict) else input_data
        elif transform_type == "format-text":
            template = data.config.get("template") if data.config else "{{input}}"
            return self._replace_variables(template, input_data)
        return input_data
    
    def _replace_variables(self, template: str, data: Any) -> str:
        if not template:
            return ""
        result = template.replace("{{input}}", str(data) if data else "")
        if isinstance(data, dict):
            for key, value in data.items():
                result = result.replace(f"{{{{{key}}}}}", str(value) if value else "")
        return result
