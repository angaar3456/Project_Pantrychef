from ultralytics import YOLO
import cv2
import numpy as np
from PIL import Image
import io

# Load a pretrained YOLOv8 model (or replace 'yolov8n.pt' with 'best.pt' if you trained a custom model)
model = YOLO("yolov8n.pt")

def detect_ingredients(image_file):
    # Read image file from Flask
    image_bytes = image_file.read()
    np_img = np.array(Image.open(io.BytesIO(image_bytes)).convert("RGB"))
    
    # Run detection
    results = model.predict(np_img, conf=0.4)
    
    # Extract detected ingredient labels
    labels = results[0].names
    classes = results[0].boxes.cls.cpu().numpy().astype(int)
    detected = [labels[i] for i in classes]

    # Remove duplicates and sort
    unique_detected = sorted(list(set(detected)))

    return unique_detected
