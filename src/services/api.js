import axios from 'axios'

const BASE_URL = 'http://202.157.176.100:3001'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.')
    }
    if (error.response?.status === 404) {
    throw new Error(`Data not found (${error.config.url})`);
  }
    if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.')
    }
    throw new Error(error.message || 'An error occurred.')
  }
)

export const apiService = {
  getCountries: async () => {
    try {
      const response = await api.get('/negaras')
      const validCountries = response.data.filter(country => 
      typeof country.nama_negara === 'string' && 
      country.nama_negara.length > 0 && 
      !/^\d+$/.test(country.nama_negara)
    )
      return validCountries
    } catch (error) {
      throw error
    }
  },

  getPortsByCountry: async (countryId) => {
    try {
      const response = await api.get(`/pelabuhans?filter={"where":{"id_negara":${countryId}}}`);
      const validPorts = response.data.filter(port => 
        port.id_negara === countryId.toString() && 
        typeof port.nama_pelabuhan === 'string' && 
        port.nama_pelabuhan.length > 0 && 
        !/^\d+$/.test(port.nama_pelabuhan)
      )
      return validPorts
    } catch (error) {
      throw error
    }
  },

  getGoodsByPort: async (portId) => {
    try {
      const response = await api.get('/barangs')
      if (!response.data) {
        throw new Error('No data received from server')
      }
      
      // Convert portId to number for comparison (some IDs might be strings)
      const portIdNum = Number(portId)
      
      // Filter goods by port ID
      const portGoods = response.data.filter(good => {
        // First check if the good has a valid port ID match
        const goodPortId = Number(good.id_pelabuhan)
        if (goodPortId !== portIdNum) return false
        
        // Then check if it's a valid product (basic validation)
        return (
          typeof good.nama_barang === 'string' && 
          good.nama_barang.trim().length > 0 &&
          !/^\d+$/.test(good.nama_barang.trim()) &&
          good.id_barang > 0
        )
      })
      
      return portGoods
    } catch (error) {
      console.error('Error loading goods:', error)
      throw error
    }
  },


   getAllPorts: async () => {
    try {
      const response = await api.get('/pelabuhans')
      return response.data || []
    } catch (error) {
      console.error('Error fetching ports:', error)
      throw error
    }
  },

  getAllGoods: async () => {
    try {
      const response = await api.get('/barangs')
      return response.data || []
    } catch (error) {
      console.error('Error fetching goods:', error)
      throw error
    }
  }
}

export default api