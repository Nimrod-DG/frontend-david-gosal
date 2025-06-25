import { createSlice } from '@reduxjs/toolkit';

const savedMode = localStorage.getItem('themeMode') || 'light';

export const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: savedMode,
  },
  reducers: {
    toggleTheme: (state) => {
      const newMode = state.mode === 'light' ? 'dark' : 'light';
      state.mode = newMode;
      localStorage.setItem('themeMode', newMode);
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem('themeMode', action.payload);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;