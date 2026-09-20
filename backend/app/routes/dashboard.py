from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import json
import os
from collections import defaultdict

from app.database import get_db
from app.models import Complaint
from app.schemas import DashboardSummary, AreaInsight, ComplaintListItem
from app.services.insight_engine import generate_area_insight
from app.services.routing_engine import BOUNDARIES_FILE

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/summary", response_model=DashboardSummary)
def get_summary(db: Session = Depends(get_db)):
    complaints = db.query(Complaint).all()
    open_count = sum(1 for c in complaints if c.status in ["submitted", "routed"])
    review_count = sum(1 for c in complaints if c.status == "verified")
    prog_count = sum(1 for c in complaints if c.status == "in_progress")
    resolved_count = sum(1 for c in complaints if c.status == "resolved")
    
    return DashboardSummary(
        open=open_count,
        open_issues=open_count,
        under_review=review_count,
        under_verification=review_count,
        pending_assignment=open_count,
        in_progress=prog_count,
        resolved_today=resolved_count,
        total_resolved=resolved_count,
        high_priority=sum(1 for c in complaints if c.priority_score > 70),
        overdue_slas=0
    )

@router.get("/issues", response_model=List[ComplaintListItem])
def list_issues(db: Session = Depends(get_db)):
    complaints = db.query(Complaint).order_by(Complaint.created_at.desc()).all()
    return [
        ComplaintListItem(
            id=c.id,
            issue_type=c.issue_type,
            area=c.authority_name,
            verification_score=c.verification_score,
            priority=c.priority_score,
            status=c.status,
            created_at=c.created_at
        ) for c in complaints
    ]

@router.get("/areas", response_model=List[AreaInsight])
def get_areas(db: Session = Depends(get_db)):
    complaints = db.query(Complaint).all()
    areas_data = defaultdict(lambda: {"open": 0, "resolved": 0, "under_review": 0, "issues": defaultdict(int), "days": []})
    
    for c in complaints:
        area = c.authority_name or "Unknown"
        if c.status == "resolved":
            areas_data[area]["resolved"] += 1
            days = (c.updated_at - c.created_at).days
            areas_data[area]["days"].append(days)
        elif c.status in ["submitted", "routed", "in_progress"]:
            areas_data[area]["open"] += 1
        elif c.status == "verified":
            areas_data[area]["under_review"] += 1
            
        areas_data[area]["issues"][c.issue_type] += 1
        
    results = []
    for area, data in areas_data.items():
        top_issue = max(data["issues"].items(), key=lambda x: x[1])[0] if data["issues"] else "none"
        avg_days = sum(data["days"]) / len(data["days"]) if data["days"] else 0.0
        
        stats = {
            "top_issue": top_issue,
            "open": data["open"],
            "resolved": data["resolved"],
            "avg_resolution_days": avg_days,
            "repeat_incidents": 0 # Simplified
        }
        insight = generate_area_insight(stats)
        
        results.append(AreaInsight(
            area=area,
            open=data["open"],
            resolved=data["resolved"],
            under_review=data["under_review"],
            top_issue=top_issue,
            avg_resolution_days=avg_days,
            repeat_incidents=0,
            insight=insight
        ))
    return results

@router.get("/boundaries")
def get_boundaries():
    if os.path.exists(BOUNDARIES_FILE):
        with open(BOUNDARIES_FILE, 'r') as f:
            return json.load(f)
    return {"type": "FeatureCollection", "features": []}
