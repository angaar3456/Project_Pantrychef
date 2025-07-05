import { useState } from 'react'
import { Camera, Search, Package, Heart, Sparkles, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import ImageUpload from '../components/ImageUpload'
import IngredientList from '../components/IngredientList'
import ManualIngredientEntry from '../components/ManualIngredientEntry'
import RecipeList from '../components/RecipeList'
import RecipeFilters from '../components/RecipeFilters'
import PantryManager from '../components/PantryManager'
import { useAuth } from '../contexts/AuthContext'
import { detectIngredients, searchRecipes, DetectedIngredient, Recipe } from '../services/api'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'detect' | 'manual' | 'pantry'>('detect')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [detectedIngredients, setDetectedIngredients] = useState<DetectedIngredient[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isDetecting, setIsDetecting] = useState(false)
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false)
  const [recipeFilters, setRecipeFilters] = useState({})

  const handleImageSelect = async (file: File) => {
    setSelectedImage(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    
    // Auto-detect ingredients
    setIsDetecting(true)
    try {
      const ingredients = await detectIngredients(file)
      setDetectedIngredients(ingredients)
      toast.success(`Detected ${ingredients.length} ingredients!`)
    } catch (error) {
      toast.error('Failed to detect ingredients')
    } finally {
      setIsDetecting(false)
    }
  }

  const handleClearImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setDetectedIngredients([])
    setRecipes([])
  }

  const handleIngredientsConfirm = async () => {
    if (detectedIngredients.length === 0) return

    setIsLoadingRecipes(true)
    try {
      const ingredientNames = detectedIngredients.map(ing => ing.name)
      const foundRecipes = await searchRecipes(ingredientNames, recipeFilters)
      setRecipes(foundRecipes)
      toast.success(`Found ${foundRecipes.length} recipes!`)
    } catch (error) {
      toast.error('Failed to find recipes')
    } finally {
      setIsLoadingRecipes(false)
    }
  }

  const handleManualIngredientsSelected = async (ingredients: string[]) => {
    const detectedIngs: DetectedIngredient[] = ingredients.map(name => ({
      name,
      confidence: 1.0,
      category: 'Manual'
    }))
    setDetectedIngredients(detectedIngs)
    
    setIsLoadingRecipes(true)
    try {
      const foundRecipes = await searchRecipes(ingredients, recipeFilters)
      setRecipes(foundRecipes)
      toast.success(`Found ${foundRecipes.length} recipes!`)
    } catch (error) {
      toast.error('Failed to find recipes')
    } finally {
      setIsLoadingRecipes(false)
    }
  }

  const handleTabSwitch = (tab: 'detect' | 'manual' | 'pantry') => {
    setActiveTab(tab)
    if (tab !== 'detect') {
      handleClearImage()
    }
    if (tab !== 'manual') {
      setDetectedIngredients([])
      setRecipes([])
    }
  }

  return (
    <div className="min-h-screen py-8 relative">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(17, 24, 39, 0.9)',
            color: '#fff',
            border: '1px solid rgba(75, 85, 99, 0.3)',
            backdropFilter: 'blur(16px)',
          },
        }}
      />
      
      {/* Floating background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full morphing-blob floating-element"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full morphing-blob floating-element" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-r from-pink-500/10 to-cyan-500/10 rounded-full morphing-blob floating-element" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 slide-in-bottom"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl pulsing-glow rotating-element">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center floating-element">
                <Zap className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
            Welcome back, {user?.name}! ✨
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-medium">
            Ready to create some culinary magic? Choose how you'd like to discover amazing recipes today!
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-2 mb-8 slide-in-bottom"
        >
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleTabSwitch('detect')}
              className={`flex items-center justify-center space-x-3 py-4 px-6 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 ${
                activeTab === 'detect' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              <Camera className="h-5 w-5" />
              <span className="hidden sm:inline">AI Detection</span>
              <span className="sm:hidden">Detect</span>
            </button>
            <button
              onClick={() => handleTabSwitch('manual')}
              className={`flex items-center justify-center space-x-3 py-4 px-6 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 ${
                activeTab === 'manual' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              <Search className="h-5 w-5" />
              <span className="hidden sm:inline">Manual Entry</span>
              <span className="sm:hidden">Manual</span>
            </button>
            <button
              onClick={() => handleTabSwitch('pantry')}
              className={`flex items-center justify-center space-x-3 py-4 px-6 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 ${
                activeTab === 'pantry' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              <Package className="h-5 w-5" />
              <span className="hidden sm:inline">My Pantry</span>
              <span className="sm:hidden">Pantry</span>
            </button>
          </div>
        </motion.div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            {/* AI Detection Tab */}
            {activeTab === 'detect' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-8 slide-in-left"
              >
                <div className="card p-8 card-hover-effect">
                  <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center pulsing-glow">
                      <Camera className="h-4 w-4 text-white" />
                    </div>
                    <span className="gradient-text">AI Magic Detection</span>
                  </h2>

                  <ImageUpload
                    onImageSelect={handleImageSelect}
                    onClear={handleClearImage}
                    selectedImage={selectedImage}
                    imagePreview={imagePreview}
                    isProcessing={isDetecting}
                  />
                </div>

                {detectedIngredients.length > 0 && (
                  <IngredientList
                    ingredients={detectedIngredients}
                    onIngredientsChange={setDetectedIngredients}
                    onConfirm={handleIngredientsConfirm}
                    isLoading={isLoadingRecipes}
                  />
                )}
              </motion.div>
            )}

            {/* Manual Entry Tab */}
            {activeTab === 'manual' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="slide-in-left"
              >
                <ManualIngredientEntry
                  onIngredientsSelected={handleManualIngredientsSelected}
                  onRecipesLoaded={setRecipes}
                  setIsLoadingRecipes={setIsLoadingRecipes}
                />
              </motion.div>
            )}

            {/* Pantry Tab */}
            {activeTab === 'pantry' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="slide-in-left"
              >
                <PantryManager />
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recipe Filters */}
            {(activeTab === 'detect' || activeTab === 'manual') && recipes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="slide-in-right"
              >
                <RecipeFilters
                  activeFilters={recipeFilters}
                  onFiltersChange={setRecipeFilters}
                  recipeCount={recipes.length}
                />
              </motion.div>
            )}

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="glass-card p-6 card-hover-effect slide-in-right"
            >
              <h3 className="text-lg font-bold gradient-text mb-4 flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center pulsing-glow">
                  <Heart className="h-3 w-3 text-white" />
                </div>
                <span>Your Kitchen Stats</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Recipes Found Today</span>
                  <span className="font-bold text-cyan-400">{recipes.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Ingredients Detected</span>
                  <span className="font-bold text-purple-400">{detectedIngredients.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Active Filters</span>
                  <span className="font-bold text-pink-400">
                    {Object.values(recipeFilters).filter(Boolean).length}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Recipe Results */}
        {(activeTab === 'detect' || activeTab === 'manual') && (
          <div className="mt-12">
            {recipes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="slide-in-bottom"
              >
                <h2 className="text-3xl font-bold gradient-text mb-8 text-center">
                  ✨ Your Magic Recipes ({recipes.length})
                </h2>
                <RecipeList 
                  recipes={recipes} 
                  isLoading={isLoadingRecipes}
                />
              </motion.div>
            )}

            {recipes.length === 0 && detectedIngredients.length > 0 && !isLoadingRecipes && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-12 text-center card-hover-effect slide-in-bottom"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-gray-600 to-gray-700 rounded-3xl flex items-center justify-center mx-auto mb-6 pulsing-glow">
                  <Search className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-100 mb-4">
                  No recipes found
                </h3>
                <p className="text-gray-400 font-medium text-lg">
                  Try adjusting your filters or adding more common ingredients to discover amazing recipes!
                </p>
              </motion.div>
            )}

            {recipes.length === 0 && detectedIngredients.length === 0 && activeTab !== 'pantry' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-12 text-center card-hover-effect slide-in-bottom"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 pulsing-glow floating-element">
                  {activeTab === 'detect' ? (
                    <Camera className="h-10 w-10 text-white" />
                  ) : (
                    <Search className="h-10 w-10 text-white" />
                  )}
                </div>
                <h3 className="text-2xl font-bold gradient-text mb-4">
                  Ready to create culinary magic? ✨
                </h3>
                <p className="text-gray-300 font-medium text-lg leading-relaxed">
                  {activeTab === 'detect' 
                    ? 'Upload a photo of your ingredients and watch our AI work its magic to create personalized recipe recommendations just for you!'
                    : 'Search and select your available ingredients to discover amazing recipes tailored to what you have in your kitchen right now!'
                  }
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}