import React, { useState } from 'react';
import Header from './components/Header';
import ToolSelector from './components/ToolSelector';
import ProfileOptimizer from './components/ProfileOptimizer';
import ContentStrategy from './components/ContentStrategy';
import PostWriter from './components/PostWriter';
import CarouselCreator from './components/CarouselCreator';
import PostTimeFinder from './components/PostTimeFinder';
import ContentLibrary from './components/ContentLibrary';
import PerformanceTracker from './components/PerformanceTracker';
import { Tool } from './types';

const App: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<Tool>('profile-optimizer');

  const renderTool = () => {
    switch (selectedTool) {
      case 'profile-optimizer':
        return <ProfileOptimizer />;
      case 'content-strategy':
        return <ContentStrategy />;
      case 'post-writer':
        return <PostWriter />;
      case 'carousel-creator':
        return <CarouselCreator />;
      case 'post-time-finder':
        return <PostTimeFinder />;
      case 'content-library':
        return <ContentLibrary />;
      case 'performance-tracker':
        return <PerformanceTracker />;
      default:
        return <ProfileOptimizer />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Header />
      <main className="container mx-auto px-4 md:px-8 py-8">
        <ToolSelector selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
        <div className="mt-8">
          {renderTool()}
        </div>
      </main>
    </div>
  );
};

export default App;
