# Brain Tumor Detection

This project uses a Next.js frontend and a FastAPI backend with YOLOv7 for detecting brain tumors (Glioma, Pituitary, Meningioma).

## Project Setup

### Prerequisites
- Node.js
- Python 3.8+

### Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Running the Application

**Quick Start:**
Run the startup script:
```bash
./start.sh
```

**Manual Start:**
1. Start Backend:
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```
2. Start Frontend:
```bash
npm run dev
```

## Brain Tumor Detection Model

The system requires a trained YOLOv7 model to function.

### Missing Weights
If you see an error about `weights/yolov7_brain_tumor.pt` being missing, you need to provide the model weights.

### Training a Model
If you have a dataset (images and labels in YOLO format), you can train the model yourself:

1. Organize your dataset:
   ```
   dataset/
   ├── images/
   │   ├── train_001.jpg
   │   └── ...
   └── labels/
       ├── train_001.txt
       └── ...
   ```
2. Run the training script:
   ```bash
   cd backend
   source venv/bin/activate
   python train.py --data /path/to/dataset --epochs 50
   ```
   
   This will save the trained model to `backend/weights/yolov7_brain_tumor.pt`.

3. Once trained, restart the backend server to load the new weights.
