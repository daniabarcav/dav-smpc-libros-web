import React from 'react'
import ReactDOM from 'react-dom/client'
import { CssBaseline, ThemeProvider, Container } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import theme from './theme'
import { AuthProvider } from './state/auth'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Container maxWidth="lg" sx={{ py: 3 }}>
            <App />
          </Container>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
)
