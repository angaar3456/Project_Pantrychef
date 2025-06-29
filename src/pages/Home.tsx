import { Link } from 'react-router-dom'
import { Camera, Utensils, Clock, Leaf, ArrowRight, CheckCircle, Sparkles, Star, Zap, ChefHat } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

export default function Home() {
  const { user } = useAuth()

  const features = [
    {
      icon: Camera,
      title: 'AI Magic Detection',
      description: 'Snap a photo and watch our AI instantly identify every ingredient',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      icon: Utensils,
      title: 'Smart Recipe Wizard',
      description: 'Get personalized recipes that perfectly match your ingredients',
      color: 'from-pink-500 to-rose-600'
    },
    {
      icon: Clock,
      title: 'Lightning Fast',
      description: 'From photo to recipe in seconds - no more meal planning stress',
      color: 'from-orange-500 to-amber-600'
    },
    {
      icon: Leaf,
      title: 'Zero Waste Hero',
      description: 'Turn forgotten ingredients into amazing meals before they expire',
      color: 'from-emerald-500 to-teal-600'
    }
  ]

  const benefits = [
    'Instant AI-powered ingredient recognition',
    'Thousands of curated recipes at your fingertips',
    'Smart filters for dietary preferences & time',
    'Step-by-step video tutorials included',
    'Save and organize your favorite recipes',
    'Reduce food waste by 80% on average'
  ]

  const stats = [
    { number: '50K+', label: 'Happy Cooks', icon: Star },
    { number: '1M+', label: 'Recipes Created', icon: Utensils },
    { number: '99%', label: 'Success Rate', icon: Zap },
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-orange-600/10"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl float-animation">
                    <ChefHat className="h-10 w-10 text-white" />
                  </div>
                  <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-2 -right-2 animate-bounce" />
                </div>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8">
                <span className="gradient-text">Cook What You</span>
                <br />
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Already Have
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
                Transform your pantry into culinary masterpieces with our revolutionary AI chef. 
                <span className="gradient-text font-semibold"> No more food waste, no more "what's for dinner?" stress!</span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              <Link
                to={user ? "/dashboard" : "/signup"}
                className="btn-primary text-xl px-12 py-6 flex items-center space-x-3 group"
              >
                <Camera className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                <span>Start Your Culinary Journey</span>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              {!user && (
                <Link
                  to="/login"
                  className="btn-secondary text-xl px-12 py-6"
                >
                  I'm Already a Chef
                </Link>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto"
            >
              {stats.map((stat, index) => (
                <div key={stat.label} className="glass-card p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <stat.icon className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold gradient-text mb-1">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-20 max-w-6xl mx-auto"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-3xl"></div>
            <img
              src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Fresh ingredients and cooking"
              className="w-full h-[500px] object-cover rounded-3xl shadow-2xl relative z-10 border-4 border-white/50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-3xl z-20"></div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-6">
                How the Magic Happens
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
                Four simple steps to transform your ingredients into extraordinary meals
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-8">
                Everything You Need to Cook Like a Pro
              </h2>
              <p className="text-xl text-gray-600 mb-10 font-medium leading-relaxed">
                PantryChef combines cutting-edge AI technology with an extensive recipe database 
                to help you create restaurant-quality meals from everyday ingredients.
              </p>
              
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-4 group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium text-lg">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-3xl"></div>
              <img
                src="https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Cooking with fresh ingredients"
                className="w-full h-[500px] object-cover rounded-3xl shadow-2xl relative z-10 border-4 border-white/50"
              />
              <div className="absolute -bottom-8 -left-8 glass-card p-8 z-20">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center">
                    <Utensils className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-2xl gradient-text">10,000+</p>
                    <p className="text-gray-600 font-medium">Recipes Ready</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center pulse-glow">
                <Sparkles className="h-12 w-12 text-yellow-400" />
              </div>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">
              Ready to Transform Your Kitchen?
            </h2>
            <p className="text-xl text-white/90 mb-12 font-medium leading-relaxed">
              Join thousands of home chefs who are already creating magic with their ingredients. 
              <br />Start your culinary adventure today - it's completely free!
            </p>
            <Link
              to={user ? "/dashboard" : "/signup"}
              className="inline-flex items-center space-x-3 bg-white text-purple-600 font-bold py-6 px-12 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-white/25 transform hover:-translate-y-2 hover:scale-105 text-xl"
            >
              <Camera className="h-6 w-6" />
              <span>Start Cooking Magic</span>
              <ArrowRight className="h-6 w-6" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}