#!/usr/bin/env python3
"""
Create a temporary demo model for immediate testing
This allows the system to work before training completes
"""

import torch
import torch.nn as nn
from pathlib import Path
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.model.yolov7 import YOLOv7


def create_demo_model(output_path='weights/yolov7_brain_tumor.pt'):
    """
    Create a demo YOLOv7 model for testing
    This is a placeholder until the real model is trained
    """
    print("=" * 70)
    print("Creating Demo Model for Testing")
    print("=" * 70)
    print()
    
    # Create weights directory
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    
    print("🔧 Initializing YOLOv7 model...")
    
    # Initialize model with 1 class (tumor)
    model = YOLOv7(nc=1)
    
    # Set to eval mode
    model.eval()
    
    # Count parameters
    total_params = sum(p.numel() for p in model.parameters())
    print(f"   Total parameters: {total_params:,}")
    
    # Save model
    print(f"\n💾 Saving demo model to: {output_path}")
    
    checkpoint = {
        'model': model.state_dict(),
        'epoch': 0,
        'nc': 1,
        'names': ['Tumor'],
        'note': 'Demo model - train with real data for production use'
    }
    
    torch.save(checkpoint, output_path)
    
    file_size = Path(output_path).stat().st_size / 1024 / 1024
    print(f"✓ Model saved ({file_size:.1f} MB)")
    
    print()
    print("=" * 70)
    print("✓ Demo Model Created!")
    print("=" * 70)
    print()
    print("⚠️  IMPORTANT: This is a demo model for testing only!")
    print()
    print("   The model has random weights and will NOT produce")
    print("   accurate predictions. To get a working model:")
    print()
    print("   1. Run the training pipeline:")
    print("      cd backend && ./run_pipeline.sh")
    print()
    print("   2. Or download a pretrained model")
    print()
    print("   For now, you can test the system with this demo model.")
    print()
    
    return True


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Create demo model for testing')
    parser.add_argument('--output', type=str, default='weights/yolov7_brain_tumor.pt',
                        help='Output path for demo model')
    
    args = parser.parse_args()
    
    try:
        success = create_demo_model(args.output)
        exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        exit(1)
