import React from 'react';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Global App Crash Caught:", error, errorInfo);
    
    // Check if we already tried to auto-recover to prevent infinite reload loops
    const hasReloaded = sessionStorage.getItem('cahcet_auto_recover');
    
    if (!hasReloaded) {
      console.log("Attempting to auto-recover by clearing localStorage and reloading...");
      sessionStorage.setItem('cahcet_auto_recover', 'true');
      
      // Clear localStorage which might have malformed legacy data poisoning state
      localStorage.clear();
      
      // Force a hard reload from the server (helps fix ChunkLoadError from old cached index.html)
      window.location.reload(true);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-100">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-3">Oops! Something went wrong</h1>
            <p className="text-slate-600 mb-8 leading-relaxed">
              We encountered an unexpected error while loading the page. This is usually caused by an outdated cache.
            </p>
            <button 
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.reload(true);
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-6 rounded-xl transition-colors focus:outline-none focus:ring-4 focus:ring-slate-900/20"
            >
              Reset and Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default GlobalErrorBoundary;
