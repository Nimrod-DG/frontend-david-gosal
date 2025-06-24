import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  countries: [],
  ports: [],
  goods: [],
  selectedCountry: null,
  selectedPort: null,
  selectedGood: null,
  loading: false,
  error: null,
}

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setCountries: (state, action) => {
      state.countries = action.payload
    },
    setPorts: (state, action) => {
      state.ports = action.payload
    },
    setGoods: (state, action) => {
      state.goods = action.payload
    },
    setSelectedCountry: (state, action) => {
      state.selectedCountry = action.payload
    },
    setSelectedPort: (state, action) => {
      state.selectedPort = action.payload
    },
    setSelectedGood: (state, action) => {
      state.selectedGood = action.payload
    },
    resetPorts: (state) => {
      state.ports = []
      state.selectedPort = null
      state.goods = []
      state.selectedGood = null
    },
    resetGoods: (state) => {
      state.goods = []
      state.selectedGood = null
    },
    clearForm: (state) => {
      state.selectedCountry = null
      state.selectedPort = null
      state.selectedGood = null
      state.ports = []
      state.goods = []
    },
  },
})

export const {
  setLoading,
  setError,
  setCountries,
  setPorts,
  setGoods,
  setSelectedCountry,
  setSelectedPort,
  setSelectedGood,
  resetPorts,
  resetGoods,
  clearForm,
} = formSlice.actions

export default formSlice.reducer