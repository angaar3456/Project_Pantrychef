import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChefHat, User, LogOut, Camera, Sparkles } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <nav className="nav-glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <ChefHat className="h-10 w-10 text-purple-600 group-hover:text-pink-600 transition-colors duration-300" />
                <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="text-2xl font-bold gradient-text">PantryChef</span>
            </Link>

            <div className="flex items-center space-x-6">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                      isActive('/dashboard')
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-white/50 backdrop-blur-sm'
                    }`}
                  >
                    <Camera className="h-5 w-5" />
                    <span>Detect</span>
                  </Link>
                  <div className="flex items-center space-x-4 bg-white/50 backdrop-blur-sm rounded-2xl px-4 py-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{user.name}</span>
                    <button
                      onClick={logout}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-300 hover:bg-red-50 rounded-lg"
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
                    className="text-gray-600 hover:text-purple-600 font-semibold transition-colors duration-300"
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

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-white/80 backdrop-blur-lg border-t border-white/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <ChefHat className="h-8 w-8 text-purple-600" />
              <span className="text-xl font-bold gradient-text">PantryChef</span>
            </div>
            <p className="text-gray-600 font-medium">
              &copy; 2024 PantryChef. Transform your ingredients into culinary magic ✨
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}