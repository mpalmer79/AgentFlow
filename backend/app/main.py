from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routers import workflows, execute

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="AgentFlow API",
    description="Backend API for AgentFlow - Visual AI Workflow Builder",
    version="0.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # Alternative dev port
        "https://*.railway.app",  # Railway deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(workflows.router, prefix="/api/v1/workflows", tags=["workflows"])
app.include_router(execute.router, prefix="/api/v1/execute", tags=["execute"])


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "agentflow-api"}


@app.get("/")
async def root():
    """Root endpoint with API info."""
    return {
        "name": "AgentFlow API",
        "version": "0.1.0",
        "docs": "/docs",
    }
