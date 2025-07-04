import { Filter, Clock, Leaf, Zap, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

interface RecipeFiltersProps {
  activeFilters: {
    cuisine?: string
    diet?: string
    maxTime?: number
    difficulty?: string
  }
  onFiltersChange: (filters: any) => void
  recipeCount: number
}

export default function RecipeFilters({
  activeFilters,
  onFiltersChange,
  recipeCount
}: RecipeFiltersProps) {
  const cuisines = [
    { id: '', label: 'All Cuisines' },
    { id: 'italian', label: 'Italian' },
    { id: 'asian', label: 'Asian' },
    { id: 'mexican', label: 'Mexican' },
    { id: 'indian', label: 'Indian' },
    { id: 'mediterranean', label: 'Mediterranean' },
    { id: 'american', label: 'American' }
  ]

  const diets = [
    { id: '', label: 'All Diets', icon: Heart },
    { id: 'vegetarian', label: 'Vegetarian', icon: Leaf },
    { id: 'vegan', label: 'Vegan', icon: Leaf },
    { id: 'gluten-free', label: 'Gluten-Free', icon: Zap },
    { id: 'dairy-free', label: 'Dairy-Free', icon: Zap },
    { id: 'keto', label: 'Keto', icon: Zap }
  ]

  const timeOptions = [
    { value: undefined, label: 'Any Time', icon: Clock },
    { value: 15, label: '15 min', icon: Clock },
    { value: 30, label: '30 min', icon: Clock },
    { value: 60, label: '1 hour', icon: Clock }
  ]

  const difficulties = [
    { id: '', label: 'All Levels' },
    { id: 'easy', label: 'Easy' },
    { id: 'medium', label: 'Medium' },
    { id: 'hard', label: 'Hard' }
  ]

  const updateFilter = (key: string, value: any) => {
    onFiltersChange({
      ...activeFilters,
      [key]: value === activeFilters[key as keyof typeof activeFilters] ? undefined : value
    })
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold gradient-text flex items-center space-x-2">
          <Filter className="h-5 w-5" />
          <span>Filter Recipes</span>
        </h3>
        <span className="text-sm text-gray-600 bg-white/50 px-3 py-1 rounded-full">
          {recipeCount} recipes found
        </span>
      </div>

      <div className="space-y-6">
        {/* Cuisine Filter */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Cuisine</h4>
          <div className="flex flex-wrap gap-2">
            {cuisines.map((cuisine) => (
              <button
                key={cuisine.id}
                onClick={() => updateFilter('cuisine', cuisine.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilters.cuisine === cuisine.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white/70 text-gray-600 hover:bg-white hover:text-purple-600 border border-white/30'
                }`}
              >
                {cuisine.label}
              </button>
            ))}
          </div>
        </div>

        {/* Diet Filter */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Dietary Preferences</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {diets.map((diet) => (
              <motion.button
                key={diet.id}
                onClick={() => updateFilter('diet', diet.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center space-x-2 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  activeFilters.diet === diet.id
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                    : 'bg-white/70 text-gray-600 hover:bg-white hover:text-emerald-600 border border-white/30'
                }`}
              >
                <diet.icon className="h-4 w-4" />
                <span>{diet.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Time Filter */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Cooking Time</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {timeOptions.map((option) => (
              <motion.button
                key={option.label}
                onClick={() => updateFilter('maxTime', option.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center space-x-2 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  activeFilters.maxTime === option.value
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'bg-white/70 text-gray-600 hover:bg-white hover:text-blue-600 border border-white/30'
                }`}
              >
                <option.icon className="h-4 w-4" />
                <span>{option.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Difficulty Level</h4>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty.id}
                onClick={() => updateFilter('difficulty', difficulty.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilters.difficulty === difficulty.id
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                    : 'bg-white/70 text-gray-600 hover:bg-white hover:text-orange-600 border border-white/30'
                }`}
              >
                {difficulty.label}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        {Object.values(activeFilters).some(Boolean) && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onFiltersChange({})}
            className="w-full btn-secondary text-sm py-3"
          >
            Clear All Filters
          </motion.button>
        )}
      </div>
    </div>
  )
}