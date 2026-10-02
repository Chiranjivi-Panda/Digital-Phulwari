import axios from 'axios'
import { API_BASE } from './apiConfig'


const DEFAULT_CITY = 'Bhubaneswar'

export const getPreferredCity = () => localStorage.getItem('phulwari_city') || ''
export const setPreferredCity = (city) => localStorage.setItem('phulwari_city', city.trim())

const cache = new Map()
const TTL = 10 * 60 * 1000
const round = (n) => Math.round(n * 100) / 100

export const fetchWeather = async ({ lat, lon, city } = {}) => {
  const useCity = city !== undefined ? city : (getPreferredCity() || DEFAULT_CITY)
  const key = lat != null ? `geo:${round(lat)},${round(lon)}` : `city:${useCity}`
  const hit = cache.get(key)
  if (hit && Date.now() - hit.t < TTL) return hit.data

  const params = new URLSearchParams()
  if (lat != null && lon != null) {
    params.set('lat', lat)
    params.set('lon', lon)
  } else {
    params.set('city', useCity)
  }

  const { data } = await axios.get(`${API_BASE}/api/weather?${params.toString()}`)
  cache.set(key, { data, t: Date.now() })
  return data
}