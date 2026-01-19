#!/usr/bin/env python3
"""
Model Integration Script
Integrates the trained model with the backend API
"""

import os
import shutil
from pathlib import Path
import json


def integrate_model(
    model_path='weights/training_output/yolov7_brain_tumor_best.pt',
    target_path='weights/yolov7_brain_tumor.pt',
    backup=True
):
    """
    Integrate trained model with the backend API
    """
    print("=" * 70)
    print("Model Integration")
    print("=" * 70)
    
    model_path = Path(model_path)
    target_path = Path(target_path)
    
    # Check if trained model exists
    if not model_path.exists():
        print(f"\n❌ Error: Trained model not found at {model_path}")
        print("\nAvailable models:")
        
        training_dir = Path('weights/training_output')
        if training_dir.exists():
            for f in training_dir.glob('*.pt'):
                print(f"   - {f}")
        else:
            print("   No training output found. Run training first:")
            print("   python train_enhanced.py --data weights/dataset_processed")
        
        return False
    
    print(f"✓ Found trained model: {model_path}")
    print(f"  Size: {model_path.stat().st_size / 1024 / 1024:.1f} MB")
    
    # Backup existing model
    if target_path.exists() and backup:
        backup_path = target_path.with_suffix('.pt.backup')
        shutil.copy(target_path, backup_path)
        print(f"✓ Backed up existing model to: {backup_path}")
    
    # Create target directory if needed
    target_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Copy model
    shutil.copy(model_path, target_path)
    print(f"✓ Copied model to: {target_path}")
    
    # Update config if needed
    config_path = Path('app/config.py')
    if config_path.exists():
        with open(config_path, 'r') as f:
            config_content = f.read()
        
        if 'yolov7_brain_tumor.pt' in config_content:
            print(f"✓ Config already points to: yolov7_brain_tumor.pt")
        else:
            print(f"⚠️  Update app/config.py MODEL_PATH to: weights/yolov7_brain_tumor.pt")
    
    print("\n" + "=" * 70)
    print("✓ Model Integration Complete!")
    print("=" * 70)
    print("\n📋 Next Steps:")
    print("   1. Restart the backend server:")
    print("      uvicorn app.main:app --reload")
    print("\n   2. Test the API:")
    print("      curl -X POST http://localhost:8000/predict \\")
    print("           -F 'file=@path/to/brain_mri.jpg'")
    print("\n   3. View model info:")
    print("      curl http://localhost:8000/model-info")
    
    return True


def verify_integration():
    """Verify the model integration"""
    print("\n" + "=" * 70)
    print("Verifying Model Integration")
    print("=" * 70)
    
    model_path = Path('weights/yolov7_brain_tumor.pt')
    
    if not model_path.exists():
        print(f"❌ Model not found at: {model_path}")
        return False
    
    print(f"✓ Model file exists: {model_path}")
    print(f"  Size: {model_path.stat().st_size / 1024 / 1024:.1f} MB")
    
    # Try to load the model
    try:
        import torch
        from app.model.yolov7 import YOLOv7
        
        print("\n🔧 Loading model...")
        
        device = 'cuda' if torch.cuda.is_available() else 'cpu'
        print(f"   Device: {device}")
        
        # Load checkpoint
        checkpoint = torch.load(model_path, map_location=device)
        
        # Initialize model
        model = YOLOv7(nc=1)
        model.load_state_dict(checkpoint['model'])
        model.to(device)
        model.eval()
        
        print("✓ Model loaded successfully!")
        
        # Test with dummy input
        print("\n🧪 Testing inference...")
        dummy_input = torch.randn(1, 3, 640, 640).to(device)
        
        with torch.no_grad():
            output = model(dummy_input)
        
        print("✓ Inference test passed!")
        
        # Count parameters
        total_params = sum(p.numel() for p in model.parameters())
        print(f"\n📊 Model Info:")
        print(f"   Total parameters: {total_params:,}")
        print(f"   Classes: 1 (Tumor)")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error loading model: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Integrate trained model with backend')
    parser.add_argument('--model', type=str, 
                        default='weights/training_output/yolov7_brain_tumor_best.pt',
                        help='Path to trained model')
    parser.add_argument('--target', type=str,
                        default='weights/yolov7_brain_tumor.pt',
                        help='Target path for integrated model')
    parser.add_argument('--no-backup', action='store_true',
                        help='Do not backup existing model')
    parser.add_argument('--verify', action='store_true',
                        help='Verify integration after copying')
    
    args = parser.parse_args()
    
    success = integrate_model(
        model_path=args.model,
        target_path=args.target,
        backup=not args.no_backup
    )
    
    if success and args.verify:
        verify_integration()
    
    exit(0 if success else 1)
