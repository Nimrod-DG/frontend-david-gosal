import { createSlice } from '@reduxjs/toolkit';
import { createTheme } from '@mui/material/styles';

const savedMode = localStorage.getItem('themeMode') || 'light';

const initialTheme = createTheme({
  palette: {
    mode: savedMode,
  },
});

export const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    currentTheme: initialTheme,
    mode: savedMode,
  },
  reducers: {
    toggleTheme: (state) => {
      const newMode = state.mode === 'light' ? 'dark' : 'light';
      state.mode = newMode;
      state.currentTheme = createTheme({
        palette: {
          mode: newMode,
        },
      });
      localStorage.setItem('themeMode', newMode);
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      state.currentTheme = createTheme({
        palette: {
          mode: action.payload,
        },
      });
      localStorage.setItem('themeMode', action.payload);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
