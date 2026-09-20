from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List
import shutil
import os
from datetime import datetime
import uuid
from app.schemas import CitizenLoginRequest, CitizenAuthResponse
from app.database import get_db
from app.models import Complaint, ComplaintHistory, VerificationResult
from app.schemas import ComplaintResponse, ComplaintUpdate, HistoryEntry
from app.services.routing_engine import resolve_jurisdiction
from app.services.verification_engine import verify_complaint

router = APIRouter(prefix="/api/complaints", tags=["complaints"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/", response_model=ComplaintResponse)
async def create_complaint(
    issue_type: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    description: Optional[str] = Form(None),
    reporter_name: Optional[str] = Form(None),
    reporter_phone: Optional[str] = Form(None),
    reporter_email: Optional[str] = Form(None),
    photo: Optional[UploadFile] = File(None),
    video: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    # Generate ID
    count = db.query(Complaint).count() + 1
    complaint_id = f"MYS-2026-{count:05d}"
    
    photo_url = None
    if photo:
        photo_path = os.path.join(UPLOAD_DIR, f"{complaint_id}_photo_{photo.filename}")
        with open(photo_path, "wb") as buffer:
            shutil.copyfileobj(photo.file, buffer)
        photo_url = f"/uploads/{os.path.basename(photo_path)}"
        
    video_url = None
    if video:
        video_path = os.path.join(UPLOAD_DIR, f"{complaint_id}_video_{video.filename}")
        with open(video_path, "wb") as buffer:
            shutil.copyfileobj(video.file, buffer)
        video_url = f"/uploads/{os.path.basename(video_path)}"
        
    # Verification
    ver_res = verify_complaint(db, latitude, longitude, issue_type, bool(photo_url))
    
    # Routing
    route_res = resolve_jurisdiction(latitude, longitude, issue_type, datetime.utcnow())
    
    status = "verified" if ver_res["decision"] == "likely_genuine" else "submitted"
    if ver_res["decision"] == "likely_genuine" and route_res["matched"]:
        status = "routed"
        
    db_complaint = Complaint(
        id=complaint_id,
        reporter_name=reporter_name,
        reporter_phone=reporter_phone,
        reporter_email=reporter_email,
        issue_type=issue_type,
        description=description,
        latitude=latitude,
        longitude=longitude,
        photo_url=photo_url,
        video_url=video_url,
        status=status,
        verification_score=ver_res["confidence"],
        verification_decision=ver_res["decision"],
        authority_name=route_res.get("authority"),
        routing_explanation=route_res.get("explanation")
    )
    db.add(db_complaint)
    
    # Add history
    db_history = ComplaintHistory(
        complaint_id=complaint_id,
        status="submitted",
        message="Complaint submitted successfully.",
        changed_by="system"
    )
    db.add(db_history)
    
    db_ver = VerificationResult(
        complaint_id=complaint_id,
        metadata_check=ver_res["signals"]["metadata_check"],
        location_match=ver_res["signals"]["location_match"],
        duplicate_score=ver_res["signals"]["duplicate_score"],
        history_score=ver_res["signals"]["history_score"],
        spatial_score=ver_res["signals"]["spatial_score"],
        final_score=ver_res["confidence"],
        decision=ver_res["decision"],
        explanation=ver_res["explanation"]
    )
    db.add(db_ver)
    
    db.commit()
    db.refresh(db_complaint)
    
    return db_complaint

@router.get("/{complaint_id}", response_model=ComplaintResponse)
def get_complaint(complaint_id: str, db: Session = Depends(get_db)):
    comp = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return comp

@router.patch("/{complaint_id}/status", response_model=ComplaintResponse)
def update_status(complaint_id: str, update_data: ComplaintUpdate, db: Session = Depends(get_db)):
    comp = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    history_messages = []
    
    # Update status if present
    if update_data.status:
        comp.status = update_data.status
        history_messages.append(f"Status changed to {update_data.status.replace('_', ' ').title()}")
        
    # Update priority if present (supports priority or priority_score columns)
    if update_data.priority is not None:
        if hasattr(comp, "priority"):
            comp.priority = update_data.priority
        if hasattr(comp, "priority_score"):
            # Map string labels to numeric scores if priority_score is a numeric column
            priority_map = {"High": 3.0, "Medium": 2.0, "Low": 1.0}
            comp.priority_score = priority_map.get(update_data.priority, 1.0) if isinstance(update_data.priority, str) else float(update_data.priority)
        history_messages.append(f"Priority updated to {update_data.priority}")
    
    # Construct history entry message
    entry_msg = update_data.message or (" & ".join(history_messages) if history_messages else "Details updated by authority.")
    
    db_history = ComplaintHistory(
        complaint_id=complaint_id,
        status=comp.status,
        message=entry_msg,
        changed_by="authority"
    )
    db.add(db_history)
    db.commit()
    db.refresh(comp)
    return comp

@router.get("/{complaint_id}/history", response_model=List[HistoryEntry])
def get_history(complaint_id: str, db: Session = Depends(get_db)):
    hist = db.query(ComplaintHistory).filter(ComplaintHistory.complaint_id == complaint_id).order_by(ComplaintHistory.created_at).all()
    return hist
from app.schemas import CitizenLoginRequest, CitizenAuthResponse

@router.post("/citizen/login", response_model=CitizenAuthResponse)
def citizen_login(payload: CitizenLoginRequest, db: Session = Depends(get_db)):
    identifier = payload.phone_or_email.strip()
    if not identifier:
        raise HTTPException(status_code=400, detail="Phone number or email is required.")

    # Find existing complaints filed by this citizen to auto-resolve name if not provided
    existing = db.query(Complaint).filter(
        (Complaint.reporter_phone == identifier) | (Complaint.reporter_email == identifier)
    ).first()

    name = payload.full_name or (existing.reporter_name if existing and existing.reporter_name else "Citizen")

    # Simple session token for citizen access
    token = f"citizen_{uuid.uuid4().hex[:12]}"

    return {
        "token": token,
        "phone_or_email": identifier,
        "full_name": name
    }
    @router.patch("/complaints/{id}/status")
    def update_complaint_status(id: str, payload: ComplaintStatusUpdate, db: Session = Depends(get_db)):
      complaint = db.query(Complaint).filter(Complaint.id == id).first()
      if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
      if payload.status:
        complaint.status = payload.status
      if payload.priority is not None:
        complaint.priority = payload.priority
        
      complaint.updated_at = datetime.datetime.utcnow()
      db.commit()
      db.refresh(complaint)
      return complaint