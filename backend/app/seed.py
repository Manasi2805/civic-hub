import random
from datetime import datetime, timedelta
import uuid
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models import Complaint, Jurisdiction, ComplaintHistory, VerificationResult, User

Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    
    # Delete existing
    db.query(ComplaintHistory).delete()
    db.query(VerificationResult).delete()
    db.query(Complaint).delete()
    db.query(Jurisdiction).delete()
    db.query(User).delete()
    
    # Users
    for _ in range(5):
        db.add(User(id=str(uuid.uuid4()), anonymous_token=str(uuid.uuid4()), report_count=random.randint(1, 5)))
        
    issue_types = ["garbage", "pothole", "streetlight", "construction_waste", "overflowing_bin", "other"]
    statuses = ["submitted", "verified", "routed", "acknowledged", "in_progress", "resolved"]
    authorities = ["Krishnaraja", "Chamaraja", "Narasimharaja", "Jayalakshmipuram", "Kuvempunagar", 
                  "Vijayanagar", "Hebbal", "Saraswathipuram", "Lakshmipuram", "Devaraja"]
    
    # Complaints
    for i in range(1, 51):
        c_id = f"MYS-2026-{i:05d}"
        lat = 12.29 + random.random() * 0.06
        lng = 76.62 + random.random() * 0.07
        status = random.choice(statuses)
        authority = random.choice(authorities)
        created = datetime.utcnow() - timedelta(days=random.randint(0, 7))
        updated = created + timedelta(days=random.randint(0, 3)) if status != "submitted" else created
        
        comp = Complaint(
            id=c_id,
            issue_type=random.choice(issue_types),
            description=f"Issue report {i}",
            latitude=lat,
            longitude=lng,
            status=status,
            priority_score=random.random(),
            verification_score=0.4 + random.random() * 0.6,
            verification_decision="likely_genuine",
            authority_name=authority,
            created_at=created,
            updated_at=updated
        )
        db.add(comp)
        
        db.add(ComplaintHistory(
            complaint_id=c_id,
            status="submitted",
            message="Submitted.",
            changed_by="system",
            created_at=created
        ))
        
        if status != "submitted":
            db.add(ComplaintHistory(
                complaint_id=c_id,
                status=status,
                message=f"Updated to {status}",
                changed_by="authority",
                created_at=updated
            ))
            
    db.commit()
    db.close()
    print("Seeding complete.")

if __name__ == "__main__":
    seed_data()
