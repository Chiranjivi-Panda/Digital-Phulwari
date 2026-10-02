import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { API_BASE } from '../services/apiConfig'

const SoilUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    setSelectedImage(file)

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setPreview(null)
  }

  const handleSubmit = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first')
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('file', selectedImage)

    try {
        const response = await axios.post(`${API_BASE}/api/soil/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (response.data.success) {
        toast.success(`Soil detected: ${response.data.data.soil_type}!`)
        localStorage.setItem('phulwari_soil', response.data.data.soil_type)

        navigate('/dashboard', {
          state: {
            soilData: response.data.data,
            fromUpload: true
          }
        })
      }
    } catch (error) {
      console.error('Soil analysis error:', error)
      toast.error(error.response?.data?.detail || 'Failed to analyze soil. Is backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-green-100 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">📸 Upload Soil Image</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            Take a clear photo of your rooftop garden soil to identify its type and get tailored plant recommendations.
          </p>

          {/* Upload Area */}
          <div className="mb-6">
            {!preview ? (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-green-300 dark:border-gray-600 rounded-lg cursor-pointer bg-green-50/50 dark:bg-gray-700/40 hover:bg-green-100/50 dark:hover:bg-gray-700/60 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="text-green-600 dark:text-green-400 mb-4" size={40} />
                  <p className="mb-2 text-sm text-gray-700 dark:text-gray-200">
                    <span className="font-semibold text-green-700 dark:text-green-400">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, JPEG up to 5MB</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageSelect}
                />
              </label>
            ) : (
              <div className="relative w-full">
                <div className="relative h-64 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border dark:border-gray-600">
                  <img
                    src={preview}
                    alt="Soil preview"
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            {preview && (
              <button
                onClick={handleRemoveImage}
                className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Remove Image
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={!selectedImage || loading}
              className={`px-8 py-2.5 rounded-lg font-medium shadow-md transition-colors ${
                !selectedImage || loading
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <Loader2 className="animate-spin" size={18} />
                  <span>Analyzing Soil with AI...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <ImageIcon size={18} />
                  <span>Analyze Soil</span>
                </span>
              )}
            </button>
          </div>

          {/* Rooftop Tips */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">💡 Tips for best results:</h3>
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
              <li>• Take the photo in natural outdoor daylight</li>
              <li>• Ensure soil surface texture is clear and in focus</li>
              <li>• Remove large dry leaves or foreign stones from the frame</li>
              <li>• Take a close-up shot (15-20 cm away)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SoilUpload