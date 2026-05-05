import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('App crashed:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div
        role="alert"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif',
          color: '#1f2328',
          backgroundColor: '#ffffff',
        }}
      >
        <h1 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 8px' }}>
          Something went wrong.
        </h1>
        <p style={{ margin: '0 0 16px', color: '#656d76' }}>
          The editor stopped responding. Reload the page to recover.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            fontFamily: 'inherit',
            border: '1px solid #d0d7de',
            borderRadius: '6px',
            backgroundColor: '#f6f8fa',
            color: '#1f2328',
            cursor: 'pointer',
          }}
        >
          Reload
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
