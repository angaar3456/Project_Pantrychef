import { useState } from 'react'
import { X, Plus, Edit3, Check, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { DetectedIngredient } from '../services/api'

interface IngredientListProps {
  ingredients: DetectedIngredient[]
  onIngredientsChange: (ingredients: DetectedIngredient[]) => void
  onConfirm: () => void
  isLoading?: boolean
}

export default function IngredientList({
  ingredients,
  onIngredientsChange,
  onConfirm,
  isLoading = false
}: IngredientListProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')
  const [newIngredient, setNewIngredient] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  const removeIngredient = (index: number) => {
    const updated = ingredients.filter((_, i) => i !== index)
    onIngredientsChange(updated)
  }

  const startEdit = (index: number) => {
    setEditingIndex(index)
    setEditValue(ingredients[index].name)
  }

  const saveEdit = () => {
    if (editingIndex !== null && editValue.trim()) {
      const updated = [...ingredients]
      updated[editingIndex] = {
        ...updated[editingIndex],
        name: editValue.trim()
      }
      onIngredientsChange(updated)
      setEditingIndex(null)
      setEditValue('')
    }
  }

  const cancelEdit = () => {
    setEditingIndex(null)
    setEditValue('')
  }

  const addIngredient = () => {
    if (newIngredient.trim()) {
      const newIng: DetectedIngredient = {
        name: newIngredient.trim(),
        confidence: 1.0,
        category: 'Other'
      }
      onIngredientsChange([...ingredients, newIng])
      setNewIngredient('')
      setShowAddForm(false)
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100'
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High'
    if (confidence >= 0.6) return 'Medium'
    return 'Low'
  }

  if (ingredients.length === 0) {
    return (
      <div className="card p-8 text-center">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-700 mb-2">No ingredients detected</h3>
        <p className="text-gray-500">Try uploading a clearer image or add ingredients manually.</p>
      </div>
    )
  }

  return (
    <div className="card p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold gradient-text">
          Detected Ingredients ({ingredients.length})
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-secondary text-sm px-4 py-2 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add More</span>
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 glass-card"
          >
            <div className="flex space-x-3">
              <input
                type="text"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                placeholder="Add ingredient..."
                className="flex-1 input-glass"
                onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
              />
              <button
                onClick={addIngredient}
                disabled={!newIngredient.trim()}
                className="btn-primary px-4 py-2 disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="btn-secondary px-4 py-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <AnimatePresence>
          {ingredients.map((ingredient, index) => (
            <motion.div
              key={`${ingredient.name}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="glass-card p-4 group hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                {editingIndex === index ? (
                  <div className="flex-1 flex space-x-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 input-glass text-sm"
                      onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                      autoFocus
                    />
                    <button
                      onClick={saveEdit}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 capitalize mb-1">
                        {ingredient.name}
                      </h4>
                      {ingredient.category && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {ingredient.category}
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(index)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeIngredient(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getConfidenceColor(ingredient.confidence)}`}>
                  {getConfidenceText(ingredient.confidence)} Confidence
                </span>
                <span className="text-xs text-gray-500">
                  {Math.round(ingredient.confidence * 100)}%
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button
        onClick={onConfirm}
        disabled={isLoading || ingredients.length === 0}
        className="w-full btn-primary flex items-center justify-center space-x-3 disabled:opacity-50"
      >
        {isLoading ? (
          <div className="loading-spinner"></div>
        ) : (
          <>
            <span>Find Recipes with These Ingredients</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ✨
            </motion.div>
          </>
        )}
      </button>
    </div>
  )
}