from flask import Flask, request, jsonify
from flask_cors import CORS
from detect import detect_ingredients

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from frontend

@app.route('/detect', methods=['POST'])
def detect_route():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    image = request.files['image']
    ingredients = detect_ingredients(image)

    return jsonify({'ingredients': ingredients})

@app.route('/recipes', methods=['POST'])
def recipe_route():
    data = request.get_json()
    ingredients = data.get('ingredients', [])

    # Sample logic: static recipe suggestions
    sample_recipes = {
        "onion": ["Onion Pakoda", "Onion Soup"],
        "tomato": ["Tomato Rice", "Tomato Soup"],
        "potato": ["Aloo Paratha", "Masala Fries"],
        "garlic": ["Garlic Bread", "Garlic Noodles"],
        "cheese": ["Cheese Sandwich", "Mac and Cheese"],
        "egg": ["Boiled Egg Curry", "Scrambled Eggs"],
        "apple": ["Apple Pie", "Apple Salad"],
        "bread": ["Bread Pizza", "French Toast"],
    }

    matched = []
    for ing in ingredients:
        matched.extend(sample_recipes.get(ing.lower(), []))

    return jsonify({'recipes': list(set(matched))[:5]})  # return top 5 unique

if __name__ == '__main__':
    app.run(debug=True)
