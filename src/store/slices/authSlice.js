import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  user: JSON.parse(localStorage.getItem('user')) || null,
  loading: false,
  error: null,
}

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const existingUser = users.find(u => u.email === userData.email)
      
      if (existingUser) {
        throw new Error('User already exists with this email')
      }
      
      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        password: btoa(userData.password),
      }
      
      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))
      return { email: newUser.email, name: newUser.name }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const user = users.find(u => u.email === credentials.email)
      
      if (user && atob(user.password) === credentials.password) {
        return { email: user.email, name: user.name }
      } else {
        throw new Error('Invalid email or password')
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('user')
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('user', JSON.stringify(action.payload))
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer