# Brain Tumor Detection System 🧠

AI-powered brain tumor detection using YOLOv7 and MRI scans. Complete with training pipeline, real-time analysis, and beautiful web interface.

![Brain Tumor Detection](https://img.shields.io/badge/AI-Brain%20Tumor%20Detection-blue)
![YOLOv7](https://img.shields.io/badge/Model-YOLOv7-green)
![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-teal)

## ✨ Features

- 🤖 **YOLOv7 Detection** - State-of-the-art object detection model
- 🎯 **Real-time Analysis** - Fast inference with progress visualization
- 📊 **Complete Training Pipeline** - End-to-end model training workflow
- 🎨 **Modern UI** - Beautiful, responsive web interface with animations
- 🔄 **Auto Dataset Processing** - Convert MRI masks to YOLO format
- 📈 **Training Metrics** - Real-time monitoring and visualization
- 🚀 **Production Ready** - FastAPI backend with Next.js frontend
- 🔬 **Medical Grade** - Designed for MRI brain tumor analysis

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **~5GB disk space** for dataset and models
- **Optional:** CUDA-capable GPU for faster training

### 1. Installation

```bash
# Clone repository
git clone <your-repo-url>
cd btd

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### 2. Verify Setup

```bash
bash verify_setup.sh
```

This checks:
- ✅ System requirements
- ✅ Project structure
- ✅ Dependencies
- ✅ Dataset presence
- ✅ Configuration

## 🏋️ Training Your Model

### Step 1: Prepare Dataset

Place your **LGG-MRI segmentation dataset** in:
```
backend/weights/dataset_raw/kaggle_3m/
├── TCGA_CS_6667_20011105/
│   ├── image_1.tif
│   ├── image_1_mask.tif
│   └── ...
└── [other patient folders]/
```

**Dataset Structure:**
- Image files: `*.tif`
- Mask files: `*_mask.tif`

### Step 2: Run Complete Pipeline

```bash
cd backend
./run_pipeline.sh
```

**This automatically:**
1. ✅ Preprocesses dataset (mask → YOLO bounding boxes)
2. ✅ Trains YOLOv7 model (50 epochs)
3. ✅ Integrates model with backend
4. ✅ Generates training metrics

**Training Time:**
- GPU: ~1-2 hours
- CPU: ~8-12 hours

**Output:**
```
backend/weights/
├── dataset_processed/        # YOLO format dataset
├── training_output/          # Training results
│   ├── best.pt              # Best model checkpoint
│   ├── training_metrics.png # Loss curves
│   └── training_log.txt     # Detailed logs
└── yolov7_brain_tumor.pt    # Production model
```

### Step 3: Start Application

```bash
cd ..
./start.sh
```

**Access:**
- 🌐 Frontend: http://localhost:3000
- 🔌 Backend API: http://localhost:8000
- 📚 API Docs: http://localhost:8000/docs

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [TRAINING_GUIDE.md](TRAINING_GUIDE.md) | Complete training tutorial with tips |
| [INTEGRATION_SUMMARY.md](INTEGRATION_SUMMARY.md) | What's been integrated and how |

## 🎯 Manual Training (Advanced)

### Preprocess Dataset

```bash
cd backend
python preprocess_data.py \
  --input weights/dataset_raw \
  --output weights/dataset_processed \
  --train-split 0.8 \
  --img-size 640
```

**Options:**
- `--input`: Input dataset directory
- `--output`: Output directory for processed data
- `--train-split`: Train/validation split ratio (default: 0.8)
- `--img-size`: Image size for training (default: 640)

### Train Model

```bash
python train_enhanced.py \
  --data weights/dataset_processed \
  --epochs 50 \
  --batch 8 \
  --img-size 640 \
  --lr 0.001
```

**Options:**
- `--data`: Processed dataset directory
- `--epochs`: Number of training epochs (default: 50)
- `--batch`: Batch size (default: 8)
- `--img-size`: Image size (default: 640)
- `--lr`: Learning rate (default: 0.001)

**Monitor Training:**
```bash
# Watch logs
tail -f weights/training_output/training_log.txt

# View metrics
open weights/training_output/training_metrics.png
```

### Integrate Model

```bash
python integrate_model.py \
  --model weights/training_output/yolov7_brain_tumor_best.pt \
  --verify
```

## 🧪 Testing

### Test Backend API

```bash
# Health check
curl http://localhost:8000/health

# Model info
curl http://localhost:8000/model-info

# Make prediction
curl -X POST http://localhost:8000/predict \
  -F 'file=@path/to/brain_mri.jpg'
```

### Test Frontend

1. Open http://localhost:3000
2. Upload an MRI scan
3. Click "Analyze MRI Scan"
4. View results with bounding boxes

## 📊 Project Structure

```
btd/
├── app/                      # Next.js pages
│   ├── detect/              # Detection page
│   ├── result/              # Results page
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── AnalysisProgress.tsx # Real-time progress
│   ├── ImageUpload.tsx      # Image upload
│   └── ...
├── backend/
│   ├── app/
│   │   ├── main.py         # FastAPI app
│   │   ├── model/          # YOLOv7 model
│   │   └── services/       # Inference service
│   ├── weights/            # Models & datasets
│   ├── preprocess_data.py  # Dataset preprocessing
│   ├── train_enhanced.py   # Training script
│   ├── integrate_model.py  # Model integration
│   └── run_pipeline.sh     # Complete pipeline
├── lib/                     # Frontend utilities
├── public/                  # Static assets
├── start.sh                 # Start services
├── verify_setup.sh          # Setup verification
└── README.md               # This file
```

## 🔧 Configuration

### Backend Configuration

Edit `backend/app/config.py`:

```python
MODEL_PATH = "weights/yolov7_brain_tumor.pt"  # Model location
CONFIDENCE_THRESHOLD = 0.25                    # Detection threshold
IOU_THRESHOLD = 0.45                           # NMS threshold
IMAGE_SIZE = 640                               # Input image size
```

### Training Configuration

Edit `backend/run_pipeline.sh` or use environment variables:

```bash
export EPOCHS=100           # Number of epochs
export BATCH_SIZE=16        # Batch size
export IMG_SIZE=640         # Image size
export LEARNING_RATE=0.001  # Learning rate

./run_pipeline.sh
```

## 📈 Expected Results

With **LGG-MRI segmentation dataset**:

| Metric | Value |
|--------|-------|
| Dataset Size | ~3,929 images |
| Training Images | ~3,143 |
| Validation Images | ~786 |
| Training Time (GPU) | 1-2 hours |
| Training Time (CPU) | 8-12 hours |
| Model Size | ~70-80 MB |
| Training Loss | 0.001-0.01 |
| Validation Loss | 0.001-0.02 |

## 🐛 Troubleshooting

### Dataset Not Found
```bash
ls -R backend/weights/dataset_raw/
# Should show kaggle_3m with patient folders
```

### Out of Memory
```bash
# Reduce batch size
python train_enhanced.py --batch 4

# Or reduce image size
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

### Port Already in Use
```bash
# Kill existing processes
lsof -ti:3000 | xargs kill -9
lsof -ti:8000 | xargs kill -9
```

## 🎓 Usage Tips

### Improving Accuracy

1. **More Training Data** - Add diverse MRI scans
2. **Data Augmentation** - Already implemented
3. **Hyperparameter Tuning** - Try different learning rates
4. **Longer Training** - Increase epochs
5. **Transfer Learning** - Use pretrained weights

### Best Practices

- ✅ Use GPU for training (much faster)
- ✅ Monitor training metrics regularly
- ✅ Backup models before retraining
- ✅ Test on validation set before deployment
- ✅ Use proper medical-grade validation

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project uses:
- **YOLOv7** - GPL-3.0 License
- **FastAPI** - MIT License
- **Next.js** - MIT License

## 🔒 Medical Disclaimer

This system is for **research and educational purposes only**. It is NOT approved for clinical diagnosis or medical decision-making. Always consult qualified medical professionals for health-related decisions.

## 🌟 Acknowledgments

- YOLOv7 team for the amazing model
- LGG-MRI segmentation dataset contributors
- FastAPI and Next.js communities

## 📧 Support

For issues or questions:

1. Check [TRAINING_GUIDE.md](TRAINING_GUIDE.md)
2. Review error logs
3. Verify system requirements
4. Run `bash verify_setup.sh`

## 🎉 Success Checklist

- ✅ Dependencies installed
- ✅ Dataset preprocessed
- ✅ Model trained successfully
- ✅ Integration verified
- ✅ Backend running (port 8000)
- ✅ Frontend running (port 3000)
- ✅ Predictions working
- ✅ Results displaying correctly

---

**Ready to detect tumors? 🧠🔬**

```bash
# First time setup
bash verify_setup.sh
cd backend && ./run_pipeline.sh
cd .. && ./start.sh
```

**Happy analyzing! 🚀**
