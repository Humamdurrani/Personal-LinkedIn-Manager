import React, { useState, useEffect } from 'react';
import Card from './common/Card';
import { getContent, deleteContent } from '../services/localStorageService';
import { StoredContent } from '../types';

const ContentLibrary: React.FC = () => {
  const [library, setLibrary] = useState<StoredContent[]>([]);
  const [filter, setFilter] = useState<'all' | 'strategy' | 'post'>('all');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = () => {
    const content = getContent();
    // Sort by most recent first
    content.sort((a, b) => b.timestamp - a.timestamp);
    setLibrary(content);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteContent(id);
      loadContent(); // Refresh the list
    }
  };

  const filteredLibrary = library.filter(item => {
    if (filter === 'all') return true;
    return item.tool === filter;
  });

  const getToolName = (tool: 'strategy' | 'post') => {
    switch (tool) {
      case 'strategy':
        return 'Content Strategy';
      case 'post':
        return 'Post';
      default:
        return 'Item';
    }
  };

  return (
    <Card title="Content Library">
      <div className="mb-6 border-b pb-4">
        <p className="text-gray-600 mb-2">Filter by content type:</p>
        <div className="flex gap-2">
            <button onClick={() => setFilter('all')} className={`px-3 py-1 text-sm rounded-md ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>All</button>
            <button onClick={() => setFilter('strategy')} className={`px-3 py-1 text-sm rounded-md ${filter === 'strategy' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Strategies</button>
            <button onClick={() => setFilter('post')} className={`px-3 py-1 text-sm rounded-md ${filter === 'post' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Posts</button>
        </div>
      </div>
      
      <div className="space-y-6">
        {filteredLibrary.length > 0 ? (
          filteredLibrary.map(item => (
            <div key={item.id} className="p-4 border rounded-lg bg-gray-50 shadow-sm relative">
                <button onClick={() => handleDelete(item.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-bold">
                    DELETE
                </button>
                <span className="text-xs font-semibold uppercase text-blue-600 bg-blue-100 px-2 py-1 rounded-full">{getToolName(item.tool)}</span>
                <p className="text-sm text-gray-500 mt-2">
                    <span className="font-semibold">Prompt:</span> {item.prompt}
                </p>
                <div className="mt-3 pt-3 border-t">
                    <h4 className="font-semibold text-gray-800 mb-1">Generated Content:</h4>
                    <pre className="whitespace-pre-wrap font-sans text-gray-700 text-sm bg-white p-2 rounded">{item.content}</pre>
                </div>
                 <div className="mt-3 text-xs text-gray-400 flex justify-between items-center">
                    <span>Saved on: {new Date(item.timestamp).toLocaleDateString()}</span>
                    {item.rating && (
                        <span className={`px-2 py-1 rounded-md text-white ${item.rating === 'good' ? 'bg-green-500' : 'bg-red-500'}`}>
                           {item.rating === 'good' ? '👍 Good' : '👎 Bad'}
                        </span>
                    )}
                 </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">Your content library is empty. Generate and save some content to see it here.</p>
        )}
      </div>
    </Card>
  );
};

export default ContentLibrary;
