import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/plus-jakarta-sans/700.css'
import '@fontsource/plus-jakarta-sans/800.css'
import '@fontsource/jetbrains-mono/500.css'
import './styles/tailwind.css'
import './styles/globals.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
