import { useState, useEffect } from 'react'
import { Plus, Package, Calendar, Trash2, Edit3, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PantryItem, getPantryItems, addPantryItem, updatePantryItem, deletePantryItem } from '../services/api'
import toast from 'react-hot-toast'

export default function PantryManager() {
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [editingItem, setEditingItem] = useState<PantryItem | null>(null)

  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    category: 'Other',
    expiryDate: ''
  })

  const categories = [
    'all', 'Vegetables', 'Fruits', 'Proteins', 'Dairy', 'Grains', 'Herbs & Spices', 'Other'
  ]

  useEffect(() => {
    loadPantryItems()
  }, [])

  const loadPantryItems = async () => {
    try {
      const items = await getPantryItems()
      setPantryItems(items)
    } catch (error) {
      toast.error('Failed to load pantry items')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddItem = async () => {
    if (!newItem.name.trim()) {
      toast.error('Please enter an item name')
      return
    }

    try {
      const item = await addPantryItem(newItem)
      setPantryItems([...pantryItems, item])
      setNewItem({ name: '', quantity: '', category: 'Other', expiryDate: '' })
      setShowAddForm(false)
      toast.success('Item added to pantry!')
    } catch (error) {
      toast.error('Failed to add item')
    }
  }

  const handleUpdateItem = async (id: string, updates: Partial<PantryItem>) => {
    try {
      const updatedItem = await updatePantryItem(id, updates)
      setPantryItems(pantryItems.map(item => item.id === id ? updatedItem : item))
      setEditingItem(null)
      toast.success('Item updated!')
    } catch (error) {
      toast.error('Failed to update item')
    }
  }

  const handleDeleteItem = async (id: string) => {
    try {
      await deletePantryItem(id)
      setPantryItems(pantryItems.filter(item => item.id !== id))
      toast.success('Item removed from pantry')
    } catch (error) {
      toast.error('Failed to delete item')
    }
  }

  const filteredItems = pantryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getExpiryStatus = (expiryDate?: string) => {
    if (!expiryDate) return 'none'
    
    const today = new Date()
    const expiry = new Date(expiryDate)
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilExpiry < 0) return 'expired'
    if (daysUntilExpiry <= 3) return 'expiring'
    if (daysUntilExpiry <= 7) return 'warning'
    return 'good'
  }

  const getExpiryColor = (status: string) => {
    switch (status) {
      case 'expired': return 'bg-red-100 text-red-700 border-red-200'
      case 'expiring': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'good': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  if (isLoading) {
    return (
      <div className="card p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text flex items-center space-x-3">
            <Package className="h-6 w-6" />
            <span>My Pantry ({pantryItems.length} items)</span>
          </h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Item</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search pantry items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 input-glass"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-glass px-4 py-3"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        {/* Add Item Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card p-6 mb-6"
            >
              <h3 className="font-bold text-gray-800 mb-4">Add New Item</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Item name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="input-glass"
                />
                <input
                  type="text"
                  placeholder="Quantity (optional)"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  className="input-glass"
                />
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="input-glass"
                >
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={newItem.expiryDate}
                  onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                  className="input-glass"
                />
              </div>
              <div className="flex space-x-3 mt-4">
                <button onClick={handleAddItem} className="btn-primary">
                  Add Item
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pantry Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredItems.map((item) => {
            const expiryStatus = getExpiryStatus(item.expiryDate)
            const isEditing = editingItem?.id === item.id

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`card p-4 ${getExpiryColor(expiryStatus)} border-2`}
              >
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      className="w-full input-glass text-sm"
                    />
                    <input
                      type="text"
                      value={editingItem.quantity || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, quantity: e.target.value })}
                      placeholder="Quantity"
                      className="w-full input-glass text-sm"
                    />
                    <input
                      type="date"
                      value={editingItem.expiryDate || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, expiryDate: e.target.value })}
                      className="w-full input-glass text-sm"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateItem(item.id, editingItem)}
                        className="btn-primary text-sm px-3 py-1"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingItem(null)}
                        className="btn-secondary text-sm px-3 py-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-800 capitalize">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600">{item.category}</p>
                        {item.quantity && (
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        )}
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {item.expiryDate && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Expires: {new Date(item.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {expiryStatus === 'expired' && (
                      <p className="text-sm font-medium text-red-700 mt-2">
                        ⚠️ Expired
                      </p>
                    )}
                    {expiryStatus === 'expiring' && (
                      <p className="text-sm font-medium text-orange-700 mt-2">
                        ⏰ Expiring soon
                      </p>
                    )}
                  </>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {filteredItems.length === 0 && (
        <div className="card p-12 text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            {searchTerm || selectedCategory !== 'all' ? 'No items found' : 'Your pantry is empty'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Start adding ingredients to track your pantry inventory'
            }
          </p>
          {!searchTerm && selectedCategory === 'all' && (
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
            >
              Add Your First Item
            </button>
          )}
        </div>
      )}
    </div>
  )
}