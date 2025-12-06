import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './contexts/ThemeProvider.tsx'
import { Toaster } from 'sonner'
import { TweakcnThemeTester } from './components/dev/TweakcnThemeTester.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <App />
      <Toaster richColors position="top-right" />
      <TweakcnThemeTester />
    </ThemeProvider>
  </StrictMode>,
)
