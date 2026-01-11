import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { Upload, LayoutDashboard, MessageCircle, Sprout } from 'lucide-react'
import toast from 'react-hot-toast'

const Landing = () => {
  const { experienceLevel, setExperienceLevel } = useUser()

  const handleToggle = (level) => {
    setExperienceLevel(level)
    toast.success(`Mode changed to ${level === 'beginner' ? 'Beginner' : 'Experienced'}`)
  }

  const features = [
    {
      path: '/upload',
      icon: Upload,
      title: 'Upload Soil Image',
      description: 'Identify your soil type using AI-powered image analysis',
      color: 'bg-primary-500',
    },
    {
      path: '/dashboard',
      icon: LayoutDashboard,
      title: 'Dashboard',
      description: 'View plant recommendations, watering schedule, and weather alerts',
      color: 'bg-earth-500',
    },
    {
      path: '/chatbot',
      icon: MessageCircle,
      title: 'Chat Assistant',
      description: 'Get instant gardening advice from our AI assistant',
      color: 'bg-blue-500',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Sprout className="text-primary-600" size={64} />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Smart Garden
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your personal gardening assistant for rooftop and terrace gardening
          </p>

          {/* Experience Level Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
              <button
                onClick={() => handleToggle('beginner')}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  experienceLevel === 'beginner'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Beginner
              </button>
              <button
                onClick={() => handleToggle('experienced')}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  experienceLevel === 'experienced'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Experienced
              </button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <Link
                  key={idx}
                  to={feature.path}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow transform hover:scale-105"
                >
                  <div className={`${feature.color} w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto`}>
                    <Icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Link>
              )
            })}
          </div>

          {/* Quick Start Instructions */}
          <div className="mt-16 bg-white rounded-xl shadow-md p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Get Started</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Upload Soil</h4>
                  <p className="text-sm text-gray-600">Take a photo of your soil</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Get Recommendations</h4>
                  <p className="text-sm text-gray-600">View personalized plant suggestions</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Start Gardening</h4>
                  <p className="text-sm text-gray-600">Follow care instructions and chat for help</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing
