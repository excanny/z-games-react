import {

  WifiOff,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ErrorDisplay = ({ error }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-slate-50">
    <div className="text-center max-w-md mx-auto p-8">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <WifiOff className="w-10 h-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-3">
        Error Loading Game Session
      </h2>
      <p className="text-slate-600 mb-6">{error || 'An unexpected error occurred.'}</p>
      <div className="space-y-3">
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
        <Link
          to="/"
          className="w-full text-slate-600 hover:text-slate-800 transition-colors flex items-center justify-center gap-2 py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  </div>
);

export default ErrorDisplay;
