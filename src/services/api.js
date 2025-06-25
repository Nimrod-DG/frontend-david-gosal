import axios from 'axios'

const BASE_URL = 'http://202.157.176.100:3001'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

const isValidEntry = (entry, nameField, idField = null) => {
  const name = entry[nameField]?.trim()
  
  const validName = typeof name === 'string' && 
                   name.length > 0 && 
                   name !== 'string' && 
                   !/\d/.test(name)
  

  const validId = idField ? 
                  (entry[idField] !== undefined && 
                   entry[idField] !== null &&
                   !isNaN(entry[idField])) : true
                   
  return validName && validId
}

api.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
)

api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.')
    }
    
    const status = error.response?.status
    const url = error.config?.url
    
    if (status === 404) {
      throw new Error(`Data not found (${url})`)
    }
    
    if (status >= 500) {
      throw new Error('Server error. Please try again later.')
    }
    
    throw new Error(error.message || 'An error occurred.')
  }
)

export const apiService = {
  getCountries: async () => {
    const response = await api.get('/negaras')
    return response.data.filter(country => 
      isValidEntry(country, 'nama_negara', 'id_negara'))
  },

  getPortsByCountry: async (countryId) => {
    const response = await api.get('/pelabuhans')
    return response.data.filter(port => 
      isValidEntry(port, 'nama_pelabuhan', 'id_pelabuhan') && 
      Number(port.id_negara) === Number(countryId))
  },

  getGoodsByPort: async (portId) => {
    const response = await api.get('/barangs')
    const portIdNum = Number(portId)
    
    return response.data.filter(good => 
      isValidEntry(good, 'nama_barang', 'id_barang') && 
      Number(good.id_pelabuhan) === portIdNum)
  }
}

export default api