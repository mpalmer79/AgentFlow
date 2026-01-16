import os
from typing import Optional

MODEL_MAP = {
    "claude-3-opus": "claude-3-opus-20240229",
    "claude-3-sonnet": "claude-3-sonnet-20240229", 
    "claude-3-haiku": "claude-3-haiku-20240307",
}


class ClaudeService:
    """Service for interacting with Claude API."""
    
    def __init__(self):
        self.api_key = os.getenv("ANTHROPIC_API_KEY")
        self.client = None
        
        if self.api_key:
            from anthropic import Anthropic
            self.client = Anthropic(api_key=self.api_key)
    
    async def complete(
        self,
        prompt: str,
        model: str = "claude-3-sonnet",
        temperature: float = 0.7,
        max_tokens: int = 1024,
        system: Optional[str] = None,
    ) -> str:
        """Generate a completion from Claude."""
        
        if not self.client:
            return "[Claude API not configured - add ANTHROPIC_API_KEY to enable AI features]"
        
        model_id = MODEL_MAP.get(model, MODEL_MAP["claude-3-sonnet"])
        
        try:
            message = self.client.messages.create(
                model=model_id,
                max_tokens=max_tokens,
                temperature=temperature,
                system=system or "You are a helpful AI assistant.",
                messages=[{"role": "user", "content": prompt}],
            )
            
            if message.content and len(message.content) > 0:
                return message.content[0].text
            return ""
            
        except Exception as e:
            return f"[Claude API error: {str(e)}]"
