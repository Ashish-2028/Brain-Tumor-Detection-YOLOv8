#!/usr/bin/env python3
"""
Model Initialization and Verification Script
Tests that the YOLOv7 model can be loaded successfully
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.model.yolov7 import load_model, get_model_info
from app.config import settings
import torch


def main():
    print("=" * 60)
    print("Brain Tumor Detection - Model Initialization")
    print("=" * 60)
    print()
    
    # Check device
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"Device: {device}")
    if device == 'cuda':
        print(f"GPU: {torch.cuda.get_device_name(0)}")
    print()
    
    # Check model path
    print(f"Model path: {settings.MODEL_PATH}")
    full_path = os.path.join(os.path.dirname(__file__), settings.MODEL_PATH)
    print(f"Full path: {full_path}")
    
    if not os.path.exists(full_path):
        print(f"\n❌ ERROR: Model file not found!")
        print(f"   Expected location: {full_path}")
        print(f"\n   Available weight files:")
        weights_dir = os.path.join(os.path.dirname(__file__), "weights")
        if os.path.exists(weights_dir):
            for f in os.listdir(weights_dir):
                if f.endswith('.pt'):
                    print(f"   - {f}")
        else:
            print(f"   Weights directory not found: {weights_dir}")
        return False
    
    print(f"✓ Model file exists ({os.path.getsize(full_path) / 1024 / 1024:.1f} MB)")
    print()
    
    # Load model
    print("Loading model...")
    try:
        model = load_model(full_path, device)
        print()
        
        # Get model info
        info = get_model_info(model)
        print("Model Information:")
        for key, value in info.items():
            print(f"  {key}: {value}")
        print()
        
        # Test inference with dummy input
        print("Testing inference with dummy input...")
        dummy_input = torch.randn(1, 3, 640, 640).to(device)
        
        with torch.no_grad():
            output = model(dummy_input)
        
        if isinstance(output, tuple):
            print(f"✓ Model output: {len(output)} tensors")
            print(f"  Primary output shape: {output[0].shape}")
        else:
            print(f"✓ Model output shape: {output.shape}")
        
        print()
        print("=" * 60)
        print("✓ Model initialization successful!")
        print("=" * 60)
        print()
        print("Configuration:")
        print(f"  Confidence threshold: {settings.CONFIDENCE_THRESHOLD}")
        print(f"  IOU threshold: {settings.IOU_THRESHOLD}")
        print(f"  Image size: {settings.IMAGE_SIZE}")
        print(f"  Classes: {settings.CLASS_NAMES}")
        print()
        print("Next steps:")
        print("  1. Start the backend: uvicorn app.main:app --reload")
        print("  2. Test the API: curl http://localhost:8000/health")
        print("  3. Start the frontend: npm run dev")
        print()
        
        return True
        
    except Exception as e:
        print()
        print("=" * 60)
        print("✗ Model initialization failed!")
        print("=" * 60)
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
