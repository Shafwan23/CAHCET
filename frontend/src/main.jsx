import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import GlobalErrorBoundary from './components/ui/GlobalErrorBoundary'
import './styles/globals.css' // Ensure styles are loaded here just in case

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </React.StrictMode>,
)
