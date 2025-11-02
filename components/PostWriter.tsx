import React, { useState } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { generateContent } from '../services/geminiService';
import { StoredContent } from '../types';
import { saveContent, updateContent } from '../services/localStorageService';

const MIN_LENGTH = 10;

const PostWriter: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [postType, setPostType] = useState('Thought Leadership Text Posts');
  const [post, setPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedItem, setSavedItem] = useState<StoredContent | null>(null);

  const postTypes = [
    "Thought Leadership Text Posts (Personal Stories + Insights)",
    "How-To Guides & Actionable Tips",
    "Industry News + Your Commentary (Newsjacking)",
    "Lessons Learned / Failure Stories",
    "Resource Curation & Lists",
  ];

  const handleGeneratePost = async () => {
    const trimmedIdea = idea.trim();
    if (!trimmedIdea) {
      setError('Please enter a post idea or topic.');
      return;
    }
    if (trimmedIdea.length < MIN_LENGTH) {
        setError(`Your post idea should be at least ${MIN_LENGTH} characters long to generate a quality post.`);
        return;
    }
    setIsLoading(true);
    setError(null);
    setPost('');
    setSavedItem(null);

    const prompt = `
      Write a LinkedIn post based on the following idea: "${idea}".
      The post should be in the style of "${postType}".
      Adhere strictly to the best practices and structure outlined for this post type in the 2025 LinkedIn strategy document.
      Ensure it has a strong hook, provides value, and ends with a call-to-action to encourage comments. Use appropriate formatting like line breaks and symbols.
    `;

    try {
      const result = await generateContent(prompt);
      setPost(result);
    } catch (err) {
      setError('An error occurred while writing the post. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    const newItem: StoredContent = {
      id: crypto.randomUUID(),
      tool: 'post',
      prompt: idea,
      content: post,
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
    <Card title="Post Writer">
      <div className="space-y-4">
        <p className="text-gray-600">
          Provide an idea or topic, select a post type, and our AI will draft a compelling LinkedIn post for you.
        </p>
        <div>
          <label htmlFor="post-idea" className="block text-sm font-medium text-gray-700">Post Idea</label>
          <textarea
            id="post-idea"
            value={idea}
            onChange={(e) => {
              setIdea(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g., A lesson I learned about fundraising after a major rejection."
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1"
            rows={3}
          />
        </div>
        <div>
          <label htmlFor="post-type" className="block text-sm font-medium text-gray-700">Post Type</label>
          <select
            id="post-type"
            value={postType}
            onChange={(e) => setPostType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1"
          >
            {postTypes.map(type => <option key={type} value={type}>{type.split('(')[0].trim()}</option>)}
          </select>
        </div>
        <Button onClick={handleGeneratePost} isLoading={isLoading} disabled={!idea.trim()}>
          Write Post
        </Button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {isLoading && <p className="text-gray-500 mt-2">Crafting your post...</p>}
        {post && (
          <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Generated Post:</h3>
            <textarea
              readOnly
              value={post}
              className="w-full p-2 border-none bg-gray-50 rounded-md font-sans text-gray-700"
              rows={15}
            />
            <div className="mt-4 pt-4 border-t flex items-center gap-4">
              {savedItem ? (
                <>
                  <p className="text-sm font-medium text-gray-700">Rate this post:</p>
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

export default PostWriter;