import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock, Users, ChefHat, ExternalLink, Heart, Star, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function RecipeDetail() {
  const { id } = useParams()

  const recipe = {
    id: id,
    title: 'Magical Vegetable Stir Fry',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    cookTime: '25 minutes',
    servings: 4,
    difficulty: 'Easy',
    description: 'A quick and healthy vegetable stir fry that makes perfect use of your fresh ingredients. This colorful dish is packed with nutrients, flavor, and culinary magic that will transform your everyday vegetables into an extraordinary meal.',
    ingredients: [
      '2 cups mixed vegetables (bell peppers, broccoli, carrots)',
      '2 tablespoons vegetable oil',
      '3 cloves garlic, minced',
      '1 tablespoon ginger, grated',
      '2 tablespoons soy sauce',
      '1 tablespoon oyster sauce',
      '1 teaspoon sesame oil',
      '2 green onions, sliced',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Heat vegetable oil in a large wok or skillet over high heat until shimmering.',
      'Add garlic and ginger, stir-fry for 30 seconds until fragrant and golden.',
      'Add the harder vegetables first (carrots, broccoli) and cook for 2-3 minutes.',
      'Add softer vegetables (bell peppers) and continue cooking for 2 minutes.',
      'Mix soy sauce, oyster sauce, and sesame oil in a small bowl.',
      'Pour the sauce over vegetables and toss to coat evenly.',
      'Cook for another 1-2 minutes until vegetables are tender-crisp.',
      'Garnish with green onions and serve immediately over steamed rice.'
    ],
    nutrition: {
      calories: 180,
      protein: '6g',
      carbs: '12g',
      fat: '8g',
      fiber: '4g'
    },
    tags: ['Vegetarian', 'Quick', 'Healthy', 'Asian', 'Colorful'],
    youtubeUrl: 'https://www.youtube.com/watch?v=Ug_VJVkULks',
    rating: 4.8,
    reviews: 1247
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 text-purple-600 hover:text-pink-600 mb-8 transition-colors font-semibold text-lg"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Magic Kitchen</span>
          </Link>

          <div className="card overflow-hidden">
            <div className="relative h-80 sm:h-96">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Floating elements */}
              <div className="absolute top-6 right-6">
                <div className="glass-card p-3">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-white font-bold">{recipe.rating}</span>
                    <span className="text-white/80 text-sm">({recipe.reviews})</span>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                      {recipe.title}
                    </h1>
                    <div className="flex flex-wrap gap-2">
                      {recipe.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-white/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
                <div className="glass-card p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div className="font-bold text-gray-900">{recipe.cookTime}</div>
                  <div className="text-sm text-gray-600">Cook Time</div>
                </div>
                <div className="glass-card p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="font-bold text-gray-900">{recipe.servings}</div>
                  <div className="text-sm text-gray-600">Servings</div>
                </div>
                <div className="glass-card p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <ChefHat className="h-6 w-6 text-white" />
                  </div>
                  <div className="font-bold text-gray-900">{recipe.difficulty}</div>
                  <div className="text-sm text-gray-600">Difficulty</div>
                </div>
                <div className="glass-card p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div className="font-bold text-gray-900">{recipe.reviews}</div>
                  <div className="text-sm text-gray-600">Reviews</div>
                </div>
              </div>

              <p className="text-gray-600 mb-8 leading-relaxed text-lg font-medium">
                {recipe.description}
              </p>

              {recipe.youtubeUrl && (
                <div className="mb-8">
                  <a
                    href={recipe.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 font-semibold text-lg"
                  >
                    <ExternalLink className="h-5 w-5" />
                    <span>Watch Magic Tutorial</span>
                  </a>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-2xl font-bold gradient-text mb-6 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <span>Magic Ingredients</span>
                  </h2>
                  <div className="space-y-4">
                    {recipe.ingredients.map((ingredient, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start space-x-3 p-3 glass-card"
                      >
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <span className="text-gray-700 font-medium">{ingredient}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold gradient-text mb-6 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                      <ChefHat className="h-4 w-4 text-white" />
                    </div>
                    <span>Cooking Instructions</span>
                  </h2>
                  <div className="space-y-4">
                    {recipe.instructions.map((instruction, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex space-x-4 p-4 glass-card"
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm rounded-full flex items-center justify-center font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-gray-700 leading-relaxed font-medium">
                          {instruction}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12 glass-card p-8">
                <h3 className="text-2xl font-bold gradient-text mb-6 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Heart className="h-4 w-4 text-white" />
                  </div>
                  <span>Nutrition Magic (per serving)</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text mb-2">
                      {recipe.nutrition.calories}
                    </div>
                    <div className="text-gray-600 font-medium">Calories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text mb-2">
                      {recipe.nutrition.protein}
                    </div>
                    <div className="text-gray-600 font-medium">Protein</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text mb-2">
                      {recipe.nutrition.carbs}
                    </div>
                    <div className="text-gray-600 font-medium">Carbs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text mb-2">
                      {recipe.nutrition.fat}
                    </div>
                    <div className="text-gray-600 font-medium">Fat</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text mb-2">
                      {recipe.nutrition.fiber}
                    </div>
                    <div className="text-gray-600 font-medium">Fiber</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}