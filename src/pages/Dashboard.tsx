import React, { useState, useRef } from 'react'
import { Camera, Upload, X, Clock, Users, Filter, Search, Sparkles, Zap, Heart, Star } from 'lucide-react'
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
    setDetectedIngredients([])
    setRecipes([])
    setActiveFilter('all')
    if (tab === 'manual') {
      clearImage()
    }
  }

  const filters = [
    { id: 'all', label: 'All Recipes', icon: Star },
    { id: 'quick', label: 'Quick (≤ 30 min)', icon: Clock },
    { id: 'family', label: 'Family Size (4+ servings)', icon: Users },
    { id: 'vegetarian', label: 'Vegetarian', icon: Heart },
    { id: 'protein', label: 'High Protein', icon: Zap },
    { id: 'comfort', label: 'Comfort Food', icon: Sparkles },
  ]

  return (
    <div className="min-h-screen py-8">
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
            Ready to create some culinary magic? Upload a photo or manually select your ingredients 
            to discover amazing recipes you can make right now!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {/* Input Section */}
          <div className="space-y-8">
            {/* Tab Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card p-2"
            >
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleTabSwitch('camera')}
                  className={`flex items-center justify-center space-x-3 py-4 px-6 rounded-2xl font-semibold transition-all duration-300 ${
                    activeTab === 'camera' ? 'tab-active' : 'tab-inactive'
                  }`}
                >
                  <Camera className="h-5 w-5" />
                  <span>AI Detection</span>
                </button>
                <button
                  onClick={() => handleTabSwitch('manual')}
                  className={`flex items-center justify-center space-x-3 py-4 px-6 rounded-2xl font-semibold transition-all duration-300 ${
                    activeTab === 'manual' ? 'tab-active' : 'tab-inactive'
                  }`}
                >
                  <Search className="h-5 w-5" />
                  <span>Manual Entry</span>
                </button>
              </div>
            </motion.div>

            {/* Camera Detection Tab */}
            {activeTab === 'camera' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="card p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Camera className="h-4 w-4 text-white" />
                  </div>
                  <span className="gradient-text">AI Magic Detection</span>
                </h2>

                {!imagePreview ? (
                  <div
                    className="border-3 border-dashed border-purple-300 rounded-3xl p-12 text-center hover:border-pink-400 hover:bg-purple-50/50 transition-all duration-300 cursor-pointer group"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Upload className="h-10 w-10 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800 mb-3">
                      Drop your magic ingredient photo here
                    </p>
                    <p className="text-gray-600 font-medium">
                      Or click to browse • Supports JPG, PNG, and other formats
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
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      alt="Selected ingredients"
                      className="w-full h-80 object-cover rounded-3xl shadow-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-3xl"></div>
                    <button
                      onClick={clearImage}
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all duration-300 group-hover:scale-110"
                    >
                      <X className="h-5 w-5 text-gray-600" />
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
                  onIngredientsSelected={handleIngredientsDetected}
                  onRecipesLoaded={handleRecipesLoaded}
                  setIsLoadingRecipes={setIsLoadingRecipes}
                />
              </motion.div>
            )}

            {/* Detected/Selected Ingredients */}
            <AnimatePresence>
              {detectedIngredients.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="card p-8"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <Heart className="h-4 w-4 text-white" />
                    </div>
                    <span className="gradient-text">
                      {activeTab === 'camera' ? 'Detected' : 'Selected'} Ingredients ({detectedIngredients.length})
                    </span>
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {detectedIngredients.map((ingredient, index) => (
                      <motion.span
                        key={ingredient}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="ingredient-tag capitalize text-lg px-6 py-3"
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
          <div className="space-y-8">
            {recipes.length > 0 && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="glass-card p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold gradient-text flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <span>Magic Recipes ({recipes.length})</span>
                    </h2>
                  </div>
                  
                  <div className="flex items-center space-x-3 mb-4">
                    <Filter className="h-5 w-5 text-purple-500" />
                    <span className="font-semibold text-gray-700">Filter by:</span>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {filters.map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={`flex items-center space-x-2 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 text-sm ${
                          activeFilter === filter.id
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                            : 'bg-white/70 text-gray-600 hover:bg-white hover:text-purple-600 border border-white/30'
                        }`}
                      >
                        {filter.icon && <filter.icon className="h-4 w-4" />}
                        <span className="truncate">{filter.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>

                <RecipeList 
                  recipes={recipes} 
                  isLoading={isLoadingRecipes} 
                  activeFilter={activeFilter}
                />
              </>
            )}

            {recipes.length === 0 && detectedIngredients.length > 0 && !isLoadingRecipes && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-12 text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Camera className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  No magic recipes found
                </h3>
                <p className="text-gray-600 font-medium text-lg">
                  Try {activeTab === 'camera' ? 'uploading a different image' : 'selecting different ingredients'} with more common ingredients to discover amazing recipes!
                </p>
              </motion.div>
            )}

            {recipes.length === 0 && detectedIngredients.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-12 text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl flex items-center justify-center mx-auto mb-6 float-animation">
                  {activeTab === 'camera' ? (
                    <Upload className="h-10 w-10 text-white" />
                  ) : (
                    <Search className="h-10 w-10 text-white" />
                  )}
                </div>
                <h3 className="text-2xl font-bold gradient-text mb-4">
                  Ready to create culinary magic? ✨
                </h3>
                <p className="text-gray-600 font-medium text-lg leading-relaxed">
                  {activeTab === 'camera' 
                    ? 'Upload a photo of your ingredients and watch our AI work its magic to create personalized recipe recommendations just for you!'
                    : 'Search and select your available ingredients to discover amazing recipes tailored to what you have in your kitchen right now!'
                  }
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}