import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChefHat, User, LogOut, Camera, Sparkles, Zap } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  // Create floating particles
  const particles = Array.from({ length: 50 }, (_, i) => (
    <div
      key={i}
      className="particle"
      style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 15}s`,
        animationDuration: `${15 + Math.random() * 10}s`
      }}
    />
  ))

  return (
    <div className="min-h-screen relative">
      {/* Animated particle background */}
      <div className="particles">
        {particles}
      </div>

      {/* Floating geometric shapes */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full morphing-blob floating-element"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full morphing-blob floating-element" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-r from-pink-500/10 to-cyan-500/10 rounded-full morphing-blob floating-element" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full morphing-blob floating-element" style={{ animationDelay: '6s' }}></div>
      </div>

      <nav className="nav-glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl pulsing-glow rotating-element">
                  <ChefHat className="h-6 w-6 text-white" />
                </div>
                <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="text-2xl font-bold gradient-text">PantryChef</span>
            </Link>

            <div className="flex items-center space-x-6">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 ${
                      isActive('/dashboard')
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-2xl shadow-cyan-500/25'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50 backdrop-blur-sm border border-gray-700/30'
                    }`}
                  >
                    <Camera className="h-5 w-5" />
                    <span>Detect</span>
                  </Link>
                  <div className="flex items-center space-x-4 bg-gray-900/50 backdrop-blur-xl rounded-2xl px-4 py-2 border border-gray-700/30">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center pulsing-glow">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-200">{user.name}</span>
                    <button
                      onClick={logout}
                      className="p-2 text-gray-400 hover:text-red-400 transition-all duration-300 hover:bg-red-500/10 rounded-lg transform hover:scale-110"
                      title="Logout"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-white font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="btn-primary"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 relative z-10">
        {children}
      </main>

      <footer className="bg-black/80 backdrop-blur-2xl border-t border-gray-800/50 mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center pulsing-glow">
                <ChefHat className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">PantryChef</span>
            </div>
            <p className="text-gray-400 font-medium">
              &copy; 2024 PantryChef. Transform your ingredients into culinary magic{' '}
              <Zap className="inline h-4 w-4 text-yellow-400" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}