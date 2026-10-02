import axios from 'axios'
import { API_BASE } from './apiConfig'



export const sendChatMessage = async (messages, soilContext = null) => {
  const { data } = await axios.post(`${API_BASE}/api/chat`, {
    messages: messages.map((m) => ({
      role: m.isUser ? 'user' : 'bot',
      text: m.text,
    })),
    soil_context: soilContext,
  })
  return data.reply
}