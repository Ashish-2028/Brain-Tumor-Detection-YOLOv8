import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    MODEL_PATH: str = os.getenv("MODEL_PATH", "weights/yolov7.pt")
    CONFIDENCE_THRESHOLD: float = float(os.getenv("CONFIDENCE_THRESHOLD", 0.25))
    IOU_THRESHOLD: float = float(os.getenv("IOU_THRESHOLD", 0.45))
    IMAGE_SIZE: int = int(os.getenv("IMAGE_SIZE", 640))
    
    # CORS Configuration
    CORS_ORIGINS: list = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    
    # Class Names (0: Glioma, 1: Pituitary, 2: Meningioma, 3: No Tumor)
    CLASS_NAMES: dict = {
        0: "Glioma",
        1: "Pituitary",
        2: "Meningioma",
        3: "No Tumor"
    }

settings = Settings()
