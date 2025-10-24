import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './hooks/useAuth'

createRoot(document.getElementById('root')).render(
  // Removed StrictMode to avoid double-mount side effects in development
  <BrowserRouter>
    <AuthProvider>
      <App />
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </AuthProvider>
  </BrowserRouter>
)
