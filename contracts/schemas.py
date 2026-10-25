# -*- coding: utf-8 -*-
"""
RoadSight Data Contracts & Pydantic Schemas
-------------------------------------------
Defines request and response shapes for all FastAPI endpoints:
1. POST /api/analyze-image
2. POST /api/compare-progress
3. GET  /api/projects
4. GET  /api/health
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


# -------------------------------------------------------------
# 1. Geolocation & Spatial Metadata
# -------------------------------------------------------------
class GPSCoordinates(BaseModel):
    lat: float = Field(..., description="Latitude in decimal degrees")
    lng: float = Field(..., description="Longitude in decimal degrees")
    accuracy: Optional[float] = Field(None, description="Accuracy in meters (e.g. 4.2m RTK)")
    source: Optional[str] = Field("browser_gps", description="Source: 'exif_gps', 'browser_gps', or 'manual'")


# -------------------------------------------------------------
# 2. Analyze Image Contract (POST /api/analyze-image)
# -------------------------------------------------------------
class AnalyzeImageRequest(BaseModel):
    image_base64: Optional[str] = Field(None, description="Base64 encoded data URI (image/jpeg or image/png)")
    image_url: Optional[str] = Field(None, description="Direct URL to site image")
    activity_type: str = Field("road_surface", description="road_surface, utility_ducts, or pedestrian")
    project_id: str = Field("p1", description="Project ID (e.g. p1, p2, p3, p4)")
    chainage: Optional[str] = Field("12+200 to 15+700", description="Road chainage marker interval")
    gps: Optional[GPSCoordinates] = None
    previous_phash: Optional[str] = Field(None, description="Previous image pHash for fraud duplication check")
    use_stub: bool = Field(False, description="Force stub response for safe demo/offline mode")


class ErrorDetail(BaseModel):
    type: str = Field(..., description="IMAGE_BLURRY, IMAGE_DARK, GPS_OUT_OF_BOUNDS, DUPLICATE_FRAUD_ALERT")
    title: str
    message: str
    correction_prompt: str


class AnalyzeImageResponse(BaseModel):
    success: bool
    status: str = Field(..., description="VERIFIED or REJECTED")
    activity_assessed: str
    predicted_stage: str
    stage_code: str
    stage_ladder_order: str
    description: str
    confidence_percent: float
    total_stretch_km: float
    completed_stretch_km: float
    remaining_stretch_km: float
    completion_percentage: float
    stage_wise: Dict[str, float]
    phash_signature: Optional[str] = None
    blur_score: Optional[float] = None
    avg_luminance: Optional[float] = None
    inference_source: str = Field("stub_fallback", description="'ml_model' (EfficientNet) or 'stub_fallback'")
    audit_timestamp: str
    badge_text: str
    error: Optional[ErrorDetail] = None
    recommendation: Optional[str] = None


# -------------------------------------------------------------
# 3. Compare Progress Contract (POST /api/compare-progress)
# -------------------------------------------------------------
class CompareProgressRequest(BaseModel):
    before_image: Optional[str] = Field(None, description="Data URI or URL of prior capture")
    after_image: Optional[str] = Field(None, description="Data URI or URL of current capture")
    project_id: str = Field("p1", description="Project ID")
    chainage: Optional[str] = Field(None, description="Specific chainage stretch")
    use_stub: bool = Field(False, description="Force stub comparison")


class CompareProgressResponse(BaseModel):
    success: bool
    project_id: str
    delta_progress_percent: float
    delta_length_km: float
    before_stage: str
    after_stage: str
    similarity_score: float
    inspection_notes: str
    verdict: str
    days_between_captures: int = 7
    audit_timestamp: str


# -------------------------------------------------------------
# 4. Projects Contract (GET /api/projects)
# -------------------------------------------------------------
class PreviousCapture(BaseModel):
    date: str
    stage: str
    imageUrl: str


class ProjectSchema(BaseModel):
    id: str
    name: str
    location: str
    code: str
    status: str
    currentStage: str
    stageCode: str
    progressPercent: int
    totalLengthKm: float
    completedLengthKm: float
    contractor: str
    contractDeadline: str
    chainage: str
    coordinates: Dict[str, float]
    waypoints: Optional[List[List[float]]] = None
    previousCapture: Optional[PreviousCapture] = None
    recentInspections: Optional[List[Dict[str, Any]]] = None


class ProjectsListResponse(BaseModel):
    success: bool
    total_count: int
    projects: List[ProjectSchema]


# -------------------------------------------------------------
# 5. Health Check
# -------------------------------------------------------------
class HealthCheckResponse(BaseModel):
    status: str
    version: str
    model_loaded: bool
    model_path: Optional[str]
    device: str
    timestamp: str
