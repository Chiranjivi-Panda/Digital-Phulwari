import axios from 'axios'
import { API_BASE } from './apiConfig'



export const fetchCropRecommendations = async (soilType) => {
  const params = new URLSearchParams({ soil: soilType })
  const { data } = await axios.get(`${API_BASE}/api/recommend?${params.toString()}`)
  return data
  // Shape: { success, soil, location, temperature, condition, top_crops: [...] }
}