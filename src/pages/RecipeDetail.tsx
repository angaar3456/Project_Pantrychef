import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock, Users, ChefHat, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'

export default function RecipeDetail() {
  const { id } = useParams()

  // Mock recipe data - in a real app, this would come from an API
  const recipe = {
    id: id,
    title: 'Delicious Vegetable Stir Fry',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    cookTime: '25 minutes',
    servings: 4,
    difficulty: 'Easy',
    description: 'A quick and healthy vegetable stir fry that makes perfect use of your fresh ingredients. This colorful dish is packed with nutrients and flavor.',
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
      'Heat vegetable oil in a large wok or skillet over high heat.',
      'Add garlic and ginger, stir-fry for 30 seconds until fragrant.',
      'Add the harder vegetables first (carrots, broccoli) and cook for 2-3 minutes.',
      'Add softer vegetables (bell peppers) and continue cooking for 2 minutes.',
      'Mix soy sauce, oyster sauce, and sesame oil in a small bowl.',
      'Pour the sauce over vegetables and toss to coat evenly.',
      'Cook for another 1-2 minutes until vegetables are tender-crisp.',
      'Garnish with green onions and serve immediately over rice.'
    ],
    nutrition: {
      calories: 180,
      protein: '6g',
      carbs: '12g',
      fat: '8g',
      fiber: '4g'
    },
    tags: ['Vegetarian', 'Quick', 'Healthy', 'Asian'],
    youtubeUrl: 'https://www.youtube.com/watch?v=Ug_VJVkULks'
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-2 text-success-600 hover:text-success-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="card overflow-hidden">
          <div className="relative h-64 sm:h-80">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {recipe.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="h-5 w-5 text-success-500" />
                <span>{recipe.cookTime}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Users className="h-5 w-5 text-success-500" />
                <span>{recipe.servings} servings</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <ChefHat className="h-5 w-5 text-success-500" />
                <span>{recipe.difficulty}</span>
              </div>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              {recipe.description}
            </p>

            {recipe.youtubeUrl && (
              <div className="mb-6">
                <a
                  href={recipe.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Watch Video Tutorial</span>
                </a>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Ingredients
                </h2>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-2 text-gray-700"
                    >
                      <span className="w-2 h-2 bg-success-500 rounded-full mt-2 flex-shrink-0" />
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Instructions
                </h2>
                <ol className="space-y-3">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-success-500 text-white text-sm rounded-full flex items-center justify-center font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 leading-relaxed">
                        {instruction}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Nutrition Information (per serving)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success-600">
                    {recipe.nutrition.calories}
                  </div>
                  <div className="text-sm text-gray-600">Calories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success-600">
                    {recipe.nutrition.protein}
                  </div>
                  <div className="text-sm text-gray-600">Protein</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success-600">
                    {recipe.nutrition.carbs}
                  </div>
                  <div className="text-sm text-gray-600">Carbs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success-600">
                    {recipe.nutrition.fat}
                  </div>
                  <div className="text-sm text-gray-600">Fat</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success-600">
                    {recipe.nutrition.fiber}
                  </div>
                  <div className="text-sm text-gray-600">Fiber</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}