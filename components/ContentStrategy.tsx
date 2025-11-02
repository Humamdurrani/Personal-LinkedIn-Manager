import React, { useState } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { generateContent } from '../services/geminiService';
import { saveContent, updateContent } from '../services/localStorageService';
import { StoredContent } from '../types';

const MIN_LENGTH = 5;

const ContentStrategy: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [strategy, setStrategy] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedItem, setSavedItem] = useState<StoredContent | null>(null);

  const handleGenerateStrategy = async () => {
    const trimmedTopic = topic.trim();
    if (!trimmedTopic) {
      setError('Please enter a topic or theme.');
      return;
    }
    if (trimmedTopic.length < MIN_LENGTH) {
      setError(`Please provide a more descriptive topic (at least ${MIN_LENGTH} characters).`);
      return;
    }
    setIsLoading(true);
    setError(null);
    setStrategy('');
    setSavedItem(null);

    const prompt = `
      Generate a 1-week LinkedIn content strategy for the following topic: "${topic}".
      The strategy should be based on the provided 2025 LinkedIn strategy document.
      Include a mix of 3 post types from the document (e.g., Thought Leadership, How-To Guide, Poll).
      For each post, provide:
      1. The post type.
      2. A compelling hook.
      3. A brief outline of the content.
      4. Suggested hashtags (max 3).
      5. The best day to post (e.g., Monday, Wednesday, Friday).
    `;

    try {
      const result = await generateContent(prompt);
      setStrategy(result);
    } catch (err)
    {
      setError('An error occurred while generating the content strategy. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSave = () => {
    const newItem: StoredContent = {
      id: crypto.randomUUID(),
      tool: 'strategy',
      prompt: topic,
      content: strategy,
      rating: null,
      timestamp: Date.now(),
    };
    saveContent(newItem);
    setSavedItem(newItem);
  };

  const handleRate = (rating: 'good' | 'bad') => {
    if (savedItem) {
      const updatedItem = { ...savedItem, rating };
      updateContent(savedItem.id, { rating });
      setSavedItem(updatedItem);
    }
  };


  return (
    <Card title="Content Strategy">
      <div className="space-y-4">
        <p className="text-gray-600">
          Enter a core topic or theme for your content. Our AI strategist will generate a 1-week content plan with post ideas and formats.
        </p>
        <input
          type="text"
          value={topic}
          onChange={(e) => {
            setTopic(e.target.value);
            if (error) setError(null);
          }}
          placeholder="e.g., AI Ethics in Healthcare"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <Button onClick={handleGenerateStrategy} isLoading={isLoading} disabled={!topic.trim()}>
          Generate Strategy
        </Button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {isLoading && <p className="text-gray-500 mt-2">Developing your content strategy...</p>}
        {strategy && (
          <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Your 1-Week Content Strategy:</h3>
            <pre className="whitespace-pre-wrap font-sans text-gray-700">{strategy}</pre>
            
            <div className="mt-4 pt-4 border-t flex items-center gap-4">
              {savedItem ? (
                <>
                  <p className="text-sm font-medium text-gray-700">Rate this strategy:</p>
                  <button onClick={() => handleRate('good')} className={`px-3 py-1 rounded-md text-sm ${savedItem.rating === 'good' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>👍 Good</button>
                  <button onClick={() => handleRate('bad')} className={`px-3 py-1 rounded-md text-sm ${savedItem.rating === 'bad' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>👎 Bad</button>
                </>
              ) : (
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">Save to Library</Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ContentStrategy;