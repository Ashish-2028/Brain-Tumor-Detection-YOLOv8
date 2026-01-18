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
        """Load the YOLOv7 model from configured path"""
        try:
            print(f"Loading model from {settings.MODEL_PATH}...")
            
            # Resolve model path (handle relative paths)
            import os
            if not os.path.isabs(settings.MODEL_PATH):
                # Relative path - resolve from backend directory
                backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
                model_path = os.path.join(backend_dir, settings.MODEL_PATH)
            else:
                model_path = settings.MODEL_PATH
            
            # Check if model file exists
            if not os.path.exists(model_path):
                print(f"❌ Model file not found at {model_path}")
                print(f"   Configured path: {settings.MODEL_PATH}")
                
                # List available weights
                weights_dir = os.path.join(os.path.dirname(model_path), '')
                if os.path.exists(os.path.dirname(model_path)):
                    print(f"   Available files in {os.path.dirname(model_path)}:")
                    for f in os.listdir(os.path.dirname(model_path)):
                        if f.endswith('.pt'):
                            print(f"     - {f}")
                
                self.model_loaded = False
                return
            
            print(f"✓ Found model file: {model_path} ({os.path.getsize(model_path) / 1024 / 1024:.1f} MB)")
            
            # Load the model
            self.model = load_model(model_path, str(self.device))
            self.model_loaded = True
            
            print("✓ Model loaded successfully!")
            print(f"✓ Device: {self.device}")
            
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            import traceback
            traceback.print_exc()
            
            # Log to file for debugging
            try:
                with open("model_error.log", "w") as f:
                    f.write(f"Error loading model: {str(e)}\n")
                    traceback.print_exc(file=f)
            except:
                pass
                
            self.model_loaded = False
    
    def predict(self, image_bytes: bytes) -> Dict:
        if not self.model_loaded:
            # Return informative error with instructions
            return {
                'success': False,
                'error': 'Model not loaded. Please ensure the model file exists and restart the server.',
                'tumor_type': None,
                'confidence': 0.0,
                'boxes': [],
                'note': 'Run: cd backend && python3 create_demo_model.py OR train your model with ./run_pipeline.sh'
            }
        
        # Use the trained model for real inference
        print(f"🔬 Running inference with trained model: {settings.MODEL_PATH}")
        
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
