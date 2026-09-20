from fastapi import APIRouter
from app.schemas import RoutingRequest, RoutingResponse
from app.services.routing_engine import resolve_jurisdiction

router = APIRouter(prefix="/api/routing", tags=["routing"])

@router.post("/resolve", response_model=RoutingResponse)
def resolve_route(req: RoutingRequest):
    return resolve_jurisdiction(req.latitude, req.longitude, req.issue_type, req.reported_at)
