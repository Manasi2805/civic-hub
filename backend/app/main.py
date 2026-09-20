from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.database import engine, Base
from app.routes import complaints, routing, verification, dashboard

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Civic Hub API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for uploads
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Include routers
app.include_router(complaints.router)
app.include_router(routing.router)
app.include_router(verification.router)
app.include_router(dashboard.router)

@app.get("/")
def root():
    return {"message": "Welcome to Civic Hub API"}
