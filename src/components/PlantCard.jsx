import { Leaf } from 'lucide-react'

const PlantCard = ({ plant }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-3">
        <div className="bg-primary-100 p-3 rounded-full">
          <Leaf className="text-primary-600" size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{plant.name}</h3>
          <p className="text-sm text-gray-600">{plant.description}</p>
          {plant.difficulty && (
            <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
              plant.difficulty === 'beginner' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {plant.difficulty}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default PlantCard
