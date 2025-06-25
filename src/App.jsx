import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/Layout/Layout';
import React, { useMemo } from 'react';
import Login from './pages/Login/Login';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import FormPage from './pages/FormPage/FormPage';
import { Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { Toaster } from 'react-hot-toast';

function AppWrapper() {
  const { mode } = useSelector((state) => state.theme);
  
  const currentTheme = useMemo(() => 
    createTheme({
      palette: {
        mode,
      },
    }), 
    [mode]
  );

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <App />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </ThemeProvider>
  );
}

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const theme = useTheme();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          <Box sx={{ 
            backgroundColor: theme.palette.background.default,
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center'
          }}>
            {!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
          </Box>
        } 
      />
      <Route 
        path="/register" 
        element={
          <Box sx={{ 
            backgroundColor: theme.palette.background.default,
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center'
          }}>
            {!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />}
          </Box>
        } 
      />
      <Route 
        path="/" 
        element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="form" element={<FormPage />} />
      </Route>
    </Routes>
  );
}

export default AppWrapper;