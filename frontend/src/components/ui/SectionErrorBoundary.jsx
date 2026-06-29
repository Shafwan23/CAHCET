import React from 'react';

class SectionErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`Error rendering section ${this.props.sectionKey}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fail silently and skip section
      return null;
    }
    return this.props.children;
  }
}

export default SectionErrorBoundary;
