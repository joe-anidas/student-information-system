import React from 'react';
import Navbar from './Navbar';

function PageLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16 p-8">
        <div className="max-w-7xl mx-auto">
          {title && (
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
              {subtitle && <p className="text-gray-600 text-lg">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export default PageLayout;
