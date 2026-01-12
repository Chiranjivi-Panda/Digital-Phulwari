import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'

const SoilUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    setSelectedImage(file)
    
    // Create preview
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
    
    // Simulate API call (replace with actual API call later)
    setTimeout(() => {
      toast.success('Soil image uploaded successfully!')
      setLoading(false)
      // Navigate to dashboard with mock soil type
      navigate('/dashboard', { 
        state: { 
          soilType: 'loamy',
          fromUpload: true 
        } 
      })
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Upload Soil Image</h1>
          <p className="text-gray-600 mb-8">
            Take a clear photo of your soil to identify its type and get personalized recommendations
          </p>

          {/* Upload Area */}
          <div className="mb-6">
            {!preview ? (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-primary-300 rounded-lg cursor-pointer bg-primary-50 hover:bg-primary-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="text-primary-600 mb-4" size={48} />
                  <p className="mb-2 text-sm text-gray-600">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
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
                <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={preview}
                    alt="Soil preview"
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Upload Button */}
          <div className="flex justify-center space-x-4">
            {preview && (
              <button
                onClick={handleRemoveImage}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Remove Image
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={!selectedImage || loading}
              className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                !selectedImage || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <span className="animate-spin">⏳</span>
                  <span>Analyzing...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <ImageIcon size={20} />
                  <span>Analyze Soil</span>
                </span>
              )}
            </button>
          </div>

          {/* Tips */}
          <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <h3 className="font-semibold text-blue-800 mb-2">💡 Tips for best results:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Take photo in good lighting</li>
              <li>• Ensure soil is visible and in focus</li>
              <li>• Remove any debris or large objects</li>
              <li>• Take a close-up shot of the soil</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SoilUpload
