import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import WeatherCard from '../components/WeatherCard'
import PlantCard from '../components/PlantCard'
import { useTheme } from '../context/ThemeContext'
import { Sparkles, Sprout, AlertCircle, ArrowUpRight, Droplet, Wheat } from 'lucide-react'
import { fetchCropRecommendations } from '../services/cropService'

const CropCard = ({ crop }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 border shadow-sm ${
    crop.rooftop_friendly ? "border-green-200 dark:border-green-800/60" : "border-gray-200 dark:border-gray-700"
  }`}>
    <div className="flex items-start justify-between gap-2 mb-2">
      <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight">{crop.display}</h4>
      <span className={`shrink-0 px-2 py-0.5 text-[10px] font-semibold rounded-full ${
        crop.rooftop_friendly
          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
          : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
      }`}>
        {crop.rooftop_friendly ? "🪴 Terrace OK" : "🌾 Field crop"}
      </span>
    </div>

    <div className="flex items-center gap-2 mb-2">
      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(100, crop.match)}%` }}></div>
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">{crop.match}%</span>
    </div>

    <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">🪣 {crop.pot}</p>
    {crop.note && <p className="text-xs text-gray-500 dark:text-gray-400">{crop.note}</p>}
  </div>
)

const Dashboard = () => {
  const location = useLocation()
  const { isDark } = useTheme()

  const defaultSoilData = {
    soil_type: "Alluvial Soil",
    description: "Very fertile river-deposited soil — one of the best soils for a kitchen garden.",
    recommended_plants: [
      { name: "Tomato", reason: "Thrives in nutrient-rich, loose alluvial mix", difficulty: "beginner", sunlight: "6-8 hrs", water: "Daily" },
      { name: "Spinach (Palak)", reason: "Fast harvest (30 days), loves moist fertile soil", difficulty: "beginner", sunlight: "3-5 hrs", water: "Keep moist" },
      { name: "Coriander (Dhaniya)", reason: "Quick harvest, perfect for moist alluvial pots", difficulty: "beginner", sunlight: "4-5 hrs", water: "Light daily mist" }
    ],
    terrace_tip: "Mix 20% vermicompost into pots. Alluvial soil stays moist — poke a finger 1 inch deep, water only if dry."
  }

  const soilData = location.state?.soilData || defaultSoilData
  const isFromUpload = location.state?.fromUpload

  const [cropData, setCropData] = useState(null)
  const [cropError, setCropError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setCropData(null)
    setCropError(null)

    fetchCropRecommendations(soilData.soil_type)
      .then((data) => { if (!cancelled) setCropData(data) })
      .catch((err) => {
        if (!cancelled) setCropError(err.response?.data?.detail || "Crop advisor unavailable — is the backend running?")
      })

    return () => { cancelled = true }
  }, [soilData.soil_type])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">

        {/* Header — NO toggle here anymore (it lives in the Navbar) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              🌱 Terrace Garden Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Personalized crop guidance and rooftop microclimate care for your plants
            </p>
          </div>

          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl shadow-sm transition"
          >
            📸 Analyze New Soil
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* Weather strip: follows app theme (night-styled in dark mode) */}
        <WeatherCard forceNight={isDark ? true : null} />

        {/* AI Crop Advisor */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Wheat size={18} className="text-green-600 dark:text-green-400" /> AI Crop Advisor
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Random Forest picks for <b>{cropData?.soil || soilData.soil_type}</b>
              {cropData?.location ? ` in ${cropData.location}` : ""}
              {cropData?.temperature != null ? ` (${cropData.temperature}°C, ${cropData.condition})` : ""}
            </p>
          </div>

          {cropError ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">⚠️ {cropError}</p>
          ) : !cropData ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Asking the AI advisor...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cropData.top_crops.map((c, i) => (
                <CropCard key={i} crop={c} />
              ))}
            </div>
          )}
        </section>

        {/* Best plants for the soil */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Sprout size={18} className="text-green-600 dark:text-green-400" /> Best Plants for Your Soil ({soilData.soil_type})
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Curated for terrace pots and containers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {soilData.recommended_plants.map((plant, index) => (
              <PlantCard key={index} plant={plant} />
            ))}
          </div>
        </section>

        {/* Care Schedule */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Droplet size={18} className="text-blue-500 dark:text-blue-400" /> Rooftop Care Schedule
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
              <p className="font-semibold text-blue-900 dark:text-blue-200 text-sm">⏰ Morning Watering (6 - 8 AM)</p>
              <p className="text-blue-700 dark:text-blue-300 text-xs mt-1">Prevents quick water loss due to terrace floor heating.</p>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/50">
              <p className="font-semibold text-amber-900 dark:text-amber-200 text-sm">☀️ Peak Sun Protection (12 - 3 PM)</p>
              <p className="text-amber-700 dark:text-amber-300 text-xs mt-1">Use green shade netting for delicate herbs like mint & coriander.</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800/50">
              <p className="font-semibold text-green-900 dark:text-green-200 text-sm">🌿 Organic Compost Cycle</p>
              <p className="text-green-700 dark:text-green-300 text-xs mt-1">Add 2 handfuls of vermicompost per pot every 15-20 days.</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

export default Dashboard