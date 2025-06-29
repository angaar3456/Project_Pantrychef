import { Link } from 'react-router-dom'
import { Clock, Users, ChefHat, ExternalLink, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'

interface Recipe {
  id: number
  title: string
  image: string
  cookTime: string
  servings: number
  difficulty: string
  description: string
  tags: string[]
  youtubeUrl?: string
}

interface RecipeListProps {
  recipes: Recipe[]
  isLoading: boolean
  activeFilter?: string
}

export default function RecipeList({ recipes, isLoading, activeFilter = 'all' }: RecipeListProps) {
  const [favorites, setFavorites] = useState<number[]>([])

  const filteredRecipes = useMemo(() => {
    if (activeFilter === 'all') return recipes
    
    return recipes.filter(recipe => {
      switch (activeFilter) {
        case 'quick':
          const timeValue = parseInt(recipe.cookTime)
          return timeValue <= 30
        case 'family':
          return recipe.servings >= 4
        case 'vegetarian':
          return recipe.tags.includes('Vegetarian')
        case 'protein':
          return recipe.tags.includes('Protein')
        case 'comfort':
          return recipe.tags.includes('Comfort Food')
        default:
          return true
      }
    })
  }, [recipes, activeFilter])

  const toggleFavorite = (recipeId: number) => {
    setFavorites(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="flex space-x-6">
              <div className="w-32 h-32 bg-gradient-to-r from-purple-200 to-pink-200 rounded-2xl"></div>
              <div className="flex-1 space-y-4">
                <div className="h-6 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg w-3/4"></div>
                <div className="h-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded w-1/2"></div>
                <div className="h-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded w-2/3"></div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full w-16"></div>
                  <div className="h-6 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full w-20"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (filteredRecipes.length === 0 && recipes.length > 0) {
    return (
      <div className="card p-12 text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <ChefHat className="h-10 w-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          No recipes match your filter
        </h3>
        <p className="text-gray-600 font-medium text-lg">
          Try selecting a different filter to see more magical recipes!
        </p>
      </div>
    )
  }

  if (filteredRecipes.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      {filteredRecipes.map((recipe, index) => (
        <motion.div
          key={recipe.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className="recipe-card p-6 group relative">
            <div className="flex space-x-6">
              <div className="relative flex-shrink-0">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-32 h-32 object-cover rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleFavorite(recipe.id)
                  }}
                  className="absolute top-3 right-3 z-20"
                >
                  <div className={`w-8 h-8 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 ${
                    favorites.includes(recipe.id) 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white/90 text-red-400 hover:bg-red-500 hover:text-white'
                  }`}>
                    <Heart className={`h-4 w-4 ${favorites.includes(recipe.id) ? 'fill-current' : ''}`} />
                  </div>
                </button>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300 truncate">
                    {recipe.title}
                  </h3>
                  {recipe.youtubeUrl && (
                    <a
                      href={recipe.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 z-20 relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Watch Tutorial</span>
                    </a>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2 font-medium">
                  {recipe.description}
                </p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                      <Clock className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-medium">{recipe.cookTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                      <Users className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-medium">{recipe.servings} servings</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                      <ChefHat className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-medium">{recipe.difficulty}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {recipe.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gradient-to-r from-emerald-400 to-teal-500 text-white text-xs font-semibold rounded-full shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <Link to={`/recipe/${recipe.id}`} className="absolute inset-0 z-10" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}