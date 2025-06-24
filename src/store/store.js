import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import themeReducer from './slices/themeSlice'
import formReducer from './slices/formSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    form: formReducer,
  },
})