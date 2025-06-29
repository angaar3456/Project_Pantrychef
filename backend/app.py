from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os
from detect import detect_ingredients
import requests

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///pantrychef.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-string')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)

db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(80), nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    pantry_items = db.relationship('PantryItem', backref='user', lazy=True, cascade='all, delete-orphan')
    favorite_recipes = db.relationship('FavoriteRecipe', backref='user', lazy=True, cascade='all, delete-orphan')
    preferences = db.relationship('UserPreference', backref='user', uselist=False, cascade='all, delete-orphan')

class PantryItem(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.String(50))
    category = db.Column(db.String(50), nullable=False)
    expiry_date = db.Column(db.Date)
    added_date = db.Column(db.DateTime, default=datetime.utcnow)

class FavoriteRecipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    recipe_id = db.Column(db.Integer, nullable=False)
    spoonacular_id = db.Column(db.Integer)
    title = db.Column(db.String(200))
    image_url = db.Column(db.String(500))
    added_date = db.Column(db.DateTime, default=datetime.utcnow)

class UserPreference(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    dietary_restrictions = db.Column(db.Text)  # JSON string
    favorite_cuisines = db.Column(db.Text)     # JSON string
    cooking_skill_level = db.Column(db.String(20))
    max_cooking_time = db.Column(db.Integer)

# Authentication Routes
@app.route('/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        user = User(
            email=data['email'],
            name=data['name'],
            password_hash=generate_password_hash(data['password'])
        )
        
        db.session.add(user)
        db.session.commit()
        
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()
        
        if user and check_password_hash(user.password_hash, data['password']):
            access_token = create_access_token(identity=user.id)
            return jsonify({
                'access_token': access_token,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'name': user.name
                }
            })
        
        return jsonify({'error': 'Invalid credentials'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Ingredient Detection Route
@app.route('/detect', methods=['POST'])
def detect_route():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400

        image = request.files['image']
        ingredients = detect_ingredients(image)

        return jsonify({'ingredients': ingredients})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Recipe Search Route
@app.route('/recipes', methods=['POST'])
def recipe_route():
    try:
        data = request.get_json()
        ingredients = data.get('ingredients', [])
        filters = data.get('filters', {})

        # Try Spoonacular API first
        spoonacular_key = os.getenv('SPOONACULAR_API_KEY')
        if spoonacular_key:
            try:
                recipes = search_spoonacular_recipes(ingredients, filters, spoonacular_key)
                if recipes:
                    return jsonify({'recipes': recipes})
            except Exception as e:
                print(f"Spoonacular API failed: {e}")

        # Fallback to local recipes
        recipes = get_fallback_recipes(ingredients)
        return jsonify({'recipes': recipes})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Pantry Management Routes
@app.route('/pantry', methods=['GET'])
@jwt_required()
def get_pantry():
    try:
        user_id = get_jwt_identity()
        items = PantryItem.query.filter_by(user_id=user_id).all()
        
        return jsonify({
            'items': [{
                'id': item.id,
                'name': item.name,
                'quantity': item.quantity,
                'category': item.category,
                'expiryDate': item.expiry_date.isoformat() if item.expiry_date else None,
                'addedDate': item.added_date.isoformat()
            } for item in items]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/pantry', methods=['POST'])
@jwt_required()
def add_pantry_item():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        import uuid
        item = PantryItem(
            id=str(uuid.uuid4()),
            user_id=user_id,
            name=data['name'],
            quantity=data.get('quantity'),
            category=data['category'],
            expiry_date=datetime.fromisoformat(data['expiryDate']).date() if data.get('expiryDate') else None
        )
        
        db.session.add(item)
        db.session.commit()
        
        return jsonify({
            'item': {
                'id': item.id,
                'name': item.name,
                'quantity': item.quantity,
                'category': item.category,
                'expiryDate': item.expiry_date.isoformat() if item.expiry_date else None,
                'addedDate': item.added_date.isoformat()
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/pantry/<item_id>', methods=['PUT'])
@jwt_required()
def update_pantry_item(item_id):
    try:
        user_id = get_jwt_identity()
        item = PantryItem.query.filter_by(id=item_id, user_id=user_id).first()
        
        if not item:
            return jsonify({'error': 'Item not found'}), 404
        
        data = request.get_json()
        
        if 'name' in data:
            item.name = data['name']
        if 'quantity' in data:
            item.quantity = data['quantity']
        if 'category' in data:
            item.category = data['category']
        if 'expiryDate' in data:
            item.expiry_date = datetime.fromisoformat(data['expiryDate']).date() if data['expiryDate'] else None
        
        db.session.commit()
        
        return jsonify({
            'item': {
                'id': item.id,
                'name': item.name,
                'quantity': item.quantity,
                'category': item.category,
                'expiryDate': item.expiry_date.isoformat() if item.expiry_date else None,
                'addedDate': item.added_date.isoformat()
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/pantry/<item_id>', methods=['DELETE'])
@jwt_required()
def delete_pantry_item(item_id):
    try:
        user_id = get_jwt_identity()
        item = PantryItem.query.filter_by(id=item_id, user_id=user_id).first()
        
        if not item:
            return jsonify({'error': 'Item not found'}), 404
        
        db.session.delete(item)
        db.session.commit()
        
        return jsonify({'message': 'Item deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Favorites Routes
@app.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    try:
        user_id = get_jwt_identity()
        favorites = FavoriteRecipe.query.filter_by(user_id=user_id).all()
        
        return jsonify({
            'recipes': [{
                'id': fav.recipe_id,
                'title': fav.title,
                'image': fav.image_url,
                'spoonacularId': fav.spoonacular_id
            } for fav in favorites]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/favorites', methods=['POST'])
@jwt_required()
def add_favorite():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Check if already favorited
        existing = FavoriteRecipe.query.filter_by(
            user_id=user_id, 
            recipe_id=data['recipeId']
        ).first()
        
        if existing:
            return jsonify({'message': 'Already in favorites'}), 200
        
        favorite = FavoriteRecipe(
            user_id=user_id,
            recipe_id=data['recipeId'],
            spoonacular_id=data.get('spoonacularId'),
            title=data.get('title'),
            image_url=data.get('image')
        )
        
        db.session.add(favorite)
        db.session.commit()
        
        return jsonify({'message': 'Added to favorites'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/favorites/<int:recipe_id>', methods=['DELETE'])
@jwt_required()
def remove_favorite(recipe_id):
    try:
        user_id = get_jwt_identity()
        favorite = FavoriteRecipe.query.filter_by(
            user_id=user_id, 
            recipe_id=recipe_id
        ).first()
        
        if favorite:
            db.session.delete(favorite)
            db.session.commit()
        
        return jsonify({'message': 'Removed from favorites'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Helper Functions
def search_spoonacular_recipes(ingredients, filters, api_key):
    """Search recipes using Spoonacular API"""
    ingredient_string = ','.join(ingredients)
    
    params = {
        'apiKey': api_key,
        'ingredients': ingredient_string,
        'number': 12,
        'ranking': 2,
        'ignorePantry': True,
        **filters
    }
    
    response = requests.get(
        'https://api.spoonacular.com/recipes/findByIngredients',
        params=params,
        timeout=10
    )
    
    if response.status_code != 200:
        raise Exception(f"Spoonacular API error: {response.status_code}")
    
    recipes_data = response.json()
    detailed_recipes = []
    
    for recipe in recipes_data[:8]:
        try:
            # Get detailed recipe information
            detail_response = requests.get(
                f'https://api.spoonacular.com/recipes/{recipe["id"]}/information',
                params={'apiKey': api_key},
                timeout=10
            )
            
            if detail_response.status_code == 200:
                detail = detail_response.json()
                detailed_recipes.append(format_spoonacular_recipe(recipe, detail))
        except Exception as e:
            print(f"Failed to get details for recipe {recipe['id']}: {e}")
            continue
    
    return detailed_recipes

def format_spoonacular_recipe(recipe, detail):
    """Format Spoonacular recipe data"""
    return {
        'id': recipe['id'],
        'title': recipe['title'],
        'image': recipe['image'],
        'cookTime': f"{detail.get('readyInMinutes', 30)} minutes",
        'servings': detail.get('servings', 4),
        'difficulty': get_difficulty_from_time(detail.get('readyInMinutes', 30)),
        'description': clean_html(detail.get('summary', ''))[:150] + '...',
        'ingredients': [ing['original'] for ing in detail.get('extendedIngredients', [])],
        'instructions': [step['step'] for step in detail.get('analyzedInstructions', [{}])[0].get('steps', [])],
        'tags': get_recipe_tags_from_spoonacular(detail),
        'nutrition': extract_nutrition(detail.get('nutrition')),
        'rating': 4.2 + (hash(str(recipe['id'])) % 100) / 100 * 0.6,
        'reviews': 100 + (hash(str(recipe['id'])) % 900),
        'spoonacularId': recipe['id']
    }

def get_difficulty_from_time(minutes):
    """Determine difficulty based on cooking time"""
    if minutes <= 20:
        return 'Easy'
    elif minutes <= 45:
        return 'Medium'
    else:
        return 'Hard'

def clean_html(text):
    """Remove HTML tags from text"""
    import re
    return re.sub('<[^<]+?>', '', text) if text else ''

def get_recipe_tags_from_spoonacular(recipe):
    """Extract tags from Spoonacular recipe data"""
    tags = ['Homemade']
    
    if recipe.get('vegetarian'):
        tags.append('Vegetarian')
    if recipe.get('vegan'):
        tags.append('Vegan')
    if recipe.get('glutenFree'):
        tags.append('Gluten-Free')
    if recipe.get('dairyFree'):
        tags.append('Dairy-Free')
    if recipe.get('readyInMinutes', 30) <= 30:
        tags.append('Quick')
    if recipe.get('healthScore', 0) > 70:
        tags.append('Healthy')
    
    return tags

def extract_nutrition(nutrition_data):
    """Extract nutrition information"""
    if not nutrition_data or 'nutrients' not in nutrition_data:
        return None
    
    nutrients = {n['name']: n['amount'] for n in nutrition_data['nutrients']}
    
    return {
        'calories': round(nutrients.get('Calories', 0)),
        'protein': f"{round(nutrients.get('Protein', 0))}g",
        'carbs': f"{round(nutrients.get('Carbohydrates', 0))}g",
        'fat': f"{round(nutrients.get('Fat', 0))}g",
        'fiber': f"{round(nutrients.get('Fiber', 0))}g"
    }

def get_fallback_recipes(ingredients):
    """Fallback recipe database"""
    recipe_database = [
        {
            'id': 1,
            'title': 'Classic Vegetable Stir Fry',
            'image': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
            'cookTime': '20 minutes',
            'servings': 4,
            'difficulty': 'Easy',
            'description': 'A quick and healthy stir fry using fresh vegetables.',
            'ingredients': ['Mixed vegetables', 'Garlic', 'Ginger', 'Soy sauce'],
            'instructions': [
                'Heat oil in a large wok',
                'Add garlic and ginger',
                'Add vegetables and stir-fry',
                'Add sauce and serve'
            ],
            'tags': ['Vegetarian', 'Quick', 'Healthy'],
            'rating': 4.5,
            'reviews': 234
        },
        {
            'id': 2,
            'title': 'Garlic Herb Roasted Potatoes',
            'image': 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=400',
            'cookTime': '35 minutes',
            'servings': 6,
            'difficulty': 'Easy',
            'description': 'Crispy roasted potatoes with fresh herbs.',
            'ingredients': ['Potatoes', 'Garlic', 'Herbs', 'Olive oil'],
            'instructions': [
                'Preheat oven to 425°F',
                'Cut potatoes into chunks',
                'Toss with oil and seasonings',
                'Roast until golden'
            ],
            'tags': ['Vegetarian', 'Side Dish'],
            'rating': 4.7,
            'reviews': 189
        }
    ]
    
    # Filter recipes based on ingredients
    matching_recipes = []
    for recipe in recipe_database:
        if any(ing.lower() in [i.lower() for i in ingredients] for ing in recipe['ingredients']):
            matching_recipes.append(recipe)
    
    return matching_recipes if matching_recipes else recipe_database

# Initialize database
@app.before_first_request
def create_tables():
    db.create_all()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)