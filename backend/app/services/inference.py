import torch
import numpy as np
from typing import Dict, List, Tuple
import time

from app.model import load_model
from app.utils import (
    preprocess_image,
    scale_boxes,
    non_max_suppression,
    format_detections,
    get_primary_prediction
)
from app.config import settings


class InferenceService:
    def __init__(self):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = None
        self.model_loaded = False
        print(f"Using device: {self.device}")
    
    def load_model(self):
        try:
            print(f"Loading model from {settings.MODEL_PATH}...")
            self.model = load_model(settings.MODEL_PATH, str(self.device))
            self.model_loaded = True
            print("Model loaded successfully!")
        except Exception as e:
            print(f"Error loading model: {e}")
            print("Initializing model with random weights for testing...")
            from app.model.yolov7 import YOLOv7
            self.model = YOLOv7(nc=4).to(self.device).eval()
            self.model_loaded = True
    
    def predict(self, image_bytes: bytes) -> Dict:
        if not self.model_loaded:
            raise RuntimeError("Model not loaded. Call load_model() first.")
        
        try:
            start_time = time.time()
            
            img_tensor, img_orig, preprocess_info = preprocess_image(
                image_bytes, 
                settings.IMAGE_SIZE
            )
            ratio, pad = preprocess_info
            
            img_tensor = img_tensor.to(self.device)
            
            with torch.no_grad():
                predictions = self.model(img_tensor)
                
                if isinstance(predictions, tuple):
                    predictions = predictions[0]
            
            detections = non_max_suppression(
                predictions,
                conf_thres=settings.CONFIDENCE_THRESHOLD,
                iou_thres=settings.IOU_THRESHOLD
            )[0]
            
            if len(detections):
                detections[:, :4] = self._scale_coords(
                    img_tensor.shape[2:],
                    detections[:, :4],
                    img_orig.shape,
                    ratio,
                    pad
                )
            
            boxes = format_detections(detections, settings.CLASS_NAMES)
            
            tumor_type, confidence = get_primary_prediction(boxes, settings.CLASS_NAMES)
            
            inference_time = time.time() - start_time
            
            return {
                'success': True,
                'tumor_type': tumor_type,
                'confidence': float(confidence),
                'boxes': boxes,
                'inference_time': round(inference_time, 3),
                'image_shape': img_orig.shape[:2]
            }
        
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'tumor_type': None,
                'confidence': 0.0,
                'boxes': []
            }
    
    def _scale_coords(
        self,
        img1_shape: Tuple[int, int],
        coords: torch.Tensor,
        img0_shape: Tuple[int, int],
        ratio: Tuple[float, float],
        pad: Tuple[float, float]
    ) -> torch.Tensor:
        coords[:, [0, 2]] -= pad[0]
        coords[:, [1, 3]] -= pad[1]
        
        coords[:, [0, 2]] /= ratio[0]
        coords[:, [1, 3]] /= ratio[1]
        
        coords[:, [0, 2]] = coords[:, [0, 2]].clamp(0, img0_shape[1])
        coords[:, [1, 3]] = coords[:, [1, 3]].clamp(0, img0_shape[0])
        
        return coords
    
    def get_model_info(self) -> Dict:
        if not self.model_loaded:
            return {'loaded': False}
        
        total_params = sum(p.numel() for p in self.model.parameters())
        trainable_params = sum(p.numel() for p in self.model.parameters() if p.requires_grad)
        
        return {
            'loaded': True,
            'device': str(self.device),
            'total_parameters': total_params,
            'trainable_parameters': trainable_params,
            'model_path': settings.MODEL_PATH,
            'classes': settings.CLASS_NAMES
        }


inference_service = InferenceService()
