from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Dict, Optional
import logging

from app.config import settings
from app.services import inference_service

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Brain Tumor Detection API",
    description="YOLOv7-based Brain Tumor Detection System with Enhanced Architecture",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class BoundingBox(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float
    label: str
    score: float


class PredictionResponse(BaseModel):
    success: bool
    tumor_type: Optional[str] = None
    confidence: float
    boxes: List[BoundingBox]
    inference_time: Optional[float] = None
    image_shape: Optional[List[int]] = None
    error: Optional[str] = None


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    device: str


class ModelInfoResponse(BaseModel):
    loaded: bool
    device: Optional[str] = None
    total_parameters: Optional[int] = None
    trainable_parameters: Optional[int] = None
    model_path: Optional[str] = None
    classes: Optional[Dict[int, str]] = None


@app.on_event("startup")
async def startup_event():
    logger.info("Starting Brain Tumor Detection API...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"CORS Origins: {settings.CORS_ORIGINS}")
    
    try:
        inference_service.load_model()
        if inference_service.model_loaded:
            logger.info("Model loaded successfully!")
        else:
            logger.warning("Model loading failed (check logs for details)")
    except Exception as e:
        logger.error(f"Failed to load model: {e}")


@app.get("/")
async def root():
    return {
        "message": "Brain Tumor Detection API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    model_info = inference_service.get_model_info()
    
    return {
        "status": "healthy",
        "model_loaded": model_info.get('loaded', False),
        "device": model_info.get('device', 'unknown')
    }


@app.get("/model-info", response_model=ModelInfoResponse)
async def get_model_info():
    return inference_service.get_model_info()


@app.post("/predict", response_model=PredictionResponse)
async def predict_tumor(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload an image file."
        )
    
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File too large. Maximum size is 10MB."
        )
    
    if len(contents) == 0:
        raise HTTPException(
            status_code=400,
            detail="Empty file uploaded."
        )
    
    logger.info(f"Processing image: {file.filename} ({len(contents)} bytes)")
    
    try:
        result = inference_service.predict(contents)
        
        if not result['success']:
            raise HTTPException(
                status_code=500,
                detail=f"Prediction failed: {result.get('error', 'Unknown error')}"
            )
        
        logger.info(
            f"Prediction successful: {result['tumor_type']} "
            f"(confidence: {result['confidence']:.2f}, "
            f"time: {result.get('inference_time', 0):.3f}s)"
        )
        
        return result
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during prediction: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail,
            "tumor_type": None,
            "confidence": 0.0,
            "boxes": []
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "tumor_type": None,
            "confidence": 0.0,
            "boxes": []
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.ENVIRONMENT == "development"
    )
