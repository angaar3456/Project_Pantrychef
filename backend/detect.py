import cv2
import numpy as np
from PIL import Image
import io

def detect_ingredients(image_file):
    """
    Simple ingredient detection function.
    In a real implementation, this would use a trained model.
    For now, we'll return some common ingredients as a fallback.
    """
    try:
        # Read the image
        image_bytes = image_file.read()
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert PIL image to OpenCV format
        opencv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Simple color-based detection (placeholder logic)
        # In reality, you'd use a trained YOLO model or similar
        detected_ingredients = []
        
        # Analyze image colors to guess ingredients
        avg_color = np.mean(opencv_image, axis=(0, 1))
        
        # Simple heuristics based on color
        if avg_color[2] > 100:  # Red channel
            detected_ingredients.extend(['tomato', 'apple', 'red pepper'])
        if avg_color[1] > 100:  # Green channel
            detected_ingredients.extend(['lettuce', 'cucumber', 'green pepper'])
        if avg_color[0] > 80:   # Blue channel (less common in food)
            detected_ingredients.extend(['blueberry'])
        
        # Add some common ingredients as fallback
        common_ingredients = ['onion', 'garlic', 'potato', 'carrot']
        detected_ingredients.extend(common_ingredients)
        
        # Remove duplicates and limit to 5 ingredients
        unique_ingredients = list(set(detected_ingredients))[:5]
        
        return unique_ingredients if unique_ingredients else ['onion', 'garlic', 'tomato']
        
    except Exception as e:
        print(f"Detection error: {e}")
        # Return fallback ingredients
        return ['onion', 'garlic', 'tomato', 'potato', 'carrot']