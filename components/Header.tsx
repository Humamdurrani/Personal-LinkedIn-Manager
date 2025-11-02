import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <h1 className="text-3xl font-bold text-blue-800">LinkedIn Content Co-pilot</h1>
        <p className="text-gray-600">Your AI-powered marketing strategist</p>
      </div>
    </header>
  );
};

export default Header;
