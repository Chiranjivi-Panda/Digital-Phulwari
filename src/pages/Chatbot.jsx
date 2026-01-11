import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User } from 'lucide-react'
import ChatMessage from '../components/ChatMessage'
import toast from 'react-hot-toast'

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your gardening assistant. How can I help you today? 🌱",
      isUser: false,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')
    
    // Add user message
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }])
    setLoading(true)

    // Simulate API call (replace with actual API call later)
    setTimeout(() => {
      // Mock responses based on common questions
      let botResponse = "I'm here to help with your gardening questions! "
      
      const lowerMessage = userMessage.toLowerCase()
      if (lowerMessage.includes('water') || lowerMessage.includes('watering')) {
        botResponse = "Water your plants early in the morning or evening. Most plants need 2-3 liters of water per day, but this varies based on the plant type and weather. Check the soil moisture by inserting your finger - if it's dry, it's time to water! 💧"
      } else if (lowerMessage.includes('soil') || lowerMessage.includes('earth')) {
        botResponse = "Good soil is the foundation of healthy plants! For rooftop gardening, use a mix of garden soil, compost, and cocopeat. Make sure your containers have good drainage. You can upload a soil image on the Upload page to get specific recommendations! 🌱"
      } else if (lowerMessage.includes('sunlight') || lowerMessage.includes('sun')) {
        botResponse = "Most vegetables need 6-8 hours of direct sunlight. Place your plants on the sunniest part of your rooftop or terrace. If you notice leaves turning yellow, they might be getting too much sun. Move them to a partially shaded area. ☀️"
      } else if (lowerMessage.includes('fertilizer') || lowerMessage.includes('compost')) {
        botResponse = "Use organic compost or vermicompost every 2-3 weeks. You can make your own compost from kitchen waste! Avoid chemical fertilizers if possible - organic is better for your health and the environment. 🍃"
      } else if (lowerMessage.includes('pest') || lowerMessage.includes('insect')) {
        botResponse = "For pest control, use neem oil spray - it's natural and effective! Mix 5ml neem oil with 1 liter of water and spray on leaves weekly. You can also plant marigolds near your vegetables to repel pests naturally. 🐛"
      } else if (lowerMessage.includes('tomato') || lowerMessage.includes('tomatoes')) {
        botResponse = "Tomatoes are great for beginners! They need loamy soil, 6-8 hours of sunlight, and regular watering. Support them with stakes as they grow. You'll see fruits in 60-80 days. Remember to water at the base, not on leaves! 🍅"
      } else if (lowerMessage.includes('beginner') || lowerMessage.includes('start')) {
        botResponse = "Great that you're starting! Easy plants for beginners: Tomatoes, Basil, Spinach, and Radish. Start with good quality seeds, use proper containers with drainage, and don't overwater. Check the Dashboard for personalized recommendations based on your soil type! 🌿"
      } else {
        botResponse = "That's a great question! For rooftop gardening in India, make sure to use lightweight containers, provide good drainage, and water regularly. Check your Dashboard for plant recommendations, or ask me about specific plants or care tips! 🌻"
      }

      setMessages((prev) => [...prev, { text: botResponse, isUser: false }])
      setLoading(false)
    }, 1000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 8rem)' }}>
          {/* Header */}
          <div className="bg-primary-600 text-white p-4 flex items-center space-x-3">
            <div className="bg-primary-700 p-2 rounded-full">
              <Bot size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold">Gardening Assistant</h1>
              <p className="text-sm text-primary-100">Ask me anything about gardening!</p>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 chat-container bg-gray-50">
            {messages.map((message, idx) => (
              <ChatMessage key={idx} message={message.text} isUser={message.isUser} />
            ))}
            {loading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-200 text-gray-800 rounded-lg rounded-bl-none px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message... (e.g., How often should I water tomatoes?)"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  !input.trim() || loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Try asking about: watering, soil, sunlight, fertilizers, or specific plants
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chatbot
