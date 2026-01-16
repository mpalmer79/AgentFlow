FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app/ ./app/

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

**File 37: `backend/requirements.txt`**
```
fastapi==0.111.0
uvicorn[standard]==0.30.1
pydantic==2.7.4
python-dotenv==1.0.1
httpx==0.27.0
anthropic==0.28.0
pytest==8.2.2
pytest-asyncio==0.23.7
pytest-cov==5.0.0
