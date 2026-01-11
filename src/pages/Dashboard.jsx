import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import PlantCard from '../components/PlantCard'
import WeatherCard from '../components/WeatherCard'
import { Droplet, Sun, Leaf } from 'lucide-react'

const Dashboard = () => {
  const location = useLocation()
  const { experienceLevel } = useUser()
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)

  // Mock plant recommendations based on soil type and experience level
  const getRecommendedPlants = () => {
    const soilType = location.state?.soilType || 'loamy'
    const allPlants = {
      loamy: [
        { name: 'Tomato', description: 'Perfect for beginners, high yield', difficulty: 'beginner' },
        { name: 'Basil', description: 'Easy to grow, great for cooking', difficulty: 'beginner' },
        { name: 'Spinach', description: 'Fast growing, nutritious', difficulty: 'beginner' },
        { name: 'Capsicum', description: 'Colorful and productive', difficulty: 'intermediate' },
        { name: 'Brinjal', description: 'Popular in Indian cuisine', difficulty: 'intermediate' },
      ],
      sandy: [
        { name: 'Carrot', description: 'Loves sandy soil', difficulty: 'beginner' },
        { name: 'Radish', description: 'Quick harvest', difficulty: 'beginner' },
        { name: 'Okra', description: 'Heat tolerant', difficulty: 'intermediate' },
      ],
      clay: [
        { name: 'Cauliflower', description: 'Needs good drainage', difficulty: 'intermediate' },
        { name: 'Cabbage', description: 'Cool season crop', difficulty: 'intermediate' },
      ],
    }

    let plants = allPlants[soilType] || allPlants.loamy
    
    // Filter by experience level for beginners
    if (experienceLevel === 'beginner') {
      plants = plants.filter(p => p.difficulty === 'beginner')
    }

    return plants.slice(0, 5)
  }

  const recommendedPlants = getRecommendedPlants()

  // Mock weather data (replace with actual API call later)
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setWeather({
        temperature: 28,
        condition: 'Clear',
        rainfall: 0,
        alerts: [
          '☀️ Sunny day - ensure adequate shade for sensitive plants',
          '💧 Water plants early morning or evening',
        ],
      })
      setLoading(false)
    }, 1000)
  }, [])

  // Calculate care instructions (mock data)
  const careInstructions = {
    waterPerDay: experienceLevel === 'beginner' ? '2-3 liters' : '3-4 liters',
    sunlightHours: '6-8 hours',
    notes: 'Water in the morning for best results',
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600 mb-8">
          Your personalized gardening recommendations and care instructions
        </p>

        {/* Weather Card */}
        <div className="mb-8">
          <WeatherCard weather={weather} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Plant Recommendations */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="text-primary-600" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Recommended Plants</h2>
            </div>
            {location.state?.fromUpload && (
              <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-3 rounded">
                <p className="text-sm text-green-700">
                  ✅ Soil analyzed! Showing recommendations for <strong>{location.state.soilType}</strong> soil
                </p>
              </div>
            )}
            <div className="space-y-4">
              {recommendedPlants.map((plant, idx) => (
                <PlantCard key={idx} plant={plant} />
              ))}
            </div>
          </div>

          {/* Care Instructions */}
          <div className="space-y-6">
            {/* Watering Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Droplet className="text-blue-500" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Watering</h2>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-600">{careInstructions.waterPerDay}</div>
                <p className="text-gray-600 text-sm">per day</p>
                <p className="text-gray-500 text-sm mt-4">{careInstructions.notes}</p>
              </div>
            </div>

            {/* Sunlight Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Sun className="text-yellow-500" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Sunlight</h2>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-yellow-600">{careInstructions.sunlightHours}</div>
                <p className="text-gray-600 text-sm">of direct sunlight</p>
                <p className="text-gray-500 text-sm mt-4">
                  Place plants in a sunny spot on your rooftop or terrace
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Tips */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">💡 Gardening Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p className="font-semibold mb-1">Best Time to Water:</p>
              <p>Early morning (6-8 AM) or evening (5-7 PM) to avoid evaporation</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Container Gardening:</p>
              <p>Use pots with drainage holes to prevent waterlogging</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Fertilizer:</p>
              <p>Use organic compost or vermicompost every 2-3 weeks</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Pest Control:</p>
              <p>Check leaves regularly and use neem oil spray if needed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
