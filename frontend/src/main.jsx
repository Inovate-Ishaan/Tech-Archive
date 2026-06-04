import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import CreatePasswordPage from './pages/createPassword'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CreatePasswordPage />
    <RegisterPage />
    <LoginPage />
  </StrictMode>
)
