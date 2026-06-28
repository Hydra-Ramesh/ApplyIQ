import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import { Toaster } from 'sonner'
import App from './App.tsx'
import { ThemeProvider } from './shared/providers/ThemeProvider'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="applyiq-ui-theme">
        <App />
        <Toaster theme="dark" position="bottom-right" richColors />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
