import requests
import json
from pathlib import Path

API_URL = "http://localhost:8000"
IMAGE_PATH = "path/to/your/mri_image.jpg"

def check_health():
    print("🔍 Checking API health...")
    response = requests.get(f"{API_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

def get_model_info():
    print("📊 Getting model information...")
    response = requests.get(f"{API_URL}/model-info")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

def predict_tumor(image_path):
    print(f"🧠 Analyzing image: {image_path}")
    
    if not Path(image_path).exists():
        print(f"❌ Image not found: {image_path}")
        print("Please update IMAGE_PATH variable with a valid MRI image")
        return
    
    with open(image_path, 'rb') as f:
        files = {'file': f}
        response = requests.post(f"{API_URL}/predict", files=files)
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"\n✅ Analysis Complete!")
        print(f"Tumor Type: {result['tumor_type']}")
        print(f"Confidence: {result['confidence']:.2%}")
        print(f"Detections: {len(result['boxes'])}")
        print(f"Processing Time: {result.get('inference_time', 'N/A')}s")
        
        if result['boxes']:
            print("\nDetected Regions:")
            for i, box in enumerate(result['boxes'], 1):
                print(f"  {i}. {box['label']} - {box['score']:.2%} confidence")
                print(f"     Location: ({box['x1']:.0f}, {box['y1']:.0f}) to ({box['x2']:.0f}, {box['y2']:.0f})")
    else:
        print(f"❌ Error: {response.text}")
    print()

def main():
    print("=" * 60)
    print("Brain Tumor Detection - API Example")
    print("=" * 60)
    print()
    
    try:
        check_health()
        
        get_model_info()
        
        print("=" * 60)
        print("Example Usage:")
        print("  1. Update IMAGE_PATH with your MRI image")
        print("  2. Uncomment predict_tumor() line")
        print("  3. Run: python api_example.py")
        print("=" * 60)
        
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to API")
        print("Please ensure the backend is running:")
        print("  cd backend && uvicorn app.main:app --reload")

if __name__ == "__main__":
    main()
