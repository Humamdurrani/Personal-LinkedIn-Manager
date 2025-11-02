import React from 'react';
import { Tool } from '../types';

interface ToolSelectorProps {
  selectedTool: Tool;
  setSelectedTool: (tool: Tool) => void;
}

const tools: { id: Tool; name: string; description: string }[] = [
  { id: 'profile-optimizer', name: 'Profile Optimizer', description: 'Enhance your bio, picture, and banner.' },
  { id: 'content-strategy', name: 'Content Strategy', description: 'Plan a week of engaging content.' },
  { id: 'post-writer', name: 'Post Writer', description: 'Draft compelling posts from your ideas.' },
  { id: 'carousel-creator', name: 'Carousel Creator', description: 'Design scroll-stopping carousels.' },
  { id: 'post-time-finder', name: 'Post Time Finder', description: 'Discover the best times to post.' },
  { id: 'content-library', name: 'Content Library', description: 'Review and manage your saved content.' },
  { id: 'performance-tracker', name: 'Performance Tracker', description: 'Analyze your content\'s engagement.' },
];

const ToolSelector: React.FC<ToolSelectorProps> = ({ selectedTool, setSelectedTool }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex flex-wrap gap-2">
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={() => setSelectedTool(tool.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedTool === tool.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tool.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToolSelector;
