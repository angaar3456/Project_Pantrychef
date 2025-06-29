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
      const formData = new FormData()
      formData.append('image', image)

      const response = await fetch('/api/detect', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to detect ingredients')
      }

      const data = await response.json()
      const ingredients = data.ingredients || []
      
      onIngredientsDetected(ingredients)
      
      if (ingredients.length > 0) {
        await fetchRecipes(ingredients)
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
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch recipes')
      }

      const data = await response.json()
      const recipes = data.recipes || []
      
      // Transform the simple recipe names into more detailed objects
      const detailedRecipes = recipes.map((recipeName: string, index: number) => ({
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
      'Onion Pakoda': 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Onion Soup': 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Tomato Rice': 'https://images.pexels.com/photos/2456435/pexels-photo-2456435.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Tomato Soup': 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Aloo Paratha': 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Masala Fries': 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Garlic Bread': 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Garlic Noodles': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Cheese Sandwich': 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Mac and Cheese': 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Boiled Egg Curry': 'https://images.pexels.com/photos/2456435/pexels-photo-2456435.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Scrambled Eggs': 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Apple Pie': 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Apple Salad': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Bread Pizza': 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
      'French Toast': 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400'
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
    if (recipeName.includes('Vegetable') || recipeName.includes('Tomato') || recipeName.includes('Onion')) {
      baseTags.push('Vegetarian')
    }
    if (recipeName.includes('Egg') || recipeName.includes('Cheese')) {
      baseTags.push('Protein')
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