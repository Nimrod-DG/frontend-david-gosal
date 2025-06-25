import { Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      display="flex"
      justifyContent="center"
      zIndex={1300}
      sx={{
        animation: 'fadeIn 0.3s ease-out',
        '@keyframes fadeIn': {
          '0%': { opacity: 0, transform: 'translateY(-20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={1}
        bgcolor="background.paper"
        boxShadow="0px 2px 8px rgba(0, 0, 0, 0.1)"
        borderRadius="0 0 6px 6px"
        minWidth={200}
        maxWidth="90vw"
        sx={{
          borderTop: 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <Box display="flex" alignItems="center">
          <CircularProgress 
            size={24} 
            thickness={4}
            sx={{ 
              color: 'primary.main',
              animationDuration: '800ms' 
            }} 
          />
          <Typography 
            variant="subtitle2" 
            color="text.primary"
            sx={{ 
              ml: 1.5,
              fontWeight: 500,
              fontSize: '0.8rem',
              letterSpacing: '0.3px'
            }}
          >
            {message}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoadingSpinner;