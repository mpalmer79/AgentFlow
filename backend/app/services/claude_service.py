import os
from typing import Optional
from anthropic import Anthropic, APIError

# Model mapping
MODEL_MAP = {
    "claude-3-opus": "claude-3-opus-20240229",
    "claude-3-sonnet": "claude-3-sonnet-20240229", 
    "claude-3-haiku": "claude-3-haiku-20240307",
}


class ClaudeService:
    """Service for interacting with Claude API."""
    
    def __init__(self):
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY environment variable is required")
        
        self.client = Anthropic(api_key=api_key)
    
    async def complete(
        self,
        prompt: str,
        model: str = "claude-3-sonnet",
        temperature: float = 0.7,
        max_tokens: int = 1024,
        system: Optional[str] = None,
    ) -> str:
        """Generate a completion from Claude."""
        
        # Map friendly model names to API model IDs
        model_id = MODEL_MAP.get(model, MODEL_MAP["claude-3-sonnet"])
        
        try:
            message = self.client.messages.create(
                model=model_id,
                max_tokens=max_tokens,
                temperature=temperature,
                system=system or "You are a helpful AI assistant.",
                messages=[
                    {"role": "user", "content": prompt}
                ],
            )
            
            # Extract text from response
            if message.content and len(message.content) > 0:
                return message.content[0].text
            
            return ""
            
        except APIError as e:
            raise Exception(f"Claude API error: {e.message}")
    
    async def complete_with_context(
        self,
        prompt: str,
        context: dict,
        model: str = "claude-3-sonnet",
        temperature: float = 0.7,
    ) -> str:
        """Generate a completion with additional context."""
        
        # Build context string
        context_str = "\n".join([
            f"{key}: {value}" for key, value in context.items()
        ])
        
        full_prompt = f"""Context:
{context_str}

Task:
{prompt}"""
        
        return await self.complete(
            prompt=full_prompt,
            model=model,
            temperature=temperature,
        )
