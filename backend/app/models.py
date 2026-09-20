from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Complaint(Base):
    __tablename__ = "complaints"
    
    id = Column(String, primary_key=True, index=True)
    reporter_name = Column(String, nullable=True)
    reporter_phone = Column(String, nullable=True)
    reporter_email = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    issue_type = Column(String, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    photo_url = Column(String, nullable=True)
    video_url = Column(String, nullable=True)
    status = Column(String, index=True, default="submitted")
    priority_score = Column(Float, default=0.0)
    verification_score = Column(Float, default=0.0)
    verification_decision = Column(String, nullable=True)
    jurisdiction_id = Column(String, ForeignKey("jurisdictions.id"), nullable=True)
    authority_name = Column(String, nullable=True)
    routing_explanation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    history = relationship("ComplaintHistory", back_populates="complaint")
    verification_results = relationship("VerificationResult", back_populates="complaint", uselist=False)

class Jurisdiction(Base):
    __tablename__ = "jurisdictions"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    authority_name = Column(String)
    authority_type = Column(String)
    geometry = Column(Text)
    valid_from = Column(Date)
    valid_to = Column(Date, nullable=True)
    version = Column(String)

class ComplaintHistory(Base):
    __tablename__ = "complaint_history"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    complaint_id = Column(String, ForeignKey("complaints.id"))
    status = Column(String)
    message = Column(Text)
    changed_by = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    complaint = relationship("Complaint", back_populates="history")

class VerificationResult(Base):
    __tablename__ = "verification_results"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    complaint_id = Column(String, ForeignKey("complaints.id"), unique=True)
    metadata_check = Column(Boolean)
    location_match = Column(Boolean)
    duplicate_score = Column(Float)
    history_score = Column(Float)
    spatial_score = Column(Float)
    final_score = Column(Float)
    decision = Column(String)
    explanation = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    complaint = relationship("Complaint", back_populates="verification_results")

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    anonymous_token = Column(String, unique=True, index=True)
    report_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
