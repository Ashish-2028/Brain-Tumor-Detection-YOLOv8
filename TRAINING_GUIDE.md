# Brain Tumor Detection - Complete Training & Integration Guide

## 🚀 Quick Start

This guide will help you train the model with your MRI dataset and integrate it with the application.

## 📋 Prerequisites

- Python 3.8+ with pip
- Node.js 16+ with npm
- MRI dataset (LGG-MRI segmentation format)
- ~5GB disk space for dataset and models
- Optional: CUDA-capable GPU for faster training

## 📁 Dataset Setup

1. **Download the LGG-MRI Segmentation Dataset**
   - Dataset: Brain MRI with tumor masks (TIF format)
   - Expected structure:
     ```
     backend/weights/dataset_raw/
     └── kaggle_3m/
         ├── TCGA_CS_6667_20011105/
         │   ├── image_1.tif
         │   ├── image_1_mask.tif
         │   └── ...
         └── [other patient folders]/
     ```

2. **Place the dataset in the correct location**
   ```bash
   mkdir -p backend/weights/dataset_raw
   # Copy your dataset to: backend/weights/dataset_raw/
   ```

## 🔧 Installation

### Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install torch torchvision torchaudio
pip install opencv-python numpy pillow tqdm matplotlib
pip install fastapi uvicorn python-multipart pydantic
```

### Frontend Setup

```bash
# From project root
npm install
```

## 🏋️ Training Pipeline

### Option 1: Automated Pipeline (Recommended)

Run the complete pipeline with one command:

```bash
cd backend
source venv/bin/activate
chmod +x run_pipeline.sh
./run_pipeline.sh
```

This will:
1. Preprocess the dataset
2. Train the model
3. Integrate with the backend

### Option 2: Manual Step-by-Step

#### Step 1: Preprocess Dataset

```bash
cd backend
source venv/bin/activate

python preprocess_data.py \
  --input weights/dataset_raw \
  --output weights/dataset_processed \
  --train-split 0.8 \
  --img-size 640
```

**Output:**
- `weights/dataset_processed/train/` - Training images and labels
- `weights/dataset_processed/val/` - Validation images and labels
- `weights/dataset_processed/dataset.yaml` - Dataset configuration

#### Step 2: Train Model

```bash
python train_enhanced.py \
  --data weights/dataset_processed \
  --epochs 50 \
  --batch 8 \
  --img-size 640 \
  --lr 0.001 \
  --output weights/training_output
```

**Training Configuration:**
- `--epochs`: Number of training epochs (default: 50)
- `--batch`: Batch size (default: 8, adjust based on GPU memory)
- `--img-size`: Image size for training (default: 640)
- `--lr`: Learning rate (default: 0.001)

**Output:**
- `weights/training_output/best.pt` - Best model checkpoint
- `weights/training_output/last.pt` - Last model checkpoint
- `weights/training_output/training_metrics.png` - Training graphs
- `weights/training_output/training_log.txt` - Training logs

**Training Tips:**
- Use smaller batch size (4-8) if you get out-of-memory errors
- Training 50 epochs takes ~1-2 hours on GPU, ~8-12 hours on CPU
- Monitor the training metrics graph to check for overfitting
- Early stopping: If validation loss stops decreasing, stop training

#### Step 3: Integrate Model

```bash
python integrate_model.py \
  --model weights/training_output/yolov7_brain_tumor_best.pt \
  --target weights/yolov7_brain_tumor.pt \
  --verify
```

This copies the trained model to the location expected by the API.

## 🚀 Running the Application

### Start Backend

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: http://localhost:8000

### Start Frontend

```bash
# From project root (in another terminal)
npm run dev
```

The web application will be available at: http://localhost:3000

## 🧪 Testing

### Test API Health

```bash
curl http://localhost:8000/health
```

### Test Model Prediction

```bash
curl -X POST http://localhost:8000/predict \
  -F 'file=@path/to/brain_mri.jpg'
```

### Test Model Info

```bash
curl http://localhost:8000/model-info
```

## 📊 Monitoring Training

During training, you can monitor:

1. **Real-time Console Output**
   - Training/validation loss per batch
   - Epoch summaries
   - Learning rate updates

2. **Training Metrics Graph**
   - Updated every 5 epochs
   - Location: `weights/training_output/training_metrics.png`
   - Shows:
     - Training & validation loss curves
     - Learning rate schedule
     - Epoch times
     - Summary statistics

3. **Training Log**
   - Location: `weights/training_output/training_log.txt`
   - Contains detailed epoch-by-epoch metrics

## 🎯 Model Performance Tips

### Improving Accuracy

1. **More Training Data**
   - Add more diverse MRI scans
   - Ensure balanced tumor types

2. **Data Augmentation**
   - Already implemented: brightness, flip, rotation
   - Modify `train_enhanced.py` for more augmentation

3. **Hyperparameter Tuning**
   ```bash
   # Try different learning rates
   python train_enhanced.py --lr 0.0001
   
   # Try more epochs
   python train_enhanced.py --epochs 100
   
   # Try larger batch size (if GPU memory allows)
   python train_enhanced.py --batch 16
   ```

4. **Transfer Learning**
   - Use pretrained YOLOv7 weights
   - Fine-tune on brain tumor data

## 🐛 Troubleshooting

### Dataset Not Found

```bash
# Check dataset structure
ls -R backend/weights/dataset_raw/

# Should show kaggle_3m folder with patient subfolders
```

### Out of Memory During Training

```bash
# Reduce batch size
python train_enhanced.py --batch 4

# Reduce image size
python train_enhanced.py --img-size 512
```

### Model Not Loading

```bash
# Verify model exists
ls -lh backend/weights/yolov7_brain_tumor.pt

# Test model loading
cd backend
python integrate_model.py --verify
```

### Backend Connection Issues

```bash
# Check if backend is running
curl http://localhost:8000/health

# Check firewall settings
# Ensure port 8000 is accessible

# Check logs
# Backend terminal will show request logs
```

## 📁 Project Structure

```
btd/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── config.py            # Configuration
│   │   ├── model/
│   │   │   └── yolov7.py        # YOLOv7 model
│   │   ├── services/
│   │   │   └── inference.py     # Inference service
│   │   └── utils/               # Utility functions
│   ├── weights/
│   │   ├── dataset_raw/         # Raw dataset (you provide)
│   │   ├── dataset_processed/   # Processed dataset
│   │   ├── training_output/     # Training outputs
│   │   └── yolov7_brain_tumor.pt  # Final model
│   ├── preprocess_data.py       # Data preprocessing
│   ├── train_enhanced.py        # Training script
│   ├── integrate_model.py       # Model integration
│   ├── run_pipeline.sh          # Complete pipeline
│   └── requirements.txt         # Python dependencies
├── app/                         # Next.js frontend
├── components/                  # React components
├── lib/                         # Frontend utilities
└── public/                      # Static assets
```

## 📊 Dataset Statistics

After preprocessing, you'll see:
- Total images processed
- Images with/without tumors
- Total bounding boxes detected
- Train/validation split counts

Example output:
```
Total images: 3929
- With tumor: 2645
- Without tumor: 1284
Total bounding boxes: 5234
Training images: 3143
Validation images: 786
```

## 🔄 Retraining the Model

To retrain with new data:

1. **Add new data to dataset_raw**
2. **Run preprocessing again** (will overwrite processed data)
3. **Train new model**
4. **Integrate updated model**

```bash
cd backend
./run_pipeline.sh
```

## 📈 Expected Training Results

After 50 epochs with the LGG-MRI dataset:
- Training Loss: ~0.001-0.01
- Validation Loss: ~0.001-0.02
- Training Time: 1-2 hours (GPU) / 8-12 hours (CPU)
- Model Size: ~70-80 MB

## 🎓 Next Steps

1. ✅ Train model with your dataset
2. ✅ Test predictions through API
3. ✅ Use web interface for detection
4. 📊 Evaluate model performance
5. 🔧 Fine-tune hyperparameters
6. 🚀 Deploy to production

## 📝 License

This project uses:
- YOLOv7 (GPL-3.0 License)
- FastAPI (MIT License)
- Next.js (MIT License)

## 🤝 Support

For issues or questions:
1. Check training logs
2. Verify dataset structure
3. Review error messages
4. Check system requirements

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ Preprocessing completes without errors
- ✅ Training shows decreasing loss
- ✅ Model integration verifies successfully
- ✅ Backend health check returns "healthy"
- ✅ Frontend loads and accepts images
- ✅ Predictions show bounding boxes and tumor classification

---

**Ready to get started? Run the pipeline:**

```bash
cd backend
source venv/bin/activate
./run_pipeline.sh
```

Good luck with your brain tumor detection model! 🧠🔬
