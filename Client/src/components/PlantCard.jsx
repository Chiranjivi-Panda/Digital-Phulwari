import React from 'react'
import { Sun, Droplets, Sparkles } from 'lucide-react'

const PlantCard = ({ plant }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-green-100 dark:border-green-900/50 hover:shadow-lg transition-all flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{plant.name}</h3>
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
            plant.difficulty === 'beginner'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
          }`}>
            {plant.difficulty || 'beginner'}
          </span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex items-start gap-1">
          <Sparkles size={16} className="text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
          <span>{plant.reason}</span>
        </p>
      </div>

      <div className="pt-3 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/30 p-2 rounded-lg text-amber-900 dark:text-amber-200">
          <Sun size={15} className="text-amber-500 shrink-0" />
          <span>{plant.sunlight || '6-8 hrs'}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg text-blue-900 dark:text-blue-200">
          <Droplets size={15} className="text-blue-500 shrink-0" />
          <span>{plant.water || 'Daily'}</span>
        </div>
      </div>
    </div>
  )
}

export default PlantCard