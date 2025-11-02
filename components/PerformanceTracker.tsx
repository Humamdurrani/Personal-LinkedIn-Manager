import React from 'react';
import Card from './common/Card';

const PerformanceTracker: React.FC = () => {
  return (
    <Card title="Performance Tracker">
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-gray-700">Feature Coming Soon!</h3>
        <p className="text-gray-500 mt-2">
          Soon, you'll be able to connect your LinkedIn account to track the performance of your generated content right here.
        </p>
        <div className="mt-6">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        </div>
      </div>
    </Card>
  );
};

export default PerformanceTracker;
