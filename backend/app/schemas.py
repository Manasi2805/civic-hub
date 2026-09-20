from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Union
from datetime import datetime

class ComplaintCreate(BaseModel):
    issue_type: str
    description: Optional[str] = None
    latitude: float
    longitude: float

class HistoryEntry(BaseModel):
    status: str
    message: str
    changed_by: str
    created_at: datetime

    class Config:
        from_attributes = True

class ComplaintResponse(BaseModel):
    id: str
    issue_type: str
    description: Optional[str] = None
    reporter_name: Optional[str] = None
    reporter_phone: Optional[str] = None
    reporter_email: Optional[str] = None
    latitude: float
    longitude: float
    photo_url: Optional[str] = None
    video_url: Optional[str] = None
    status: str
    priority_score: Optional[Union[float, str]] = 0.0
    verification_score: float
    verification_decision: Optional[str] = None
    jurisdiction_id: Optional[str] = None
    authority_name: Optional[str] = None
    routing_explanation: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    history: List[HistoryEntry] = []

    class Config:
        from_attributes = True

class ComplaintUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[Union[str, float]] = None
    message: Optional[str] = None

class RoutingRequest(BaseModel):
    latitude: float
    longitude: float
    issue_type: str
    reported_at: datetime

class RoutingResponse(BaseModel):
    authority: Optional[str] = None
    authority_type: Optional[str] = None
    boundary_version: Optional[str] = None
    matched: bool
    explanation: str

class VerificationResponse(BaseModel):
    confidence: float
    decision: str
    signals: Dict[str, Any]
    explanation: str

class DashboardSummary(BaseModel):
    open: int = 0
    open_issues: int = 0
    under_review: int = 0
    under_verification: int = 0
    pending_assignment: int = 0
    in_progress: int = 0
    resolved_today: int = 0
    total_resolved: int = 0
    high_priority: int = 0
    overdue_slas: int = 0

class AreaInsight(BaseModel):
    area: str
    open: int
    resolved: int
    under_review: int
    top_issue: str
    avg_resolution_days: float
    repeat_incidents: int
    insight: str

class ComplaintListItem(BaseModel):
    id: str
    issue_type: str
    area: Optional[str] = None
    verification_score: float
    priority: Optional[Union[float, str]] = 0.0
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
class CitizenLoginRequest(BaseModel):
    phone_or_email: str
    full_name: Optional[str] = None

class CitizenAuthResponse(BaseModel):
    token: str
    phone_or_email: str
    full_name: str