#!/bin/bash

echo "🧠 Brain Tumor Detection System - Quick Start"
echo "=============================================="
echo ""

# STRICT check: Virtual environment MUST exist
if [ ! -f "backend/venv/bin/activate" ]; then
    echo "❌ Virtual environment not found at backend/venv/"
    echo "Please set it up first:"
    echo "  cd backend"
    echo "  python3 -m venv venv"
    echo "  source venv/bin/activate"
    echo "  pip install -r requirements.txt"
    exit 1
fi
echo "✅ Virtual environment found."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ Node modules not found!"
    echo "Please run: npm install"
    exit 1
fi

echo "✅ Starting Backend Server..."
cd backend
source venv/bin/activate
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

echo "✅ Backend started (PID: $BACKEND_PID)"
echo "   API: http://localhost:8000"
echo "   Docs: http://localhost:8000/docs"
echo ""

# Wait for backend to fully load both YOLO models (takes ~8-10s on CPU)
sleep 12

echo "✅ Starting Frontend Server..."
npm run dev &
FRONTEND_PID=$!

echo "✅ Frontend started (PID: $FRONTEND_PID)"
echo "   App: http://localhost:3000"
echo ""

echo "=============================================="
echo "🚀 System is running!"
echo "=============================================="
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"
echo "=============================================="

# Wait for Ctrl+C
trap "echo ''; echo '🛑 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT

wait
