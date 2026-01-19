#!/bin/bash
#
# System Verification Script
# Tests that everything is properly set up
#

echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║  Brain Tumor Detection - System Verification                      ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

ERRORS=0
WARNINGS=0

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_pass() {
    echo -e "${GREEN}✓${NC} $1"
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    ERRORS=$((ERRORS + 1))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    WARNINGS=$((WARNINGS + 1))
}

echo "📋 Checking System Requirements..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
    check_pass "Python 3 installed (version $PYTHON_VERSION)"
else
    check_fail "Python 3 not found"
fi

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    check_pass "Node.js installed (version $NODE_VERSION)"
else
    check_fail "Node.js not found"
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    check_pass "npm installed (version $NPM_VERSION)"
else
    check_fail "npm not found"
fi

echo ""
echo "📁 Checking Project Structure..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check directories
if [ -d "backend" ]; then
    check_pass "Backend directory exists"
else
    check_fail "Backend directory not found"
fi

if [ -d "app" ]; then
    check_pass "Frontend app directory exists"
else
    check_fail "Frontend app directory not found"
fi

if [ -d "components" ]; then
    check_pass "Components directory exists"
else
    check_fail "Components directory not found"
fi

# Check key files
if [ -f "backend/app/main.py" ]; then
    check_pass "Backend main.py exists"
else
    check_fail "Backend main.py not found"
fi

if [ -f "backend/preprocess_data.py" ]; then
    check_pass "Data preprocessing script exists"
else
    check_fail "Data preprocessing script not found"
fi

if [ -f "backend/train_enhanced.py" ]; then
    check_pass "Training script exists"
else
    check_fail "Training script not found"
fi

if [ -f "backend/integrate_model.py" ]; then
    check_pass "Model integration script exists"
else
    check_fail "Model integration script not found"
fi

if [ -f "backend/run_pipeline.sh" ]; then
    check_pass "Pipeline script exists"
    if [ -x "backend/run_pipeline.sh" ]; then
        check_pass "Pipeline script is executable"
    else
        check_warn "Pipeline script is not executable (run: chmod +x backend/run_pipeline.sh)"
    fi
else
    check_fail "Pipeline script not found"
fi

if [ -f "components/AnalysisProgress.tsx" ]; then
    check_pass "Analysis progress component exists"
else
    check_fail "Analysis progress component not found"
fi

echo ""
echo "🔧 Checking Backend Setup..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check virtual environment
if [ -d "backend/venv" ]; then
    check_pass "Virtual environment exists"
    
    # Check if packages are installed
    if [ -f "backend/venv/bin/python" ]; then
        TORCH_CHECK=$(backend/venv/bin/python -c "import torch; print('ok')" 2>/dev/null)
        if [ "$TORCH_CHECK" = "ok" ]; then
            check_pass "PyTorch installed"
        else
            check_warn "PyTorch not installed (run: pip install torch)"
        fi
        
        FASTAPI_CHECK=$(backend/venv/bin/python -c "import fastapi; print('ok')" 2>/dev/null)
        if [ "$FASTAPI_CHECK" = "ok" ]; then
            check_pass "FastAPI installed"
        else
            check_warn "FastAPI not installed (run: pip install fastapi)"
        fi
        
        CV2_CHECK=$(backend/venv/bin/python -c "import cv2; print('ok')" 2>/dev/null)
        if [ "$CV2_CHECK" = "ok" ]; then
            check_pass "OpenCV installed"
        else
            check_warn "OpenCV not installed (run: pip install opencv-python)"
        fi
    fi
else
    check_warn "Virtual environment not found (run: cd backend && python3 -m venv venv)"
fi

# Check weights directory
if [ -d "backend/weights" ]; then
    check_pass "Weights directory exists"
    
    # Check for dataset
    if [ -d "backend/weights/dataset_raw" ]; then
        check_pass "Dataset raw directory exists"
        
        # Count dataset files
        DATASET_COUNT=$(find backend/weights/dataset_raw -name "*.tif" 2>/dev/null | wc -l | tr -d ' ')
        if [ "$DATASET_COUNT" -gt 0 ]; then
            check_pass "Dataset found ($DATASET_COUNT TIF files)"
        else
            check_warn "No dataset files found (place dataset in backend/weights/dataset_raw/)"
        fi
    else
        check_warn "Dataset directory not found (create: mkdir -p backend/weights/dataset_raw)"
    fi
    
    # Check for trained model
    if [ -f "backend/weights/yolov7_brain_tumor.pt" ]; then
        MODEL_SIZE=$(du -h backend/weights/yolov7_brain_tumor.pt | cut -f1)
        check_pass "Trained model exists ($MODEL_SIZE)"
    else
        check_warn "Trained model not found (run training pipeline)"
    fi
    
    # Check for processed dataset
    if [ -d "backend/weights/dataset_processed" ]; then
        check_pass "Processed dataset exists"
    else
        check_warn "Processed dataset not found (run preprocessing)"
    fi
else
    check_fail "Weights directory not found"
fi

echo ""
echo "🎨 Checking Frontend Setup..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check node_modules
if [ -d "node_modules" ]; then
    check_pass "Node modules installed"
else
    check_warn "Node modules not found (run: npm install)"
fi

# Check package.json
if [ -f "package.json" ]; then
    check_pass "package.json exists"
else
    check_fail "package.json not found"
fi

# Check next.config
if [ -f "next.config.ts" ] || [ -f "next.config.js" ]; then
    check_pass "Next.js config exists"
else
    check_warn "Next.js config not found"
fi

echo ""
echo "📚 Checking Documentation..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -f "TRAINING_GUIDE.md" ]; then
    check_pass "Training guide exists"
else
    check_warn "Training guide not found"
fi

if [ -f "INTEGRATION_SUMMARY.md" ]; then
    check_pass "Integration summary exists"
else
    check_warn "Integration summary not found"
fi

if [ -f "README.md" ]; then
    check_pass "README exists"
else
    check_warn "README not found"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Verification Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "🚀 You're ready to:"
    echo "   1. Train the model: cd backend && ./run_pipeline.sh"
    echo "   2. Start the app: ./start.sh"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ $WARNINGS warning(s) found${NC}"
    echo ""
    echo "System is functional but some optional components are missing."
    echo "Review warnings above and install missing components if needed."
else
    echo -e "${RED}✗ $ERRORS error(s) found${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠ $WARNINGS warning(s) found${NC}"
    fi
    echo ""
    echo "Please fix the errors above before proceeding."
    exit 1
fi

echo ""
echo "📋 Next Steps:"
echo ""
echo "1. If dataset is ready:"
echo "   cd backend && ./run_pipeline.sh"
echo ""
echo "2. If dependencies are missing:"
echo "   cd backend && source venv/bin/activate && pip install -r requirements.txt"
echo "   npm install"
echo ""
echo "3. To verify services:"
echo "   ./start.sh"
echo ""
