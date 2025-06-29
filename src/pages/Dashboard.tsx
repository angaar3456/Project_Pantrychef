import React, { useState, useRef } from 'react'
import { Camera, Upload, X, Clock, Users, Filter, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import IngredientDetector from '../components/IngredientDetector'
import ManualIngredientEntry from '../components/ManualIngredientEntry'
import RecipeList from '../components/RecipeList'
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([])
  const [recipes, setRecipes] = useState<any[]>([])
  const [isDetecting, setIsDetecting] = useState(false)
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeTab, setActiveTab] = useState<'camera' | 'manual'>('camera')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (file: File) => {
    setSelectedImage(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    // Clear manual ingredients when switching to camera mode
    setDetectedIngredients([])
    setRecipes([])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      handleImageSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const clearImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setDetectedIngredients([])
    setRecipes([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleIngredientsDetected = (ingredients: string[]) => {
    setDetectedIngredients(ingredients)
  }

  const handleRecipesLoaded = (recipes: any[]) => {
    setRecipes(recipes)
  }

  const handleTabSwitch = (tab: 'camera' | 'manual') => {
    setActiveTab(tab)
    // Clear data when switching tabs
    setDetectedIngredients([])
    setRecipes([])
    if (tab === 'manual') {
      clearImage()
    }
  }

  const filters = [
    { id: 'all', label: 'All Recipes', icon: null },
    { id: 'quick', label: 'Quick (< 30 min)', icon: Clock },
    { id: 'family', label: 'Family Size', icon: Users },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Upload a photo of your ingredients or manually enter them to discover amazing recipes you can make right now.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Tab Selector */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => handleTabSwitch('camera')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'camera'
                  ? 'bg-white text-success-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Camera className="h-4 w-4" />
              <span>Camera Detection</span>
            </button>
            <button
              onClick={() => handleTabSwitch('manual')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'manual'
                  ? 'bg-white text-success-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Manual Entry</span>
            </button>
          </div>

          {/* Camera Detection Tab */}
          {activeTab === 'camera' && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Camera className="h-5 w-5 text-success-500" />
                <span>AI Ingredient Detection</span>
              </h2>

              {!imagePreview ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-success-400 transition-colors cursor-pointer"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Drop your image here or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports JPG, PNG, and other image formats
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageSelect(file)
                    }}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Selected ingredients"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <button
                    onClick={clearImage}
                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              )}

              {selectedImage && (
                <IngredientDetector
                  image={selectedImage}
                  onIngredientsDetected={handleIngredientsDetected}
                  onRecipesLoaded={handleRecipesLoaded}
                  isDetecting={isDetecting}
                  setIsDetecting={setIsDetecting}
                  setIsLoadingRecipes={setIsLoadingRecipes}
                />
              )}
            </div>
          )}

          {/* Manual Entry Tab */}
          {activeTab === 'manual' && (
            <ManualIngredientEntry
              onIngredientsSelected={handleIngredientsDetected}
              onRecipesLoaded={handleRecipesLoaded}
              setIsLoadingRecipes={setIsLoadingRecipes}
            />
          )}

          {/* Detected/Selected Ingredients */}
          <AnimatePresence>
            {detectedIngredients.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="card p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {activeTab === 'camera' ? 'Detected' : 'Selected'} Ingredients ({detectedIngredients.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {detectedIngredients.map((ingredient, index) => (
                    <motion.span
                      key={ingredient}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="ingredient-tag capitalize"
                    >
                      {ingredient}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Recipes Section */}
        <div className="space-y-6">
          {recipes.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recipe Suggestions ({recipes.length})
                </h2>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={activeFilter}
                    onChange={(e) => setActiveFilter(e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-success-500"
                  >
                    {filters.map((filter) => (
                      <option key={filter.id} value={filter.id}>
                        {filter.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <RecipeList recipes={recipes} isLoading={isLoadingRecipes} />
            </>
          )}

          {recipes.length === 0 && detectedIngredients.length > 0 && !isLoadingRecipes && (
            <div className="card p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Camera className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No recipes found
              </h3>
              <p className="text-gray-600">
                Try {activeTab === 'camera' ? 'uploading a different image' : 'selecting different ingredients'} with more common ingredients.
              </p>
            </div>
          )}

          {recipes.length === 0 && detectedIngredients.length === 0 && (
            <div className="card p-8 text-center">
              <div className="text-gray-400 mb-4">
                {activeTab === 'camera' ? (
                  <Upload className="h-12 w-12 mx-auto" />
                ) : (
                  <Search className="h-12 w-12 mx-auto" />
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Ready to cook something amazing?
              </h3>
              <p className="text-gray-600">
                {activeTab === 'camera' 
                  ? 'Upload a photo of your ingredients to get started with AI-powered recipe recommendations.'
                  : 'Search and select your available ingredients to discover personalized recipes.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}