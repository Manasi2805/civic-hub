import math
from typing import List
from sqlalchemy.orm import Session
from app.models import Complaint

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371000 # Earth radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    
    a = math.sin(delta_phi / 2.0)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def verify_complaint(db: Session, lat: float, lng: float, issue_type: str, has_photo: bool, user_report_count: int = 1):
    metadata_check = has_photo
    location_match = True # Simplified for MVP
    
    # Check duplicate score (complaints of same type within 200m)
    existing_complaints = db.query(Complaint).filter(Complaint.issue_type == issue_type, Complaint.status != 'resolved').all()
    duplicate_score = 0.0
    spatial_score = 0.0
    
    nearby_same_type = 0
    nearby_any = 0
    
    for c in existing_complaints:
        dist = haversine_distance(lat, lng, c.latitude, c.longitude)
        if dist <= 200:
            nearby_same_type += 1
        if dist <= 1000:
            nearby_any += 1
            
    if nearby_same_type > 0:
        duplicate_score = min(1.0, nearby_same_type * 0.5)
        
    if nearby_any > 0:
        spatial_score = 1.0
        
    history_score = min(1.0, user_report_count * 0.2)
    
    final_score = (0.2 * float(metadata_check)) + (0.25 * float(location_match)) + (0.25 * (1.0 - duplicate_score)) + (0.15 * history_score) + (0.15 * spatial_score)
    
    if final_score >= 0.7:
        decision = "likely_genuine"
    elif final_score >= 0.4:
        decision = "needs_review"
    else:
        decision = "likely_fraudulent"
        
    signals = {
        "metadata_check": metadata_check,
        "location_match": location_match,
        "duplicate_score": duplicate_score,
        "history_score": history_score,
        "spatial_score": spatial_score
    }
    
    explanation = f"Confidence score is {final_score:.2f}. "
    if metadata_check:
        explanation += "Photo evidence provided. "
    if duplicate_score > 0:
        explanation += f"Possible duplicates found nearby. "
    if spatial_score > 0:
        explanation += "Other complaints exist in the same area."
        
    return {
        "confidence": final_score,
        "decision": decision,
        "signals": signals,
        "explanation": explanation
    }
