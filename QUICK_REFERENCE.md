# Quick Reference Card 🚀

## ⚡ Quick Commands

```bash
# Verify everything is set up
bash verify_setup.sh

# Train model (complete pipeline)
cd backend && ./run_pipeline.sh

# Start application
./start.sh

# Stop application
# Press Ctrl+C or:
kill $(cat logs/backend.pid) $(cat logs/frontend.pid)
```

## 📊 Dataset Info

- **Location**: `backend/weights/dataset_raw/`
- **Files**: 15,716 TIF images (images + masks)
- **Format**: LGG-MRI segmentation
- **Structure**: kaggle_3m → patient folders

## 🏋️ Training Commands

```bash
# Complete pipeline (recommended)
cd backend
./run_pipeline.sh

# Or manual steps:
python preprocess_data.py --input weights/dataset_raw --output weights/dataset_processed
python train_enhanced.py --data weights/dataset_processed --epochs 50 --batch 8
python integrate_model.py --verify
```

## 🌐 Access Points

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

## 🧪 API Testing

```bash
# Health check
curl http://localhost:8000/health

# Model info
curl http://localhost:8000/model-info

# Prediction
curl -X POST http://localhost:8000/predict -F 'file=@image.jpg'
```

## 📁 Important Files

| File | Purpose |
|------|---------|
| `backend/run_pipeline.sh` | Complete training automation |
| `backend/preprocess_data.py` | Dataset preprocessing |
| `backend/train_enhanced.py` | Model training |
| `backend/integrate_model.py` | Model integration |
| `verify_setup.sh` | System verification |
| `start.sh` | Start all services |

## 📊 Training Output

```
backend/weights/
├── dataset_processed/         # Processed dataset
│   ├── train/                # Training data
│   └── val/                  # Validation data
├── training_output/
│   ├── best.pt              # Best model
│   ├── training_metrics.png # Loss curves
│   └── training_log.txt     # Logs
└── yolov7_brain_tumor.pt    # Production model
```

## ⚙️ Configuration

### Training Parameters (environment variables)
```bash
export EPOCHS=50
export BATCH_SIZE=8
export IMG_SIZE=640
export LEARNING_RATE=0.001
```

### Model Configuration (`backend/app/config.py`)
```python
MODEL_PATH = "weights/yolov7_brain_tumor.pt"
CONFIDENCE_THRESHOLD = 0.25
IOU_THRESHOLD = 0.45
IMAGE_SIZE = 640
```

## 🐛 Common Issues

### Out of Memory
```bash
python train_enhanced.py --batch 4 --img-size 512
```

### Port Already in Use
```bash
lsof -ti:3000 | xargs kill -9
lsof -ti:8000 | xargs kill -9
```

### Model Not Found
```bash
cd backend
python integrate_model.py --verify
```

## 📈 Expected Timeline

| Step | Time |
|------|------|
| Preprocessing | 5-10 minutes |
| Training (GPU) | 1-2 hours |
| Training (CPU) | 8-12 hours |
| Integration | < 1 minute |

## 📚 Documentation

- **TRAINING_GUIDE.md** - Complete training tutorial
- **INTEGRATION_SUMMARY.md** - Integration details
- **README_NEW.md** - Full documentation

## ✅ Success Checklist

- [ ] `bash verify_setup.sh` passes
- [ ] Dataset preprocessed
- [ ] Model trained
- [ ] Integration verified
- [ ] Backend running (port 8000)
- [ ] Frontend running (port 3000)
- [ ] Predictions working

## 🎯 Next Steps

1. ✅ **You are here** - Everything integrated
2. Run `cd backend && ./run_pipeline.sh`
3. Run `./start.sh`
4. Open http://localhost:3000
5. Upload MRI and get predictions!

---

**Need help?** Check the docs or run `bash verify_setup.sh`
