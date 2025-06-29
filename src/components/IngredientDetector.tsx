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
      // Mock ingredient detection for demo purposes
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate processing time
      
      // Mock detected ingredients based on common food items
      const mockIngredients = [
        'tomato', 'onion', 'garlic', 'potato', 'carrot', 'bell pepper',
        'broccoli', 'cheese', 'egg', 'bread', 'apple', 'banana'
      ]
      
      // Randomly select 3-5 ingredients for demo
      const numIngredients = Math.floor(Math.random() * 3) + 3
      const selectedIngredients = mockIngredients
        .sort(() => 0.5 - Math.random())
        .slice(0, numIngredients)
      
      onIngredientsDetected(selectedIngredients)
      
      if (selectedIngredients.length > 0) {
        await fetchRecipes(selectedIngredients)
      }
    } catch (error) {
      console.error('Error detecting ingredients:', error)
      onIngredientsDetected([])
    } finally {
      setIsDetecting(false)
    }
  }

  const fetchRecipes = async (ingredients: string[]) => {
    setIsLoadingRecipes(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
      
      // Mock recipe suggestions based on detected ingredients
      const recipeDatabase = {
        "tomato": ["Tomato Basil Pasta", "Caprese Salad", "Tomato Soup"],
        "onion": ["French Onion Soup", "Caramelized Onion Tart", "Onion Rings"],
        "garlic": ["Garlic Bread", "Roasted Garlic Chicken", "Garlic Butter Shrimp"],
        "potato": ["Roasted Potatoes", "Mashed Potatoes", "Potato Gratin"],
        "carrot": ["Honey Glazed Carrots", "Carrot Cake", "Roasted Root Vegetables"],
        "bell pepper": ["Stuffed Bell Peppers", "Pepper Stir Fry", "Roasted Red Pepper Soup"],
        "broccoli": ["Broccoli Cheddar Soup", "Steamed Broccoli", "Broccoli Stir Fry"],
        "cheese": ["Grilled Cheese Sandwich", "Mac and Cheese", "Cheese Quesadilla"],
        "egg": ["Scrambled Eggs", "Egg Fried Rice", "Deviled Eggs"],
        "bread": ["French Toast", "Bread Pudding", "Garlic Bread"],
        "apple": ["Apple Pie", "Apple Crisp", "Waldorf Salad"],
        "banana": ["Banana Bread", "Banana Smoothie", "Banana Pancakes"]
      }

      const matchedRecipes: string[] = []
      ingredients.forEach(ingredient => {
        const recipes = recipeDatabase[ingredient.toLowerCase() as keyof typeof recipeDatabase]
        if (recipes) {
          matchedRecipes.push(...recipes)
        }
      })

      // Remove duplicates and limit to 5 recipes
      const uniqueRecipes = [...new Set(matchedRecipes)].slice(0, 5)
      
      // Transform the simple recipe names into more detailed objects
      const detailedRecipes = uniqueRecipes.map((recipeName: string, index: number) => ({
        id: index + 1,
        title: recipeName,
        image: getRecipeImage(recipeName),
        cookTime: getRandomCookTime(),
        servings: Math.floor(Math.random() * 4) + 2,
        difficulty: getRandomDifficulty(),
        description: `A delicious ${recipeName.toLowerCase()} recipe made with your available ingredients.`,
        tags: getRecipeTags(recipeName)
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
    // Map recipe names to appropriate Pexels images
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
      'Banana Pancakes': 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
    
    return imageMap[recipeName] || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
  }

  const getRandomCookTime = () => {
    const times = ['15 minutes', '20 minutes', '25 minutes', '30 minutes', '45 minutes']
    return times[Math.floor(Math.random() * times.length)]
  }

  const getRandomDifficulty = () => {
    const difficulties = ['Easy', 'Medium', 'Easy']
    return difficulties[Math.floor(Math.random() * difficulties.length)]
  }

  const getRecipeTags = (recipeName: string) => {
    const baseTags = ['Quick', 'Homemade']
    if (recipeName.includes('Vegetable') || recipeName.includes('Tomato') || recipeName.includes('Onion') || recipeName.includes('Broccoli')) {
      baseTags.push('Vegetarian')
    }
    if (recipeName.includes('Egg') || recipeName.includes('Cheese') || recipeName.includes('Chicken') || recipeName.includes('Shrimp')) {
      baseTags.push('Protein')
    }
    if (recipeName.includes('Soup') || recipeName.includes('Stir Fry')) {
      baseTags.push('Comfort Food')
    }
    return baseTags
  }

  if (isDetecting) {
    return (
      <div className="flex items-center justify-center space-x-3 py-4">
        <Loader2 className="h-5 w-5 animate-spin text-success-500" />
        <span className="text-gray-600">Detecting ingredients...</span>
      </div>
    )
  }

  return null
}