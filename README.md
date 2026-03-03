# NeuroSight AI 🧠

**Medical-grade, real-time brain tumor detection and classification powered by an advanced dual-model YOLOv8 architecture.**

NeuroSight AI provides a stunning, high-performance web interface designed for medical professionals. Instantly analyze MRI scans to detect and classify Gliomas, Pituitary tumors, and Meningiomas with precision.

![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-black)
![Tailwind](https://img.shields.io/badge/Styling-Tailwind%20CSS-blue)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-teal)
![YOLOv8](https://img.shields.io/badge/Model-YOLOv8-green)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)

---

## ✨ System Features

### The "Glassmorphism" UI Engine

Experience a premium, responsive interface featuring dynamic animated gradients and sleek glassmorphism cards. Built for speed and visual clarity.

### Adaptive Dual-Model Architecture

Switch effortlessly between two specialized Ultralytics YOLOv8 models directly from the frontend:

- 🟢 **YOLOv8 Nano (`.pt`)**: Engineered for lightning-fast inference on edge devices or low-bandwidth environments.
- 🟣 **YOLOv8 Medium (`.pt`)**: Substantially deeper neural layers designed to catch hyper-complex or ambiguous tumor margins.

### Zero-Disk Pipeline (HIPAA Conscious)

Security is paramount. When an MRI scan is uploaded, it is converted to a byte stream, held temporarily in the backend Server's RAM for inference, and **immediately destroyed**. Images are never saved to disk.

---

## 🚀 Quick Start & Installation

### Prerequisites

- **Python 3.9+** with pip
- **Node.js 16+** with npm

### 1. Model Preparation

Before running the system, place your custom-trained YOLOv8 `.pt` weight files into the backend:

```bash
# Place your trained models here:
backend/weights/yolov8/yolov8n.pt
backend/weights/yolov8/yolov8m.pt
```

### 2. Easiest Way — One Command (Recommended)

From the project root, simply run:

```bash
bash start.sh
```

This automatically activates the virtual environment, starts the backend (waits 12 seconds for YOLOv8 models to load), then starts the frontend. Press `Ctrl+C` to stop everything.

### 3. Manual Start (Two Terminals)

**Terminal 1 — Backend:**

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

_The API will start listening on `http://localhost:8000`_

**Terminal 2 — Frontend:**

```bash
# In the root repository folder
npm install
npm run dev
```

_The web app will start on `http://localhost:3000`_

---

## 🧪 Testing & Verification

1. Open **[http://localhost:3000](http://localhost:3000)** in your browser.
2. Navigate to the **"Detect"** portal.
3. Click the toggle switch to select either the **Nano** or **Medium** AI architecture.
4. Upload an MRI scan (Supports JPEG, PNG, WebP up to 10MB).
5. Click **Analyze MRI Scan** and review the colored, confidence-scored bounding boxes.

### Live API Verification

You can manually check the health of the python backend:

```bash
# Verify system health
curl http://localhost:8000/health

# See which models are loaded in memory
curl http://localhost:8000/model-info
```

---

## 📊 Expected Performance Matrix

Based on standard MRI processing, expected characteristics:

| Metric                                      | YOLOv8 Nano                   | YOLOv8 Medium           |
| ------------------------------------------- | ----------------------------- | ----------------------- |
| Typical Inference Time (Local M-Series/GPU) | ~0.04 - 0.08 s                | ~0.12 - 0.20 s          |
| Training MAP50                              | ~ 91.1 %                      | ~ 91.2 %                |
| File Size                                   | ~ 6 MB                        | ~ 52 MB                 |
| Primary Use Case                            | Fast triage & distinct masses | Ambiguous, blurry scans |

_(Note: Because identifying a tumor mass in an MRI is a relatively distinct visual feature, both models achieve excellent MAP50 scores. The medium model excels primarily in extreme edge cases requiring deep-layer processing)._

---

## 📁 Repository Structure

```text
NeuroSight-AI/
├── app/                      # Next.js Frontend App Router
│   ├── detect/page.tsx       # Core analysis UI and Model Toggle
│   ├── result/page.tsx       # Full screen results view
│   └── page.tsx              # Premium animated landing page
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI endpoints (/predict)
│   │   └── services/
│   │       └── inference.py  # Ultralytics PyTorch wrapper
│   ├── weights/              # AI .pt Model holding directory
│   └── requirements.txt      # Python dependencies
├── components/               # Reusable React UI Components
│   └── ImagePreview.tsx      # Canvas-based bounding box renderer
├── lib/                      # Utilities
│   ├── api.ts                # Cross-Origin Resouce fetchers
│   └── utils.ts              # Bounding Box color mapping algorithms
├── postcss.config.mjs        # PostCSS / Tailwind CSS config
└── start.sh                  # One-command startup script
```

---

## 🔧 System Configuration

### Frontend Timeouts

If you are deploying to a slow server, you can heavily increase the API wait time by navigating to `lib/api.ts` or by setting an Environmental variable:

```bash
NEXT_PUBLIC_API_TIMEOUT=30000
```

### Backend Thresholds

You can tweak the AI's strictness and sensitivity in `backend/app/config.py`:

```python
CONFIDENCE_THRESHOLD = 0.25  # Minimum confidence to display a box
IOU_THRESHOLD = 0.45         # Overlap strictness
```

---

## 🐛 Troubleshooting

**"Port 8000 is already in use"**
If the backend crashes and leaves a ghost process running:

```bash
lsof -ti:8000 | xargs kill -9
```

**"Labels are white-on-white and invisible"**
This codebase actively maps the text `.toLowerCase()` before drawing boxes in `lib/utils.ts`. If you train a completely custom model with brand-new class names (e.g. "Lesion"), you must add the lowercase key `'lesion'` to the `colorMap` dictionaries in `lib/utils.ts`.

---

## 🤝 Contributing & License

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/).

This project combines:

- **FastAPI & Next.js** - MIT License
- **YOLOv8** - AGPL-3.0 License

### 🔒 Medical Disclaimer

This system is strictly for **research and educational purposes only**. It is NOT approved by the FDA or any regulatory body for clinical diagnosis, patient care, or medical decision-making. Always consult qualified healthcare professionals for medical advice.
