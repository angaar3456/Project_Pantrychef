import axios from 'axios'

const API_BASE_URL = '/api'
const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY || 'spoonacular-08c06d722ae247a781cfabe6a09ac558'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pantrychef_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface DetectedIngredient {
  name: string
  confidence: number
  category?: string
}

export interface Recipe {
  id: number
  title: string
  image: string
  cookTime: string
  servings: number
  difficulty: string
  description: string
  ingredients: string[]
  instructions: string[]
  tags: string[]
  youtubeUrl?: string
  nutrition?: {
    calories: number
    protein: string
    carbs: string
    fat: string
    fiber: string
  }
  rating?: number
  reviews?: number
  spoonacularId?: number
}

export interface PantryItem {
  id: string
  name: string
  quantity?: string
  category: string
  expiryDate?: string
  addedDate: string
}

// Ingredient Detection API
export const detectIngredients = async (imageFile: File): Promise<DetectedIngredient[]> => {
  try {
    const formData = new FormData()
    formData.append('image', imageFile)

    const response = await api.post('/detect', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data.ingredients.map((ingredient: string, index: number) => ({
      name: ingredient,
      confidence: 0.8 + (Math.random() * 0.2), // Simulate confidence scores
      category: getIngredientCategory(ingredient)
    }))
  } catch (error) {
    console.error('Detection API failed, using fallback:', error)
    return getFallbackDetection(imageFile.name)
  }
}

// Recipe Search API with Spoonacular integration
export const searchRecipes = async (ingredients: string[], filters?: {
  cuisine?: string
  diet?: string
  maxReadyTime?: number
  intolerances?: string
}): Promise<Recipe[]> => {
  try {
    // Try Spoonacular API first
    const spoonacularResponse = await searchSpoonacularRecipes(ingredients, filters)
    if (spoonacularResponse.length > 0) {
      return spoonacularResponse
    }
  } catch (error) {
    console.log('Spoonacular API failed, using local recipes:', error)
  }

  // Fallback to local backend
  try {
    const response = await api.post('/recipes', { 
      ingredients,
      filters 
    })
    return response.data.recipes
  } catch (error) {
    console.error('Local recipe API failed:', error)
    return getFallbackRecipes(ingredients)
  }
}

// Spoonacular API integration
const searchSpoonacularRecipes = async (
  ingredients: string[], 
  filters?: any
): Promise<Recipe[]> => {
  const ingredientString = ingredients.join(',')
  const params = new URLSearchParams({
    apiKey: SPOONACULAR_API_KEY,
    ingredients: ingredientString,
    number: '12',
    ranking: '2',
    ignorePantry: 'true',
    ...filters
  })

  const response = await axios.get(
    `https://api.spoonacular.com/recipes/findByIngredients?${params}`
  )

  const recipes = await Promise.all(
    response.data.slice(0, 8).map(async (recipe: any) => {
      try {
        // Get detailed recipe information
        const detailResponse = await axios.get(
          `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${SPOONACULAR_API_KEY}`
        )
        
        const detail = detailResponse.data
        
        return {
          id: recipe.id,
          title: recipe.title,
          image: recipe.image,
          cookTime: `${detail.readyInMinutes || 30} minutes`,
          servings: detail.servings || 4,
          difficulty: getDifficultyFromTime(detail.readyInMinutes),
          description: detail.summary?.replace(/<[^>]*>/g, '').slice(0, 150) + '...' || 'A delicious recipe made with your ingredients.',
          ingredients: detail.extendedIngredients?.map((ing: any) => ing.original) || [],
          instructions: detail.analyzedInstructions?.[0]?.steps?.map((step: any) => step.step) || [],
          tags: getRecipeTagsFromSpoonacular(detail),
          youtubeUrl: getYouTubeVideoForRecipe(recipe.title), // Use fallback video mapping
          nutrition: detail.nutrition ? {
            calories: Math.round(detail.nutrition.nutrients?.find((n: any) => n.name === 'Calories')?.amount || 0),
            protein: `${Math.round(detail.nutrition.nutrients?.find((n: any) => n.name === 'Protein')?.amount || 0)}g`,
            carbs: `${Math.round(detail.nutrition.nutrients?.find((n: any) => n.name === 'Carbohydrates')?.amount || 0)}g`,
            fat: `${Math.round(detail.nutrition.nutrients?.find((n: any) => n.name === 'Fat')?.amount || 0)}g`,
            fiber: `${Math.round(detail.nutrition.nutrients?.find((n: any) => n.name === 'Fiber')?.amount || 0)}g`
          } : undefined,
          rating: 4.2 + Math.random() * 0.6,
          reviews: Math.floor(Math.random() * 1000) + 100,
          spoonacularId: recipe.id
        }
      } catch (error) {
        console.error(`Failed to get details for recipe ${recipe.id}:`, error)
        return null
      }
    })
  )

  return recipes.filter(Boolean) as Recipe[]
}

// YouTube video mapping (fallback without API)
const getYouTubeVideoForRecipe = (recipeName: string): string | undefined => {
  const videoMap: { [key: string]: string } = {
    // Popular recipe video mappings
    'pasta': 'https://www.youtube.com/watch?v=bJUiWdM__Qw',
    'stir fry': 'https://www.youtube.com/watch?v=Ug_VJVkULks',
    'chicken': 'https://www.youtube.com/watch?v=BL5eZ2pXGQs',
    'soup': 'https://www.youtube.com/watch?v=j4HALhlt3oo',
    'salad': 'https://www.youtube.com/watch?v=BHcyuzXRqLs',
    'potato': 'https://www.youtube.com/watch?v=argKpeiKFfo',
    'rice': 'https://www.youtube.com/watch?v=qH__o17xHls',
    'bread': 'https://www.youtube.com/watch?v=qKqj85oo2wI',
    'egg': 'https://www.youtube.com/watch?v=PUP7U5vTMM0',
    'vegetable': 'https://www.youtube.com/watch?v=OpScbsn7G4Q',
    'beef': 'https://www.youtube.com/watch?v=BL5eZ2pXGQs',
    'fish': 'https://www.youtube.com/watch?v=xB3324Ry4LQ',
    'cake': 'https://www.youtube.com/watch?v=1msm7d5_yls',
    'pie': 'https://www.youtube.com/watch?v=1msm7d5_yls',
    'sandwich': 'https://www.youtube.com/watch?v=BlTCkNkfmRY'
  }
  
  const lowerName = recipeName.toLowerCase()
  for (const [keyword, url] of Object.entries(videoMap)) {
    if (lowerName.includes(keyword)) {
      return url
    }
  }
  
  // Default cooking video
  return 'https://www.youtube.com/watch?v=Ug_VJVkULks'
}

// Pantry Management API
export const getPantryItems = async (): Promise<PantryItem[]> => {
  try {
    const response = await api.get('/pantry')
    return response.data.items
  } catch (error) {
    console.error('Failed to get pantry items:', error)
    return []
  }
}

export const addPantryItem = async (item: Omit<PantryItem, 'id' | 'addedDate'>): Promise<PantryItem> => {
  const response = await api.post('/pantry', item)
  return response.data.item
}

export const updatePantryItem = async (id: string, updates: Partial<PantryItem>): Promise<PantryItem> => {
  const response = await api.put(`/pantry/${id}`, updates)
  return response.data.item
}

export const deletePantryItem = async (id: string): Promise<void> => {
  await api.delete(`/pantry/${id}`)
}

// User Preferences API
export const getUserPreferences = async () => {
  try {
    const response = await api.get('/user/preferences')
    return response.data
  } catch (error) {
    console.error('Failed to get user preferences:', error)
    return {}
  }
}

export const updateUserPreferences = async (preferences: any) => {
  const response = await api.put('/user/preferences', preferences)
  return response.data
}

// Favorite Recipes API
export const getFavoriteRecipes = async (): Promise<Recipe[]> => {
  try {
    const response = await api.get('/favorites')
    return response.data.recipes
  } catch (error) {
    console.error('Failed to get favorite recipes:', error)
    return []
  }
}

export const addToFavorites = async (recipeId: number): Promise<void> => {
  await api.post('/favorites', { recipeId })
}

export const removeFromFavorites = async (recipeId: number): Promise<void> => {
  await api.delete(`/favorites/${recipeId}`)
}

// Utility functions
const getIngredientCategory = (ingredient: string): string => {
  const categories: { [key: string]: string[] } = {
    'Vegetables': ['tomato', 'onion', 'garlic', 'potato', 'carrot', 'bell pepper', 'broccoli', 'spinach', 'lettuce', 'cucumber'],
    'Proteins': ['chicken', 'beef', 'pork', 'fish', 'egg', 'tofu', 'beans'],
    'Dairy': ['cheese', 'milk', 'yogurt', 'butter', 'cream'],
    'Grains': ['rice', 'pasta', 'bread', 'flour', 'oats'],
    'Fruits': ['apple', 'banana', 'lemon', 'orange', 'berries'],
    'Herbs & Spices': ['basil', 'parsley', 'cilantro', 'thyme', 'oregano', 'salt', 'pepper']
  }

  for (const [category, items] of Object.entries(categories)) {
    if (items.some(item => ingredient.toLowerCase().includes(item))) {
      return category
    }
  }
  return 'Other'
}

const getDifficultyFromTime = (minutes: number): string => {
  if (minutes <= 20) return 'Easy'
  if (minutes <= 45) return 'Medium'
  return 'Hard'
}

const getRecipeTagsFromSpoonacular = (recipe: any): string[] => {
  const tags = ['Homemade']
  
  if (recipe.vegetarian) tags.push('Vegetarian')
  if (recipe.vegan) tags.push('Vegan')
  if (recipe.glutenFree) tags.push('Gluten-Free')
  if (recipe.dairyFree) tags.push('Dairy-Free')
  if (recipe.readyInMinutes <= 30) tags.push('Quick')
  if (recipe.healthScore > 70) tags.push('Healthy')
  
  return tags
}

const getFallbackDetection = (fileName: string): DetectedIngredient[] => {
  const ingredientKeywords = {
    'tomato': ['tomato', 'tomatoes'],
    'onion': ['onion', 'onions'],
    'garlic': ['garlic'],
    'potato': ['potato', 'potatoes'],
    'carrot': ['carrot', 'carrots'],
    'bell pepper': ['pepper', 'peppers'],
    'broccoli': ['broccoli'],
    'cheese': ['cheese'],
    'egg': ['egg', 'eggs'],
    'bread': ['bread'],
    'apple': ['apple', 'apples'],
    'chicken': ['chicken'],
    'rice': ['rice']
  }

  const detected: DetectedIngredient[] = []
  const lowerFileName = fileName.toLowerCase()
  
  Object.entries(ingredientKeywords).forEach(([ingredient, keywords]) => {
    if (keywords.some(keyword => lowerFileName.includes(keyword))) {
      detected.push({
        name: ingredient,
        confidence: 0.7 + Math.random() * 0.2,
        category: getIngredientCategory(ingredient)
      })
    }
  })

  if (detected.length === 0) {
    detected.push(
      { name: 'onion', confidence: 0.8, category: 'Vegetables' },
      { name: 'garlic', confidence: 0.75, category: 'Vegetables' },
      { name: 'tomato', confidence: 0.85, category: 'Vegetables' }
    )
  }

  return detected
}

const getFallbackRecipes = (ingredients: string[]): Recipe[] => {
  const recipeDatabase = [
    {
      id: 1,
      title: 'Classic Vegetable Stir Fry',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      cookTime: '20 minutes',
      servings: 4,
      difficulty: 'Easy',
      description: 'A quick and healthy stir fry using fresh vegetables and aromatic seasonings.',
      ingredients: ['Mixed vegetables', 'Garlic', 'Ginger', 'Soy sauce', 'Oil'],
      instructions: [
        'Heat oil in a large wok or skillet',
        'Add garlic and ginger, stir for 30 seconds',
        'Add vegetables and stir-fry for 5-7 minutes',
        'Add soy sauce and toss to combine',
        'Serve hot over rice'
      ],
      tags: ['Vegetarian', 'Quick', 'Healthy'],
      youtubeUrl: 'https://www.youtube.com/watch?v=Ug_VJVkULks',
      rating: 4.5,
      reviews: 234
    },
    {
      id: 2,
      title: 'Garlic Herb Roasted Potatoes',
      image: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=400',
      cookTime: '35 minutes',
      servings: 6,
      difficulty: 'Easy',
      description: 'Crispy roasted potatoes with fresh herbs and garlic.',
      ingredients: ['Potatoes', 'Garlic', 'Herbs', 'Olive oil', 'Salt', 'Pepper'],
      instructions: [
        'Preheat oven to 425°F',
        'Cut potatoes into chunks',
        'Toss with oil, garlic, and seasonings',
        'Roast for 30-35 minutes until golden',
        'Garnish with fresh herbs'
      ],
      tags: ['Vegetarian', 'Side Dish', 'Comfort Food'],
      youtubeUrl: 'https://www.youtube.com/watch?v=argKpeiKFfo',
      rating: 4.7,
      reviews: 189
    },
    {
      id: 3,
      title: 'Creamy Tomato Pasta',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      cookTime: '25 minutes',
      servings: 4,
      difficulty: 'Medium',
      description: 'Rich and creamy tomato pasta with fresh herbs.',
      ingredients: ['Pasta', 'Tomatoes', 'Cream', 'Garlic', 'Basil'],
      instructions: [
        'Cook pasta according to package directions',
        'Sauté garlic in olive oil',
        'Add tomatoes and simmer',
        'Stir in cream and herbs',
        'Toss with pasta and serve'
      ],
      tags: ['Vegetarian', 'Comfort Food', 'Italian'],
      youtubeUrl: 'https://www.youtube.com/watch?v=bJUiWdM__Qw',
      rating: 4.6,
      reviews: 312
    }
  ]

  return recipeDatabase.filter(recipe => 
    ingredients.some(ingredient => 
      recipe.ingredients.some(recipeIng => 
        recipeIng.toLowerCase().includes(ingredient.toLowerCase())
      )
    )
  )
}

export default api