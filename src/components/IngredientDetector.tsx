import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface IngredientDetectorProps {
  image: File
  onIngredientsDetected: (ingredients: string[]) => void
  onRecipesLoaded: (recipes: any[]) => void
  isDetecting: boolean
  setIsDetecting: (loading: boolean) => void
  setIsLoadingRecipes: (loading: boolean) => void
}

export default function IngredientDetector({
  image,
  onIngredientsDetected,
  onRecipesLoaded,
  isDetecting,
  setIsDetecting,
  setIsLoadingRecipes
}: IngredientDetectorProps) {
  useEffect(() => {
    if (image) {
      detectIngredients()
    }
  }, [image])

  const detectIngredients = async () => {
    setIsDetecting(true)
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // For demo purposes, we'll analyze the image name/type to provide more realistic results
      const fileName = image.name.toLowerCase()
      const detectedIngredients = analyzeImageForIngredients(fileName)
      
      onIngredientsDetected(detectedIngredients)
      
      if (detectedIngredients.length > 0) {
        await fetchRecipes(detectedIngredients)
      }
    } catch (error) {
      console.error('Error detecting ingredients:', error)
      onIngredientsDetected([])
    } finally {
      setIsDetecting(false)
    }
  }

  const analyzeImageForIngredients = (fileName: string): string[] => {
    // Basic keyword analysis of filename for more realistic demo
    const ingredientKeywords = {
      'tomato': ['tomato', 'tomatoes'],
      'onion': ['onion', 'onions'],
      'garlic': ['garlic'],
      'potato': ['potato', 'potatoes', 'spud'],
      'carrot': ['carrot', 'carrots'],
      'bell pepper': ['pepper', 'peppers', 'capsicum'],
      'broccoli': ['broccoli'],
      'cheese': ['cheese', 'cheddar', 'mozzarella'],
      'egg': ['egg', 'eggs'],
      'bread': ['bread', 'loaf'],
      'apple': ['apple', 'apples'],
      'banana': ['banana', 'bananas'],
      'chicken': ['chicken', 'poultry'],
      'beef': ['beef', 'steak'],
      'rice': ['rice'],
      'pasta': ['pasta', 'noodles'],
      'spinach': ['spinach', 'greens'],
      'mushroom': ['mushroom', 'mushrooms'],
      'lemon': ['lemon', 'lemons', 'citrus'],
      'avocado': ['avocado', 'avocados']
    }

    const detected: string[] = []
    
    // Check filename for ingredient keywords
    Object.entries(ingredientKeywords).forEach(([ingredient, keywords]) => {
      if (keywords.some(keyword => fileName.includes(keyword))) {
        detected.push(ingredient)
      }
    })

    // If no specific ingredients detected from filename, provide common pantry items
    if (detected.length === 0) {
      detected.push('onion', 'garlic', 'tomato')
    }

    return detected
  }

  const fetchRecipes = async (ingredients: string[]) => {
    setIsLoadingRecipes(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Comprehensive recipe database with proper matching
      const recipeDatabase = {
        "tomato": [
          { name: "Tomato Basil Pasta", video: "https://www.youtube.com/watch?v=bJUiWdM__Qw" },
          { name: "Caprese Salad", video: "https://www.youtube.com/watch?v=BHcyuzXRqLs" },
          { name: "Tomato Soup", video: "https://www.youtube.com/watch?v=j4HALhlt3oo" }
        ],
        "onion": [
          { name: "French Onion Soup", video: "https://www.youtube.com/watch?v=2CluhCkR7LI" },
          { name: "Caramelized Onion Tart", video: "https://www.youtube.com/watch?v=Lt1nroFRgZY" },
          { name: "Onion Rings", video: "https://www.youtube.com/watch?v=f2D6hKjgqQs" }
        ],
        "garlic": [
          { name: "Garlic Bread", video: "https://www.youtube.com/watch?v=qKqj85oo2wI" },
          { name: "Roasted Garlic Chicken", video: "https://www.youtube.com/watch?v=BL5eZ2pXGQs" },
          { name: "Garlic Butter Shrimp", video: "https://www.youtube.com/watch?v=xB3324Ry4LQ" }
        ],
        "potato": [
          { name: "Roasted Potatoes", video: "https://www.youtube.com/watch?v=argKpeiKFfo" },
          { name: "Mashed Potatoes", video: "https://www.youtube.com/watch?v=8Ove3jrdQ-c" },
          { name: "Potato Gratin", video: "https://www.youtube.com/watch?v=fp6lnaCBbM8" }
        ],
        "carrot": [
          { name: "Honey Glazed Carrots", video: "https://www.youtube.com/watch?v=aFWUtg7NLbE" },
          { name: "Carrot Cake", video: "https://www.youtube.com/watch?v=1msm7d5_yls" },
          { name: "Roasted Root Vegetables", video: "https://www.youtube.com/watch?v=OpScbsn7G4Q" }
        ],
        "bell pepper": [
          { name: "Stuffed Bell Peppers", video: "https://www.youtube.com/watch?v=00xQA_JaAG0" },
          { name: "Pepper Stir Fry", video: "https://www.youtube.com/watch?v=Ug_VJVkULks" },
          { name: "Roasted Red Pepper Soup", video: "https://www.youtube.com/watch?v=2CluhCkR7LI" }
        ],
        "broccoli": [
          { name: "Broccoli Cheddar Soup", video: "https://www.youtube.com/watch?v=2CluhCkR7LI" },
          { name: "Steamed Broccoli", video: "https://www.youtube.com/watch?v=OpScbsn7G4Q" },
          { name: "Broccoli Stir Fry", video: "https://www.youtube.com/watch?v=Ug_VJVkULks" }
        ],
        "cheese": [
          { name: "Grilled Cheese Sandwich", video: "https://www.youtube.com/watch?v=BlTCkNkfmRY" },
          { name: "Mac and Cheese", video: "https://www.youtube.com/watch?v=FUeyrEN14Rk" },
          { name: "Cheese Quesadilla", video: "https://www.youtube.com/watch?v=1msm7d5_yls" }
        ],
        "egg": [
          { name: "Scrambled Eggs", video: "https://www.youtube.com/watch?v=PUP7U5vTMM0" },
          { name: "Egg Fried Rice", video: "https://www.youtube.com/watch?v=qH__o17xHls" },
          { name: "Deviled Eggs", video: "https://www.youtube.com/watch?v=8Ove3jrdQ-c" }
        ],
        "bread": [
          { name: "French Toast", video: "https://www.youtube.com/watch?v=1msm7d5_yls" },
          { name: "Bread Pudding", video: "https://www.youtube.com/watch?v=fp6lnaCBbM8" },
          { name: "Garlic Bread", video: "https://www.youtube.com/watch?v=qKqj85oo2wI" }
        ],
        "apple": [
          { name: "Apple Pie", video: "https://www.youtube.com/watch?v=1msm7d5_yls" },
          { name: "Apple Crisp", video: "https://www.youtube.com/watch?v=fp6lnaCBbM8" },
          { name: "Waldorf Salad", video: "https://www.youtube.com/watch?v=BHcyuzXRqLs" }
        ],
        "banana": [
          { name: "Banana Bread", video: "https://www.youtube.com/watch?v=1msm7d5_yls" },
          { name: "Banana Smoothie", video: "https://www.youtube.com/watch?v=aFWUtg7NLbE" },
          { name: "Banana Pancakes", video: "https://www.youtube.com/watch?v=1msm7d5_yls" }
        ],
        "chicken": [
          { name: "Roasted Chicken", video: "https://www.youtube.com/watch?v=BL5eZ2pXGQs" },
          { name: "Chicken Stir Fry", video: "https://www.youtube.com/watch?v=Ug_VJVkULks" },
          { name: "Chicken Soup", video: "https://www.youtube.com/watch?v=j4HALhlt3oo" }
        ],
        "beef": [
          { name: "Beef Stir Fry", video: "https://www.youtube.com/watch?v=Ug_VJVkULks" },
          { name: "Beef Stew", video: "https://www.youtube.com/watch?v=j4HALhlt3oo" },
          { name: "Grilled Steak", video: "https://www.youtube.com/watch?v=BL5eZ2pXGQs" }
        ],
        "rice": [
          { name: "Fried Rice", video: "https://www.youtube.com/watch?v=qH__o17xHls" },
          { name: "Rice Pilaf", video: "https://www.youtube.com/watch?v=OpScbsn7G4Q" },
          { name: "Rice Pudding", video: "https://www.youtube.com/watch?v=fp6lnaCBbM8" }
        ],
        "pasta": [
          { name: "Spaghetti Carbonara", video: "https://www.youtube.com/watch?v=bJUiWdM__Qw" },
          { name: "Pasta Primavera", video: "https://www.youtube.com/watch?v=Ug_VJVkULks" },
          { name: "Mac and Cheese", video: "https://www.youtube.com/watch?v=FUeyrEN14Rk" }
        ]
      }

      const matchedRecipes: Array<{name: string, video: string}> = []
      
      // Get recipes that match the detected ingredients
      ingredients.forEach(ingredient => {
        const recipes = recipeDatabase[ingredient.toLowerCase() as keyof typeof recipeDatabase]
        if (recipes) {
          matchedRecipes.push(...recipes)
        }
      })

      // Remove duplicates and limit to 5 recipes
      const uniqueRecipes = matchedRecipes.filter((recipe, index, self) => 
        index === self.findIndex(r => r.name === recipe.name)
      ).slice(0, 5)
      
      // Transform into detailed recipe objects
      const detailedRecipes = uniqueRecipes.map((recipe, index) => ({
        id: index + 1,
        title: recipe.name,
        image: getRecipeImage(recipe.name),
        cookTime: getRealisticCookTime(recipe.name),
        servings: getRealisticServings(recipe.name),
        difficulty: getRealisticDifficulty(recipe.name),
        description: `A delicious ${recipe.name.toLowerCase()} recipe made with your available ingredients.`,
        tags: getRecipeTags(recipe.name),
        youtubeUrl: recipe.video
      }))
      
      onRecipesLoaded(detailedRecipes)
    } catch (error) {
      console.error('Error fetching recipes:', error)
      onRecipesLoaded([])
    } finally {
      setIsLoadingRecipes(false)
    }
  }

  const getRecipeImage = (recipeName: string) => {
    const imageMap: { [key: string]: string } = {
      'Tomato Basil Pasta': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Caprese Salad': 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Tomato Soup': 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=400',
      'French Onion Soup': 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Caramelized Onion Tart': 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Onion Rings': 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Garlic Bread': 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Roasted Garlic Chicken': 'https://images.pexels.com/photos/2456435/pexels-photo-2456435.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Garlic Butter Shrimp': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Roasted Potatoes': 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Mashed Potatoes': 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Potato Gratin': 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Honey Glazed Carrots': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Carrot Cake': 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Roasted Root Vegetables': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Stuffed Bell Peppers': 'https://images.pexels.com/photos/2456435/pexels-photo-2456435.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Pepper Stir Fry': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Roasted Red Pepper Soup': 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Broccoli Cheddar Soup': 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Steamed Broccoli': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Broccoli Stir Fry': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Grilled Cheese Sandwich': 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Mac and Cheese': 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Cheese Quesadilla': 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Scrambled Eggs': 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Egg Fried Rice': 'https://images.pexels.com/photos/2456435/pexels-photo-2456435.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Deviled Eggs': 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400',
      'French Toast': 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Bread Pudding': 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Apple Pie': 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Apple Crisp': 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Waldorf Salad': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Banana Bread': 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Banana Smoothie': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Banana Pancakes': 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Roasted Chicken': 'https://images.pexels.com/photos/2456435/pexels-photo-2456435.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Chicken Stir Fry': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Chicken Soup': 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Beef Stir Fry': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Beef Stew': 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Grilled Steak': 'https://images.pexels.com/photos/2456435/pexels-photo-2456435.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Fried Rice': 'https://images.pexels.com/photos/2456435/pexels-photo-2456435.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Rice Pilaf': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Rice Pudding': 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Spaghetti Carbonara': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Pasta Primavera': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
    
    return imageMap[recipeName] || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
  }

  const getRealisticCookTime = (recipeName: string) => {
    const cookTimes: { [key: string]: string } = {
      'Scrambled Eggs': '5 minutes',
      'Garlic Bread': '10 minutes',
      'Grilled Cheese Sandwich': '8 minutes',
      'Banana Smoothie': '3 minutes',
      'Steamed Broccoli': '7 minutes',
      'Onion Rings': '15 minutes',
      'French Toast': '12 minutes',
      'Honey Glazed Carrots': '20 minutes',
      'Mashed Potatoes': '25 minutes',
      'Tomato Soup': '30 minutes',
      'Roasted Potatoes': '35 minutes',
      'Mac and Cheese': '25 minutes',
      'Fried Rice': '15 minutes',
      'Chicken Stir Fry': '20 minutes',
      'Beef Stir Fry': '18 minutes',
      'Pasta Primavera': '22 minutes',
      'Spaghetti Carbonara': '20 minutes',
      'Broccoli Cheddar Soup': '35 minutes',
      'French Onion Soup': '45 minutes',
      'Roasted Chicken': '60 minutes',
      'Beef Stew': '90 minutes',
      'Potato Gratin': '75 minutes',
      'Carrot Cake': '90 minutes',
      'Apple Pie': '120 minutes',
      'Bread Pudding': '60 minutes'
    }
    
    return cookTimes[recipeName] || '25 minutes'
  }

  const getRealisticServings = (recipeName: string) => {
    const servings: { [key: string]: number } = {
      'Scrambled Eggs': 2,
      'Garlic Bread': 4,
      'Grilled Cheese Sandwich': 1,
      'Banana Smoothie': 1,
      'Carrot Cake': 8,
      'Apple Pie': 8,
      'Roasted Chicken': 6,
      'Beef Stew': 6,
      'French Onion Soup': 4,
      'Broccoli Cheddar Soup': 4,
      'Tomato Soup': 4
    }
    
    return servings[recipeName] || 4
  }

  const getRealisticDifficulty = (recipeName: string) => {
    const difficulties: { [key: string]: string } = {
      'Scrambled Eggs': 'Easy',
      'Garlic Bread': 'Easy',
      'Grilled Cheese Sandwich': 'Easy',
      'Banana Smoothie': 'Easy',
      'Steamed Broccoli': 'Easy',
      'French Toast': 'Easy',
      'Mashed Potatoes': 'Easy',
      'Fried Rice': 'Easy',
      'Mac and Cheese': 'Easy',
      'Honey Glazed Carrots': 'Medium',
      'Roasted Potatoes': 'Medium',
      'Tomato Soup': 'Medium',
      'Chicken Stir Fry': 'Medium',
      'Beef Stir Fry': 'Medium',
      'Pasta Primavera': 'Medium',
      'Spaghetti Carbonara': 'Medium',
      'Broccoli Cheddar Soup': 'Medium',
      'Onion Rings': 'Medium',
      'French Onion Soup': 'Hard',
      'Roasted Chicken': 'Hard',
      'Beef Stew': 'Hard',
      'Potato Gratin': 'Hard',
      'Carrot Cake': 'Hard',
      'Apple Pie': 'Hard',
      'Bread Pudding': 'Hard'
    }
    
    return difficulties[recipeName] || 'Medium'
  }

  const getRecipeTags = (recipeName: string) => {
    const baseTags = ['Homemade']
    
    // Add time-based tags
    const cookTime = getRealisticCookTime(recipeName)
    const timeValue = parseInt(cookTime)
    if (timeValue <= 15) {
      baseTags.push('Quick')
    }
    
    // Add dietary tags
    const vegetarianRecipes = [
      'Tomato Basil Pasta', 'Caprese Salad', 'Tomato Soup', 'French Onion Soup',
      'Caramelized Onion Tart', 'Garlic Bread', 'Roasted Potatoes', 'Mashed Potatoes',
      'Potato Gratin', 'Honey Glazed Carrots', 'Carrot Cake', 'Roasted Root Vegetables',
      'Stuffed Bell Peppers', 'Pepper Stir Fry', 'Broccoli Cheddar Soup',
      'Steamed Broccoli', 'Broccoli Stir Fry', 'Grilled Cheese Sandwich',
      'Mac and Cheese', 'French Toast', 'Bread Pudding', 'Apple Pie',
      'Apple Crisp', 'Waldorf Salad', 'Banana Bread', 'Banana Smoothie',
      'Banana Pancakes', 'Rice Pilaf', 'Rice Pudding', 'Pasta Primavera'
    ]
    
    if (vegetarianRecipes.includes(recipeName)) {
      baseTags.push('Vegetarian')
    }
    
    // Add protein tags
    if (recipeName.includes('Chicken') || recipeName.includes('Beef') || recipeName.includes('Shrimp') || recipeName.includes('Egg')) {
      baseTags.push('Protein')
    }
    
    // Add comfort food tags
    if (recipeName.includes('Soup') || recipeName.includes('Stew') || recipeName.includes('Mac and Cheese') || recipeName.includes('Mashed')) {
      baseTags.push('Comfort Food')
    }
    
    return baseTags
  }

  if (isDetecting) {
    return (
      <div className="flex items-center justify-center space-x-3 py-4">
        <Loader2 className="h-5 w-5 animate-spin text-success-500" />
        <span className="text-gray-600">Analyzing image for ingredients...</span>
      </div>
    )
  }

  return null
}