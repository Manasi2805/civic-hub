import json
import os
from shapely.geometry import Point, shape
from datetime import datetime

BOUNDARIES_FILE = os.path.join(os.path.dirname(__file__), "..", "..", "data", "mysuru_boundaries.geojson")
_boundaries_cache = None

def load_boundaries():
    global _boundaries_cache
    if _boundaries_cache is None:
        if os.path.exists(BOUNDARIES_FILE):
            with open(BOUNDARIES_FILE, 'r') as f:
                _boundaries_cache = json.load(f)
        else:
            _boundaries_cache = {"type": "FeatureCollection", "features": []}
    return _boundaries_cache

def resolve_jurisdiction(lat: float, lng: float, issue_type: str, reported_at: datetime):
    boundaries = load_boundaries()
    point = Point(lng, lat)
    
    for feature in boundaries.get("features", []):
        polygon = shape(feature["geometry"])
        if polygon.contains(point):
            props = feature["properties"]
            valid_from = props.get("valid_from")
            valid_to = props.get("valid_to")
            
            # Simplified valid date checking
            if valid_from:
                valid_from_dt = datetime.strptime(valid_from, "%Y-%m-%d")
                if reported_at < valid_from_dt:
                    continue
            if valid_to:
                valid_to_dt = datetime.strptime(valid_to, "%Y-%m-%d")
                if reported_at > valid_to_dt:
                    continue
                    
            authority_name = props.get("authority_name", "Unknown Authority")
            return {
                "authority": authority_name,
                "authority_type": props.get("authority_type", "unknown"),
                "boundary_version": props.get("version", "unknown"),
                "matched": True,
                "explanation": f"The reported location falls inside the currently active boundary for {authority_name}."
            }
            
    return {
        "authority": None,
        "authority_type": None,
        "boundary_version": None,
        "matched": False,
        "explanation": "The reported location could not be mapped to any active boundary."
    }
