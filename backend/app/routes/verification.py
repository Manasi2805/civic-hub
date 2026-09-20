from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import VerificationResponse
from app.services.verification_engine import verify_complaint

router = APIRouter(prefix="/api/verification", tags=["verification"])

@router.post("/analyze", response_model=VerificationResponse)
def analyze(lat: float, lng: float, issue_type: str, has_photo: bool = False, db: Session = Depends(get_db)):
    return verify_complaint(db, lat, lng, issue_type, has_photo)

@router.post("/duplicate-check")
def duplicate_check(lat: float, lng: float, issue_type: str, db: Session = Depends(get_db)):
    res = verify_complaint(db, lat, lng, issue_type, False)
    return {"duplicate_score": res["signals"]["duplicate_score"]}
