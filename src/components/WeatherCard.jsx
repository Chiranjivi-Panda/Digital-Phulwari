import { Cloud, CloudRain, Sun, AlertCircle } from 'lucide-react'

const WeatherCard = ({ weather }) => {
  const getWeatherIcon = (condition) => {
    if (condition?.toLowerCase().includes('rain')) return <CloudRain className="text-blue-500" size={32} />
    if (condition?.toLowerCase().includes('clear') || condition?.toLowerCase().includes('sun')) return <Sun className="text-yellow-500" size={32} />
    return <Cloud className="text-gray-500" size={32} />
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Weather</h2>
        {getWeatherIcon(weather?.condition)}
      </div>
      {weather ? (
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Temperature</span>
            <span className="font-semibold">{weather.temperature}°C</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Condition</span>
            <span className="font-semibold">{weather.condition}</span>
          </div>
          {weather.alerts && weather.alerts.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <AlertCircle size={16} />
                <span>Alerts</span>
              </div>
              {weather.alerts.map((alert, idx) => (
                <div key={idx} className="bg-yellow-50 border-l-4 border-yellow-400 p-2 text-sm">
                  {alert}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500">Loading weather data...</p>
      )}
    </div>
  )
}

export default WeatherCard
