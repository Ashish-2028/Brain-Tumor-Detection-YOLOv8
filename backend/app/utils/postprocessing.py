import torch
import torch.nn.functional as F
import torchvision.ops
import numpy as np
from typing import List, Dict, Tuple
import cv2


def non_max_suppression(
    prediction: torch.Tensor,
    conf_thres: float = 0.25,
    iou_thres: float = 0.45,
    max_det: int = 300
) -> List[torch.Tensor]:
    nc = prediction.shape[2] - 5
    xc = prediction[..., 4] > conf_thres

    max_wh = 7680
    max_nms = 30000
    
    output = [torch.zeros((0, 6), device=prediction.device)] * prediction.shape[0]
    
    for xi, x in enumerate(prediction):
        x = x[xc[xi]]

        if not x.shape[0]:
            continue

        x[:, 5:] *= x[:, 4:5]

        box = xywh2xyxy(x[:, :4])

        conf, j = x[:, 5:].max(1, keepdim=True)
        x = torch.cat((box, conf, j.float()), 1)[conf.view(-1) > conf_thres]

        n = x.shape[0]
        if not n:
            continue
        elif n > max_nms:
            x = x[x[:, 4].argsort(descending=True)[:max_nms]]

        c = x[:, 5:6] * max_wh
        boxes, scores = x[:, :4] + c, x[:, 4]
        i = torchvision.ops.nms(boxes, scores, iou_thres)
        if i.shape[0] > max_det:
            i = i[:max_det]

        output[xi] = x[i]

    return output


def xywh2xyxy(x: torch.Tensor) -> torch.Tensor:
    y = x.clone() if isinstance(x, torch.Tensor) else np.copy(x)
    y[:, 0] = x[:, 0] - x[:, 2] / 2
    y[:, 1] = x[:, 1] - x[:, 3] / 2
    y[:, 2] = x[:, 0] + x[:, 2] / 2
    y[:, 3] = x[:, 1] + x[:, 3] / 2
    return y


def xyxy2xywh(x: torch.Tensor) -> torch.Tensor:
    """
    Convert bounding box format from [x1, y1, x2, y2] to [x_center, y_center, width, height]
    
    Args:
        x: Bounding boxes in xyxy format
    
    Returns:
        Bounding boxes in xywh format
    """
    y = x.clone() if isinstance(x, torch.Tensor) else np.copy(x)
    y[:, 0] = (x[:, 0] + x[:, 2]) / 2  # x center
    y[:, 1] = (x[:, 1] + x[:, 3]) / 2  # y center
    y[:, 2] = x[:, 2] - x[:, 0]  # width
    y[:, 3] = x[:, 3] - x[:, 1]  # height
    return y


def format_detections(detections: torch.Tensor, class_names: Dict[int, str]) -> List[Dict]:
    """
    Format detections into JSON-serializable format
    
    Args:
        detections: Detection tensor [num_det, 6] (x1, y1, x2, y2, conf, cls)
        class_names: Dictionary mapping class indices to names
    
    Returns:
        List of detection dictionaries
    """
    boxes = []
    for det in detections:
        x1, y1, x2, y2, conf, cls = det.tolist()
        boxes.append({
            'x1': round(x1, 2),
            'y1': round(y1, 2),
            'x2': round(x2, 2),
            'y2': round(y2, 2),
            'label': class_names[int(cls)],
            'score': round(conf, 4)
        })
    return boxes


def get_primary_prediction(detections: List[Dict], class_names: Dict[int, str]) -> Tuple[str, float]:
    """
    Get primary tumor type and confidence from detections
    
    Args:
        detections: List of detection dictionaries
        class_names: Dictionary mapping class indices to names
    
    Returns:
        Tuple of (tumor_type, confidence)
    """
    if not detections:
        return "No Tumor", 1.0
    
    # Get detection with highest confidence
    primary_det = max(detections, key=lambda x: x['score'])
    
    # If "No Tumor" has highest confidence, return it
    if primary_det['label'] == "No Tumor":
        return "No Tumor", primary_det['score']
    
    # Filter out "No Tumor" detections and get highest confidence tumor
    tumor_dets = [d for d in detections if d['label'] != "No Tumor"]
    
    if not tumor_dets:
        return "No Tumor", primary_det['score']
    
    primary_tumor = max(tumor_dets, key=lambda x: x['score'])
    return primary_tumor['label'], primary_tumor['score']


def draw_detections(image: np.ndarray, detections: List[Dict], thickness: int = 2) -> np.ndarray:
    """
    Draw bounding boxes and labels on image
    
    Args:
        image: Input image
        detections: List of detection dictionaries
        thickness: Line thickness
    
    Returns:
        Image with drawn detections
    """
    img = image.copy()
    
    # Color map for different tumor types
    color_map = {
        'Glioma': (255, 0, 0),      # Blue
        'Pituitary': (0, 255, 0),   # Green
        'Meningioma': (0, 0, 255),  # Red
        'No Tumor': (128, 128, 128) # Gray
    }
    
    for det in detections:
        x1, y1, x2, y2 = int(det['x1']), int(det['y1']), int(det['x2']), int(det['y2'])
        label = det['label']
        score = det['score']
        color = color_map.get(label, (255, 255, 255))
        
        # Draw bounding box
        cv2.rectangle(img, (x1, y1), (x2, y2), color, thickness)
        
        # Draw label background
        label_text = f"{label}: {score:.2f}"
        (text_width, text_height), baseline = cv2.getTextSize(
            label_text, cv2.FONT_HERSHEY_SIMPLEX, 0.5, thickness
        )
        cv2.rectangle(img, (x1, y1 - text_height - baseline), (x1 + text_width, y1), color, -1)
        
        # Draw label text
        cv2.putText(img, label_text, (x1, y1 - baseline), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), thickness)
    
    return img
