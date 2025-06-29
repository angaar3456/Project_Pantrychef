import { Link } from 'react-router-dom'
import { Clock, Users, ChefHat } from 'lucide-react'
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
}

interface RecipeListProps {
  recipes: Recipe[]
  isLoading: boolean
}

export default function RecipeList({ recipes, isLoading }: RecipeListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="flex space-x-4">
              <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
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
    <div className="space-y-4">
      {recipes.map((recipe, index) => (
        <motion.div
          key={recipe.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Link to={`/recipe/${recipe.id}`} className="block">
            <div className="recipe-card p-4">
              <div className="flex space-x-4">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                    {recipe.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {recipe.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{recipe.cookTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{recipe.servings} servings</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ChefHat className="h-3 w-3" />
                      <span>{recipe.difficulty}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {recipe.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-success-100 text-success-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}