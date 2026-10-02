import { useState, useRef, useEffect } from 'react'
import { Send, Bot } from 'lucide-react'
import ChatMessage from '../components/ChatMessage'
import { sendChatMessage } from '../services/geminiService'

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
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')

    const next = [...messages, { text: userMessage, isUser: true }]
    setMessages(next)
    setLoading(true)

    try {
      const soilContext = localStorage.getItem('phulwari_soil')
      const reply = await sendChatMessage(next, soilContext)
      setMessages((prev) => [...prev, { text: reply, isUser: false }])
    } catch (err) {
      console.error('Chat error:', err)
      setMessages((prev) => [...prev, {
        text: "Sorry, I'm having trouble connecting right now. Is the backend running? 🌱",
        isUser: false,
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col border border-gray-100 dark:border-gray-700" style={{ height: 'calc(100vh - 8rem)' }}>
          {/* Header */}
          <div className="bg-primary-600 dark:bg-gray-900 text-white p-3 flex items-center space-x-3 border-b border-gray-200 dark:border-gray-700">
            <div className="bg-primary-700 dark:bg-primary-800 p-1.5 rounded-full">
              <Bot size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold">Gardening Assistant</h1>
              <p className="text-xs text-primary-100 dark:text-gray-400">Ask me anything about gardening!</p>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 chat-container bg-gray-50 dark:bg-gray-900">
            {messages.map((message, idx) => (
              <ChatMessage key={idx} message={message.text} isUser={message.isUser} />
            ))}
            {loading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg rounded-bl-none px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message... (e.g., How often should I water tomatoes?)"
                className="flex-1 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                  !input.trim() || loading
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Try asking about: watering, soil, sunlight, fertilizers, or specific plants
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chatbot