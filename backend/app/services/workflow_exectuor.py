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
        
        # Build adjacency list
        self.outgoing: dict[str, list[str]] = defaultdict(list)
        self.incoming: dict[str, list[str]] = defaultdict(list)
        
        for edge in edges:
            self.outgoing[edge.source].append(edge.target)
            self.incoming[edge.target].append(edge.source)
        
        # Find start nodes (no incoming edges)
        self.start_nodes = [
            node_id for node_id in self.nodes
            if not self.incoming[node_id]
        ]
        
        self.claude = None
    
    def _get_claude(self) -> ClaudeService:
        """Lazy load Claude service."""
        if self.claude is None:
            self.claude = ClaudeService()
        return self.claude
    
    async def execute(self, initial_input: Any) -> list[NodeResult]:
        """Execute the workflow and return all results."""
        results = []
        
        async for result in self.execute_stream(initial_input):
            results.append(result)
        
        return results
    
    async def execute_stream(self, initial_input: Any) -> AsyncGenerator[NodeResult, None]:
        """Execute the workflow with streaming results."""
        
        # Initialize with input
        self.results["__input__"] = initial_input
        
        # Track executed nodes
        executed = set()
        
        # Process nodes in topological order
        queue = list(self.start_nodes)
        
        while queue:
            node_id = queue.pop(0)
            
            if node_id in executed:
                continue
            
            # Check if all dependencies are satisfied
            deps = self.incoming[node_id]
            if not all(dep in executed for dep in deps):
                queue.append(node_id)
                continue
            
            # Execute node
            node = self.nodes[node_id]
            result = await self._execute_node(node)
            
            yield result
            
            executed.add(node_id)
            
            # Store result for downstream nodes
            if result.status == "success":
                self.results[node_id] = result.output
            
            # Add downstream nodes to queue
            for next_node_id in self.outgoing[node_id]:
                if next_node_id not in executed:
                    queue.append(next_node_id)
    
    async def _execute_node(self, node: WorkflowNode) -> NodeResult:
        """Execute a single node."""
        start_time = time.time()
        
        try:
            # Gather inputs from upstream nodes
            node_input = self._gather_inputs(node.id)
            
            # Execute based on node type
            output = await self._process_node(node, node_input)
            
            duration = int((time.time() - start_time) * 1000)
            
            return NodeResult(
                nodeId=node.id,
                status="success",
                input=node_input,
                output=output,
                duration=duration,
            )
            
        except Exception as e:
            duration = int((time.time() - start_time) * 1000)
            
            return NodeResult(
                nodeId=node.id,
                status="error",
                error=str(e),
                duration=duration,
            )
    
    def _gather_inputs(self, node_id: str) -> Any:
        """Gather inputs from upstream nodes."""
        deps = self.incoming[node_id]
        
        if not deps:
            return self.results.get("__input__")
        
        if len(deps) == 1:
            return self.results.get(deps[0])
        
        # Multiple inputs - combine into dict
        return {
            dep: self.results.get(dep)
            for dep in deps
        }
    
    async def _process_node(self, node: WorkflowNode, input_data: Any) -> Any:
        """Process a node based on its type."""
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
        
        elif node_type == NodeType.LOOP:
            return self._process_loop(data, input_data)
        
        elif node_type == NodeType.TRANSFORM:
            return self._process_transform(data, input_data)
        
        elif node_type == NodeType.OUTPUT:
            return input_data
        
        else:
            raise ValueError(f"Unknown node type: {node_type}")
    
    async def _process_llm(self, data: Any, input_data: Any) -> str:
        """Process an LLM node."""
        prompt = data.prompt or ""
        
        # Replace template variables
        prompt = self._replace_variables(prompt, input_data)
        
        claude = self._get_claude()
        
        return await claude.complete(
            prompt=prompt,
            model=data.model or "claude-3-sonnet",
            temperature=data.temperature or 0.7,
            max_tokens=data.maxTokens or 1024,
        )
    
    async def _process_tool(self, data: Any, input_data: Any) -> Any:
        """Process a tool node."""
        tool_type = data.toolType
        
        if tool_type == "calculator":
            # Simple calculator
            try:
                expression = str(input_data)
                # Only allow safe characters
                if re.match(r'^[\d\s\+\-\*\/\.\(\)]+$', expression):
                    return eval(expression)
                else:
                    raise ValueError("Invalid expression")
            except Exception as e:
                raise ValueError(f"Calculator error: {e}")
        
        elif tool_type == "web-search":
            # Placeholder - would integrate with search API
            return f"Search results for: {input_data}"
        
        elif tool_type == "api-call":
            # Placeholder - would make HTTP request
            return {"status": "ok", "data": input_data}
        
        elif tool_type == "code-executor":
            # Placeholder - would execute code safely
            return f"Code execution result for: {input_data}"
        
        else:
            raise ValueError(f"Unknown tool type: {tool_type}")
    
    def _process_router(self, data: Any, input_data: Any) -> dict:
        """Process a router node."""
        condition = data.condition or "true"
        
        # Replace variables in condition
        condition = self._replace_variables(condition, input_data)
        
        try:
            # Safely evaluate condition
            result = eval(condition, {"__builtins__": {}}, {"input": input_data})
            return {"branch": "true" if result else "false", "value": input_data}
        except Exception:
            return {"branch": "false", "value": input_data}
    
    def _process_loop(self, data: Any, input_data: Any) -> list:
        """Process a loop node."""
        if not isinstance(input_data, list):
            return [input_data]
        
        max_iterations = data.maxIterations or 10
        return input_data[:max_iterations]
    
    def _process_transform(self, data: Any, input_data: Any) -> Any:
        """Process a transform node."""
        transform_type = data.transformType
        
        if transform_type == "json-parse":
            if isinstance(input_data, str):
                return json.loads(input_data)
            return input_data
        
        elif transform_type == "extract-field":
            field = data.config.get("field") if data.config else None
            if field and isinstance(input_data, dict):
                return input_data.get(field)
            return input_data
        
        elif transform_type == "format-text":
            template = data.config.get("template") if data.config else "{{input}}"
            return self._replace_variables(template, input_data)
        
        elif transform_type == "filter":
            if isinstance(input_data, list):
                condition = data.config.get("condition") if data.config else "true"
                return [
                    item for item in input_data
                    if eval(self._replace_variables(condition, item), {"__builtins__": {}}, {"item": item})
                ]
            return input_data
        
        else:
            return input_data
    
    def _replace_variables(self, template: str, data: Any) -> str:
        """Replace {{variable}} placeholders in template."""
        if not template:
            return ""
        
        # Replace {{input}} with the data
        result = template.replace("{{input}}", str(data) if data else "")
        
        # Replace {{key}} for dict data
        if isinstance(data, dict):
            for key, value in data.items():
                result = result.replace(f"{{{{{key}}}}}", str(value) if value else "")
        
        return result
