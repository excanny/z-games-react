import React from 'react';
import { Trophy } from 'lucide-react';

const LoadingSpinner = ({ longLoading }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
    <div className="text-center">
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="animate-spin rounded-full h-full w-full border-4 border-blue-200 border-t-blue-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Trophy className="w-8 h-8 text-blue-600" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-slate-700 mb-2">
        Loading Game Session Data
      </h3>
      <p className="text-slate-500">Connecting to live server...</p>
      {longLoading && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg max-w-sm mx-auto">
          <p className="text-amber-700 text-sm">
            Taking longer than expected. Please check your connection.
          </p>
        </div>
      )}
    </div>
  </div>
);

export default LoadingSpinner;
