#!/bin/bash
#
# Complete Pipeline Script
# Preprocesses data, trains model, and integrates with backend
#

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║  Brain Tumor Detection - Complete Training Pipeline              ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

# Configuration
EPOCHS=${EPOCHS:-20}
BATCH_SIZE=${BATCH_SIZE:-8}
IMG_SIZE=${IMG_SIZE:-640}
LEARNING_RATE=${LEARNING_RATE:-0.001}

echo "⚙️  Configuration:"
echo "   Epochs: $EPOCHS"
echo "   Batch Size: $BATCH_SIZE"
echo "   Image Size: $IMG_SIZE"
echo "   Learning Rate: $LEARNING_RATE"
echo ""

# Check if we're in the backend directory
if [ ! -f "app/main.py" ]; then
    echo "❌ Error: Please run this script from the backend/ directory"
    exit 1
fi

# Check if dataset exists
if [ ! -d "weights/dataset_raw" ]; then
    echo "❌ Error: Dataset not found at weights/dataset_raw/"
    echo "   Please place the LGG-MRI segmentation dataset there first"
    exit 1
fi

echo "✓ Dataset found"
echo ""

# Step 1: Data Preprocessing
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Data Preprocessing"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

python3 preprocess_data.py \
    --input weights/dataset_raw \
    --output weights/dataset_processed \
    --train-split 0.8 \
    --img-size $IMG_SIZE

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Preprocessing failed!"
    exit 1
fi

echo ""
echo "✓ Preprocessing complete"
echo ""

# Step 2: Model Training
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: Model Training"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

python3 train_enhanced.py \
    --data weights/dataset_processed \
    --epochs $EPOCHS \
    --batch $BATCH_SIZE \
    --img-size $IMG_SIZE \
    --lr $LEARNING_RATE \
    --output weights/training_output

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Training failed!"
    exit 1
fi

echo ""
echo "✓ Training complete"
echo ""

# Step 3: Model Integration
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3: Model Integration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

python3 integrate_model.py \
    --model weights/training_output/yolov7_brain_tumor_best.pt \
    --target weights/yolov7_brain_tumor.pt \
    --verify

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Integration failed!"
    exit 1
fi

echo ""
echo "✓ Integration complete"
echo ""

# Final Summary
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║  ✓ Pipeline Complete!                                             ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""
echo "📋 Summary:"
echo "   ✓ Data preprocessed"
echo "   ✓ Model trained ($EPOCHS epochs)"
echo "   ✓ Model integrated with backend"
echo ""
echo "📁 Output Files:"
echo "   ├─ Dataset: weights/dataset_processed/"
echo "   ├─ Training: weights/training_output/"
echo "   ├─ Model: weights/yolov7_brain_tumor.pt"
echo "   └─ Metrics: weights/training_output/training_metrics.png"
echo ""
echo "🚀 Next Steps:"
echo "   1. Start the backend:"
echo "      uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
echo ""
echo "   2. Test the API:"
echo "      curl http://localhost:8000/health"
echo ""
echo "   3. Make predictions:"
echo "      curl -X POST http://localhost:8000/predict \\"
echo "           -F 'file=@path/to/brain_scan.jpg'"
echo ""
echo "   4. Start the frontend (in another terminal):"
echo "      cd .. && npm run dev"
echo ""
