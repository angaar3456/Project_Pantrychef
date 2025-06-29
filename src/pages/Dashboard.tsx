import React, { useState } from 'react'
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
    <div className="min-h-screen py-8">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl float-animation">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <Zap className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
            Welcome back, {user?.name}! ✨
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
            Ready to create some culinary magic? Choose how you'd like to discover amazing recipes today!
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-2 mb-8"
        >
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleTabSwitch('detect')}
              className={`flex items-center justify-center space-x-3 py-4 px-6 rounded-2xl font-semibold transition-all duration-300 ${
                activeTab === 'detect' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              <Camera className="h-5 w-5" />
              <span className="hidden sm:inline">AI Detection</span>
              <span className="sm:hidden">Detect</span>
            </button>
            <button
              onClick={() => handleTabSwitch('manual')}
              className={`flex items-center justify-center space-x-3 py-4 px-6 rounded-2xl font-semibold transition-all duration-300 ${
                activeTab === 'manual' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              <Search className="h-5 w-5" />
              <span className="hidden sm:inline">Manual Entry</span>
              <span className="sm:hidden">Manual</span>
            </button>
            <button
              onClick={() => handleTabSwitch('pantry')}
              className={`flex items-center justify-center space-x-3 py-4 px-6 rounded-2xl font-semibold transition-all duration-300 ${
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
                className="space-y-8"
              >
                <div className="card p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
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
              >
                <PantryManager />
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recipe Filters */}
            {(activeTab === 'detect' || activeTab === 'manual') && recipes.length > 0 && (
              <RecipeFilters
                activeFilters={recipeFilters}
                onFiltersChange={setRecipeFilters}
                recipeCount={recipes.length}
              />
            )}

            {/* Quick Stats */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold gradient-text mb-4 flex items-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>Your Kitchen Stats</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Recipes Found Today</span>
                  <span className="font-bold text-purple-600">{recipes.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ingredients Detected</span>
                  <span className="font-bold text-purple-600">{detectedIngredients.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Filters</span>
                  <span className="font-bold text-purple-600">
                    {Object.values(recipeFilters).filter(Boolean).length}
                  </span>
                </div>
              </div>
            </div>
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
                className="card p-12 text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  No recipes found
                </h3>
                <p className="text-gray-600 font-medium text-lg">
                  Try adjusting your filters or adding more common ingredients to discover amazing recipes!
                </p>
              </motion.div>
            )}

            {recipes.length === 0 && detectedIngredients.length === 0 && activeTab !== 'pantry' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-12 text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl flex items-center justify-center mx-auto mb-6 float-animation">
                  {activeTab === 'detect' ? (
                    <Camera className="h-10 w-10 text-white" />
                  ) : (
                    <Search className="h-10 w-10 text-white" />
                  )}
                </div>
                <h3 className="text-2xl font-bold gradient-text mb-4">
                  Ready to create culinary magic? ✨
                </h3>
                <p className="text-gray-600 font-medium text-lg leading-relaxed">
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