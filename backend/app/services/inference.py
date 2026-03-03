import torch
from typing import Dict, Tuple
import time
import os
import io
from PIL import Image
from ultralytics import YOLO

from app.config import settings

class InferenceService:
    def __init__(self):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.models = {
            "nano": None,
            "medium": None
        }
        self.model_loaded = {
            "nano": False,
            "medium": False
        }
        print(f"Using device: {self.device}")
    
    def load_model(self):
        """Load both YOLOv8 models from configured paths"""
        
        backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        
        # Load Nano Model
        nano_path = settings.NANO_MODEL_PATH if os.path.isabs(settings.NANO_MODEL_PATH) else os.path.join(backend_dir, settings.NANO_MODEL_PATH)
        try:
            if os.path.exists(nano_path):
                self.models["nano"] = YOLO(nano_path)
                # Move to device if needed, ultralytics handles this mostly automatically, but we can force it
                self.models["nano"].to(self.device)
                self.model_loaded["nano"] = True
                print(f"✓ Nano model loaded successfully from {nano_path}")
            else:
                print(f"❌ Nano model not found at {nano_path}")
        except Exception as e:
            print(f"❌ Error loading Nano model: {e}")
            
        # Load Medium Model
        medium_path = settings.MEDIUM_MODEL_PATH if os.path.isabs(settings.MEDIUM_MODEL_PATH) else os.path.join(backend_dir, settings.MEDIUM_MODEL_PATH)
        try:
            if os.path.exists(medium_path):
                self.models["medium"] = YOLO(medium_path)
                self.models["medium"].to(self.device)
                self.model_loaded["medium"] = True
                print(f"✓ Medium model loaded successfully from {medium_path}")
            else:
                print(f"❌ Medium model not found at {medium_path}")
        except Exception as e:
            print(f"❌ Error loading Medium model: {e}")
            
    def predict(self, image_bytes: bytes, model_version: str = "medium") -> Dict:
        if model_version not in ["nano", "medium"]:
            model_version = "medium"
            
        if not self.model_loaded[model_version]:
            return {
                'success': False,
                'error': f'Model {model_version} not loaded. Please ensure the {model_version} model file exists and restart the server.',
                'tumor_type': None,
                'confidence': 0.0,
                'boxes': [],
                'note': 'Put your trained models in the weights directory'
            }
        
        print(f"🔬 Running inference with {model_version} model!")
        
        try:
            start_time = time.time()
            
            # Load image from bytes using PIL
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            
            # Run inference using Ultralytics YOLO
            model = self.models[model_version]
            results = model.predict(
                source=image,
                conf=settings.CONFIDENCE_THRESHOLD,
                iou=settings.IOU_THRESHOLD,
                imgsz=settings.IMAGE_SIZE,
                verbose=False
            )
            
            result = results[0]  # Get the first result
            
            # Format detections
            boxes = []
            max_conf = 0.0
            primary_tumor_type = "No Tumor"
            
            if len(result.boxes) > 0:
                for box in result.boxes:
                    # class_id = int(box.cls[0].item())
                    # YOLOv8 custom trained models will have class name "Tumor" or similar usually at index 0
                    # If multiple classes, we can get the name from the result.names dict.
                    class_name = result.names[int(box.cls[0].item())]
                    confidence = float(box.conf[0].item())
                    
                    # Extract bounding box coordinates [x1, y1, x2, y2]
                    x1, y1, x2, y2 = box.xyxy[0].tolist()
                    
                    boxes.append({
                        "x1": round(x1, 2),
                        "y1": round(y1, 2),
                        "x2": round(x2, 2),
                        "y2": round(y2, 2),
                        "label": class_name,
                        "score": round(confidence, 4)
                    })
                    
                    if confidence > max_conf:
                        max_conf = confidence
                        primary_tumor_type = class_name
            
            inference_time = time.time() - start_time
            
            return {
                'success': True,
                'tumor_type': primary_tumor_type,
                'confidence': float(max_conf),
                'boxes': boxes,
                'inference_time': round(inference_time, 3),
                'image_shape': [image.height, image.width]
            }
        
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'tumor_type': None,
                'confidence': 0.0,
                'boxes': []
            }
    
    def get_model_info(self) -> Dict:
        is_nano_loaded = self.model_loaded["nano"]
        is_medium_loaded = self.model_loaded["medium"]
        
        info = {
            'loaded': is_nano_loaded or is_medium_loaded,
            'nano_loaded': is_nano_loaded,
            'medium_loaded': is_medium_loaded,
            'device': str(self.device),
        }
        
        if is_medium_loaded:
            model = self.models["medium"]
            # To get total parameters in standard PyTorch format
            info['total_parameters'] = sum(p.numel() for p in model.model.parameters())
            info['classes'] = model.names
            
        return info


inference_service = InferenceService()
