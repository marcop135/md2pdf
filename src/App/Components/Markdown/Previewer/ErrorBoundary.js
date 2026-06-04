import React from 'react';
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Preview crashed:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div>
          <p>Error occurs</p>
          <button
            type="button"
            onClick={() => {
              window.location.reload();
            }}
            style={{
              background: 'none',
              padding: '5px',
              borderRadius: '5px',
              boxShadow: '1px 1px 1px grey',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            Reload This Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
