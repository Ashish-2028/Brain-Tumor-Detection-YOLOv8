#!/usr/bin/env python3
"""
Brain Tumor MRI Dataset Preprocessing
Converts LGG-MRI segmentation data (TIF masks) to YOLO format
"""

import os
import cv2
import numpy as np
from pathlib import Path
import shutil
from tqdm import tqdm
import json


def find_contours_and_convert_to_yolo(mask_path, img_shape, class_id=0):
    """
    Convert segmentation mask to YOLO bounding box format
    Returns: list of [class_id, x_center, y_center, width, height] (normalized)
    """
    mask = cv2.imread(mask_path, cv2.IMREAD_GRAYSCALE)
    if mask is None:
        return []
    
    h, w = img_shape[:2]
    
    # Find contours in mask
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    boxes = []
    for contour in contours:
        # Get bounding rectangle
        x, y, w_box, h_box = cv2.boundingRect(contour)
        
        # Filter out very small detections (noise)
        if w_box < 10 or h_box < 10:
            continue
        
        # Convert to YOLO format (normalized center x, y, width, height)
        x_center = (x + w_box / 2) / w
        y_center = (y + h_box / 2) / h
        width = w_box / w
        height = h_box / h
        
        boxes.append([class_id, x_center, y_center, width, height])
    
    return boxes


def preprocess_lgg_dataset(
    input_dir='weights/dataset_raw',
    output_dir='weights/dataset_processed',
    train_split=0.8,
    img_size=640
):
    """
    Preprocess LGG-MRI segmentation dataset
    """
    print("=" * 70)
    print("Brain Tumor Dataset Preprocessing")
    print("=" * 70)
    
    # Find dataset folders
    dataset_paths = []
    input_path = Path(input_dir)
    
    # Check both possible locations
    if (input_path / 'lgg-mri-segmentation' / 'kaggle_3m').exists():
        dataset_root = input_path / 'lgg-mri-segmentation' / 'kaggle_3m'
        dataset_paths.append(dataset_root)
    
    if (input_path / 'kaggle_3m').exists():
        dataset_root = input_path / 'kaggle_3m'
        if dataset_root not in dataset_paths:
            dataset_paths.append(dataset_root)
    
    if not dataset_paths:
        print(f"❌ Error: No dataset found in {input_dir}")
        print(f"   Expected: kaggle_3m folder with patient subdirectories")
        return False
    
    print(f"✓ Found dataset at: {dataset_paths[0]}")
    
    # Get all patient folders
    patient_folders = []
    for dataset_root in dataset_paths:
        patient_folders.extend([d for d in dataset_root.iterdir() if d.is_dir()])
    
    patient_folders = list(set(patient_folders))  # Remove duplicates
    print(f"✓ Found {len(patient_folders)} patient folders")
    
    # Create output directories
    output_path = Path(output_dir)
    for split in ['train', 'val']:
        (output_path / split / 'images').mkdir(parents=True, exist_ok=True)
        (output_path / split / 'labels').mkdir(parents=True, exist_ok=True)
    
    # Process each patient folder
    stats = {
        'total_images': 0,
        'images_with_tumor': 0,
        'images_without_tumor': 0,
        'total_boxes': 0,
        'train_count': 0,
        'val_count': 0
    }
    
    # Shuffle patient folders for split
    np.random.seed(42)
    np.random.shuffle(patient_folders)
    
    split_idx = int(len(patient_folders) * train_split)
    train_patients = patient_folders[:split_idx]
    val_patients = patient_folders[split_idx:]
    
    print(f"\n📊 Dataset Split:")
    print(f"   Training: {len(train_patients)} patients")
    print(f"   Validation: {len(val_patients)} patients")
    print(f"\n🔄 Processing images...")
    
    # Process training set
    process_patient_set(
        train_patients, output_path / 'train', 'train', 
        stats, img_size
    )
    
    # Process validation set
    process_patient_set(
        val_patients, output_path / 'val', 'val', 
        stats, img_size
    )
    
    # Save dataset info
    dataset_info = {
        'classes': ['tumor'],
        'nc': 1,
        'train': str(output_path / 'train' / 'images'),
        'val': str(output_path / 'val' / 'images'),
        'stats': stats
    }
    
    with open(output_path / 'dataset.yaml', 'w') as f:
        json.dump(dataset_info, f, indent=2)
    
    print(f"\n" + "=" * 70)
    print(f"✓ Preprocessing Complete!")
    print(f"=" * 70)
    print(f"\n📊 Statistics:")
    print(f"   Total images: {stats['total_images']}")
    print(f"   - With tumor: {stats['images_with_tumor']}")
    print(f"   - Without tumor: {stats['images_without_tumor']}")
    print(f"   Total bounding boxes: {stats['total_boxes']}")
    print(f"   Training images: {stats['train_count']}")
    print(f"   Validation images: {stats['val_count']}")
    print(f"\n📁 Output directory: {output_dir}")
    print(f"   ├── train/")
    print(f"   │   ├── images/")
    print(f"   │   └── labels/")
    print(f"   ├── val/")
    print(f"   │   ├── images/")
    print(f"   │   └── labels/")
    print(f"   └── dataset.yaml")
    
    return True


def process_patient_set(patient_folders, output_path, split_name, stats, img_size):
    """Process a set of patient folders"""
    pbar = tqdm(patient_folders, desc=f"Processing {split_name}")
    
    for patient_folder in pbar:
        # Get all image files (non-mask)
        image_files = sorted([
            f for f in patient_folder.glob('*.tif') 
            if '_mask' not in f.name
        ])
        
        for img_file in image_files:
            # Find corresponding mask
            mask_file = img_file.parent / f"{img_file.stem}_mask.tif"
            
            # Read image
            img = cv2.imread(str(img_file))
            if img is None:
                continue
            
            # Resize image
            img = cv2.resize(img, (img_size, img_size))
            
            # Generate unique filename
            unique_name = f"{patient_folder.name}_{img_file.stem}"
            img_output = output_path / 'images' / f"{unique_name}.jpg"
            label_output = output_path / 'labels' / f"{unique_name}.txt"
            
            # Save image
            cv2.imwrite(str(img_output), img)
            
            # Process mask if exists
            boxes = []
            if mask_file.exists():
                boxes = find_contours_and_convert_to_yolo(
                    str(mask_file), img.shape, class_id=0
                )
            
            # Save labels
            with open(label_output, 'w') as f:
                for box in boxes:
                    f.write(' '.join(map(str, box)) + '\n')
            
            # Update statistics
            stats['total_images'] += 1
            stats[f'{split_name}_count'] += 1
            
            if len(boxes) > 0:
                stats['images_with_tumor'] += 1
                stats['total_boxes'] += len(boxes)
            else:
                stats['images_without_tumor'] += 1


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Preprocess Brain Tumor MRI Dataset')
    parser.add_argument('--input', type=str, default='weights/dataset_raw',
                        help='Input dataset directory')
    parser.add_argument('--output', type=str, default='weights/dataset_processed',
                        help='Output directory for processed dataset')
    parser.add_argument('--train-split', type=float, default=0.8,
                        help='Train/val split ratio (default: 0.8)')
    parser.add_argument('--img-size', type=int, default=640,
                        help='Image size for training (default: 640)')
    
    args = parser.parse_args()
    
    success = preprocess_lgg_dataset(
        input_dir=args.input,
        output_dir=args.output,
        train_split=args.train_split,
        img_size=args.img_size
    )
    
    if success:
        print("\n✓ Ready for training!")
        print(f"   Run: python train_enhanced.py --data {args.output}")
    else:
        print("\n❌ Preprocessing failed!")
        exit(1)
