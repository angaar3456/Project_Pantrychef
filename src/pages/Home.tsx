import { Link } from 'react-router-dom'
import { Camera, Utensils, Clock, Leaf, ArrowRight, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

export default function Home() {
  const { user } = useAuth()

  const features = [
    {
      icon: Camera,
      title: 'AI-Powered Detection',
      description: 'Upload a photo and let our AI identify ingredients instantly'
    },
    {
      icon: Utensils,
      title: 'Smart Recipe Matching',
      description: 'Get personalized recipes based on what you have'
    },
    {
      icon: Clock,
      title: 'Save Time & Money',
      description: 'No more grocery runs or wondering what to cook'
    },
    {
      icon: Leaf,
      title: 'Reduce Food Waste',
      description: 'Use up ingredients before they expire'
    }
  ]

  const benefits = [
    'Instant ingredient recognition from photos',
    'Thousands of recipes at your fingertips',
    'Filter by dietary preferences and cooking time',
    'Step-by-step cooking instructions',
    'YouTube video tutorials included',
    'Save your favorite recipes'
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Cook What You
                <span className="text-success-500 block">Already Have</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Transform your pantry into delicious meals with AI-powered ingredient detection 
                and smart recipe recommendations. No more food waste, no more "what's for dinner?" stress.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to={user ? "/dashboard" : "/signup"}
                className="btn-primary text-lg px-8 py-4 flex items-center space-x-2"
              >
                <Camera className="h-5 w-5" />
                <span>Start Detecting Ingredients</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              {!user && (
                <Link
                  to="/login"
                  className="btn-secondary text-lg px-8 py-4"
                >
                  Already have an account?
                </Link>
              )}
            </motion.div>
          </div>
        </div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Fresh ingredients and cooking"
              className="w-full h-96 object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How PantryChef Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to transform your ingredients into amazing meals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-success-100 rounded-2xl mb-6">
                  <feature.icon className="h-8 w-8 text-success-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-success-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Everything You Need to Cook Smarter
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                PantryChef combines cutting-edge AI technology with an extensive recipe database 
                to help you make the most of your ingredients.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="h-5 w-5 text-success-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Cooking with fresh ingredients"
                className="w-full h-96 object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                    <Utensils className="h-6 w-6 text-success-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">1000+ Recipes</p>
                    <p className="text-sm text-gray-600">Ready to cook</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Cooking?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of home cooks who are already saving time, money, and reducing food waste.
            </p>
            <Link
              to={user ? "/dashboard" : "/signup"}
              className="inline-flex items-center space-x-2 bg-success-500 hover:bg-success-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Camera className="h-5 w-5" />
              <span>Get Started Free</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}