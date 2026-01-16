import os
from typing import Optional

MODEL_MAP = {
    "claude-4-opus": "claude-opus-4-5-20251101",
    "claude-4-sonnet": "claude-sonnet-4-20250514",
    "claude-4-haiku": "claude-haiku-4-5-20251001",
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
        model: str = "claude-4-sonnet",
        temperature: float = 0.7,
        max_tokens: int = 1024,
        system: Optional[str] = None,
    ) -> str:
        """Generate a completion from Claude."""
        
        if not self.client:
            return "[Claude API not configured - add ANTHROPIC_API_KEY to enable AI features]"
        
        model_id = MODEL_MAP.get(model, MODEL_MAP["claude-4-sonnet"])
        
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
