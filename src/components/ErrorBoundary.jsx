import React from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('mic_hackathon_active_event');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F4F8FC] p-6 text-[#182A43]">
          <div className="max-w-md w-full bg-white/95 rounded-3xl p-8 border border-red-300 shadow-2xl text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-orbitron font-bold text-[#182A43] mb-2">
              Display Recovery Mode
            </h2>
            <p className="text-xs text-gray-600 font-sans mb-6">
              An unexpected display error occurred. You can restore the normal state immediately.
            </p>
            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#3879C9] text-white font-rajdhani font-bold text-sm shadow-md hover:brightness-110 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restore Hackathon Display</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
