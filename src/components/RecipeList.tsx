import { Link } from 'react-router-dom'
import { Clock, Users, ChefHat, ExternalLink, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

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
}

export default function RecipeList({ recipes, isLoading }: RecipeListProps) {
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

  if (recipes.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      {recipes.map((recipe, index) => (
        <motion.div
          key={recipe.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className="recipe-card p-6 group">
            <div className="flex space-x-6">
              <div className="relative flex-shrink-0">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-32 h-32 object-cover rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
                <div className="absolute top-3 right-3">
                  <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Heart className="h-4 w-4 text-red-400" />
                  </div>
                </div>
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
                      className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Video</span>
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
                  {recipe.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gradient-to-r from-emerald-400 to-teal-500 text-white text-xs font-semibold rounded-full"
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