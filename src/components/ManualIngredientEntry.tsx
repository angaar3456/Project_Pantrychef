import { useState } from 'react'
import { Plus, X, Search, Sparkles, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ManualIngredientEntryProps {
  onIngredientsSelected: (ingredients: string[]) => void
  onRecipesLoaded: (recipes: any[]) => void
  setIsLoadingRecipes: (loading: boolean) => void
}

export default function ManualIngredientEntry({
  onIngredientsSelected,
  onRecipesLoaded,
  setIsLoadingRecipes
}: ManualIngredientEntryProps) {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const commonIngredients = [
    'tomato', 'onion', 'garlic', 'potato', 'carrot', 'bell pepper',
    'broccoli', 'cheese', 'egg', 'bread', 'apple', 'banana',
    'chicken', 'beef', 'rice', 'pasta', 'spinach', 'mushroom',
    'lemon', 'avocado', 'lettuce', 'cucumber', 'zucchini', 'corn',
    'beans', 'peas', 'cauliflower', 'cabbage', 'celery', 'ginger',
    'basil', 'parsley', 'cilantro', 'thyme', 'oregano', 'rosemary',
    'olive oil', 'butter', 'milk', 'yogurt', 'flour', 'sugar',
    'salt', 'pepper', 'paprika', 'cumin', 'turmeric', 'cinnamon'
  ]

  const filteredIngredients = commonIngredients.filter(ingredient =>
    ingredient.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedIngredients.includes(ingredient)
  )

  const addIngredient = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      const newIngredients = [...selectedIngredients, ingredient]
      setSelectedIngredients(newIngredients)
      setSearchTerm('')
      setShowSuggestions(false)
      onIngredientsSelected(newIngredients)
    }
  }

  const removeIngredient = (ingredient: string) => {
    const newIngredients = selectedIngredients.filter(item => item !== ingredient)
    setSelectedIngredients(newIngredients)
    onIngredientsSelected(newIngredients)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setShowSuggestions(value.length > 0)
  }

  const findRecipes = async () => {
    if (selectedIngredients.length === 0) return

    setIsLoadingRecipes(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
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
        ]
      }

      const matchedRecipes: Array<{name: string, video: string}> = []
      
      selectedIngredients.forEach(ingredient => {
        const recipes = recipeDatabase[ingredient.toLowerCase() as keyof typeof recipeDatabase]
        if (recipes) {
          matchedRecipes.push(...recipes)
        }
      })

      const uniqueRecipes = matchedRecipes.filter((recipe, index, self) => 
        index === self.findIndex(r => r.name === recipe.name)
      ).slice(0, 5)
      
      const detailedRecipes = uniqueRecipes.map((recipe, index) => ({
        id: index + 1,
        title: recipe.name,
        image: getRecipeImage(recipe.name),
        cookTime: getRealisticCookTime(recipe.name),
        servings: getRealisticServings(recipe.name),
        difficulty: getRealisticDifficulty(recipe.name),
        description: `A delicious ${recipe.name.toLowerCase()} recipe made with your selected ingredients.`,
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
      'Pasta Primavera': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Mac and Cheese': 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Grilled Cheese Sandwich': 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Cheese Quesadilla': 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Scrambled Eggs': 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Egg Fried Rice': 'https://images.pexels.com/photos/2456435/pexels-photo-2456435.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Deviled Eggs': 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
    
    return imageMap[recipeName] || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
  }

  const getRealisticCookTime = (recipeName: string) => {
    const cookTimes: { [key: string]: string } = {
      'Scrambled Eggs': '5 minutes',
      'Garlic Bread': '10 minutes',
      'Grilled Cheese Sandwich': '8 minutes',
      'Onion Rings': '15 minutes',
      'Mashed Potatoes': '25 minutes',
      'Tomato Soup': '30 minutes',
      'Roasted Potatoes': '35 minutes',
      'Mac and Cheese': '25 minutes',
      'Fried Rice': '15 minutes',
      'Chicken Stir Fry': '20 minutes',
      'Beef Stir Fry': '18 minutes',
      'Pasta Primavera': '22 minutes',
      'Spaghetti Carbonara': '20 minutes',
      'French Onion Soup': '45 minutes',
      'Roasted Chicken': '60 minutes',
      'Beef Stew': '90 minutes',
      'Potato Gratin': '75 minutes'
    }
    
    return cookTimes[recipeName] || '25 minutes'
  }

  const getRealisticServings = (recipeName: string) => {
    const servings: { [key: string]: number } = {
      'Scrambled Eggs': 2,
      'Garlic Bread': 4,
      'Grilled Cheese Sandwich': 1,
      'Roasted Chicken': 6,
      'Beef Stew': 6,
      'French Onion Soup': 4,
      'Tomato Soup': 4
    }
    
    return servings[recipeName] || 4
  }

  const getRealisticDifficulty = (recipeName: string) => {
    const difficulties: { [key: string]: string } = {
      'Scrambled Eggs': 'Easy',
      'Garlic Bread': 'Easy',
      'Grilled Cheese Sandwich': 'Easy',
      'Mashed Potatoes': 'Easy',
      'Fried Rice': 'Easy',
      'Mac and Cheese': 'Easy',
      'Roasted Potatoes': 'Medium',
      'Tomato Soup': 'Medium',
      'Chicken Stir Fry': 'Medium',
      'Beef Stir Fry': 'Medium',
      'Pasta Primavera': 'Medium',
      'Spaghetti Carbonara': 'Medium',
      'Onion Rings': 'Medium',
      'French Onion Soup': 'Hard',
      'Roasted Chicken': 'Hard',
      'Beef Stew': 'Hard',
      'Potato Gratin': 'Hard'
    }
    
    return difficulties[recipeName] || 'Medium'
  }

  const getRecipeTags = (recipeName: string) => {
    const baseTags = ['Homemade']
    
    const cookTime = getRealisticCookTime(recipeName)
    const timeValue = parseInt(cookTime)
    if (timeValue <= 15) {
      baseTags.push('Quick')
    }
    
    const vegetarianRecipes = [
      'Tomato Basil Pasta', 'Caprese Salad', 'Tomato Soup', 'French Onion Soup',
      'Caramelized Onion Tart', 'Garlic Bread', 'Roasted Potatoes', 'Mashed Potatoes',
      'Potato Gratin', 'Grilled Cheese Sandwich', 'Mac and Cheese', 'Rice Pilaf',
      'Rice Pudding', 'Pasta Primavera'
    ]
    
    if (vegetarianRecipes.includes(recipeName)) {
      baseTags.push('Vegetarian')
    }
    
    if (recipeName.includes('Chicken') || recipeName.includes('Beef') || recipeName.includes('Shrimp') || recipeName.includes('Egg')) {
      baseTags.push('Protein')
    }
    
    if (recipeName.includes('Soup') || recipeName.includes('Stew') || recipeName.includes('Mac and Cheese') || recipeName.includes('Mashed')) {
      baseTags.push('Comfort Food')
    }
    
    return baseTags
  }

  return (
    <div className="card p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
          <Search className="h-4 w-4 text-white" />
        </div>
        <span className="gradient-text">Manual Ingredient Magic</span>
      </h2>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-purple-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setShowSuggestions(searchTerm.length > 0)}
          placeholder="Search for magical ingredients..."
          className="w-full pl-12 pr-4 py-4 input-glass text-lg font-medium placeholder-gray-500"
        />
        
        <AnimatePresence>
          {showSuggestions && filteredIngredients.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 w-full mt-2 glass-card border border-white/30 rounded-2xl shadow-2xl max-h-64 overflow-y-auto"
            >
              {filteredIngredients.slice(0, 8).map((ingredient) => (
                <button
                  key={ingredient}
                  onClick={() => addIngredient(ingredient)}
                  className="w-full px-6 py-4 text-left hover:bg-white/20 transition-all duration-200 capitalize font-medium text-gray-700 hover:text-purple-600 first:rounded-t-2xl last:rounded-b-2xl"
                >
                  {ingredient}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {selectedIngredients.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <span>Selected Magic Ingredients ({selectedIngredients.length})</span>
          </h3>
          <div className="flex flex-wrap gap-3">
            {selectedIngredients.map((ingredient) => (
              <motion.span
                key={ingredient}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-lg"
              >
                <span className="capitalize">{ingredient}</span>
                <button
                  onClick={() => removeIngredient(ingredient)}
                  className="ml-2 hover:text-red-200 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.span>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center space-x-2">
          <Zap className="h-5 w-5 text-orange-500" />
          <span>Quick Add Popular Ingredients</span>
        </h3>
        <div className="flex flex-wrap gap-3">
          {['tomato', 'onion', 'garlic', 'potato', 'chicken', 'cheese', 'egg', 'rice'].map((ingredient) => (
            <button
              key={ingredient}
              onClick={() => addIngredient(ingredient)}
              disabled={selectedIngredients.includes(ingredient)}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white/70 text-gray-700 hover:bg-white hover:text-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed capitalize border border-white/30 hover:border-purple-300"
            >
              <Plus className="h-3 w-3 mr-1" />
              {ingredient}
            </button>
          ))}
        </div>
      </div>

      {selectedIngredients.length > 0 && (
        <button
          onClick={findRecipes}
          className="w-full btn-primary flex items-center justify-center space-x-3 text-lg py-4"
        >
          <Sparkles className="h-5 w-5" />
          <span>Create Magic Recipes ({selectedIngredients.length} ingredients)</span>
          <Zap className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}