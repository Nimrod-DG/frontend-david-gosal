import { Alert, AlertTitle } from '@mui/material'
import React from 'react'
const ErrorMessage = ({ error, onRetry }) => {
  return (
    <Alert 
      severity="error" 
      action={
        onRetry && (
          <button onClick={onRetry} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            Retry
          </button>
        )
      }
    >
      <AlertTitle>Error</AlertTitle>
      {error || 'Something went wrong. Please try again.'}
    </Alert>
  )
}

export default ErrorMessage