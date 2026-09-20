
# Local Setup Guide

## Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Git

## Step 1: Backend Setup
```bash
cd backend
python -m venv venv

# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
