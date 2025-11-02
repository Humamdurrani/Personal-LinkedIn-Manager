import React, { useState } from 'react';
import { CarouselSlide } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import { generateCarouselPlan, generateImage } from '../services/geminiService';
import Spinner from './common/Spinner';

const MIN_LENGTH = 10;

const CarouselCreator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = async () => {
    const trimmedTopic = topic.trim();
    if (!trimmedTopic) {
      setError('Please enter a topic for the carousel.');
      return;
    }
    if (trimmedTopic.length < MIN_LENGTH) {
        setError(`Your carousel topic should be at least ${MIN_LENGTH} characters for a good plan.`);
        return;
    }
    setIsLoadingPlan(true);
    setError(null);
    setSlides([]);

    try {
      const plan = await generateCarouselPlan(topic);
      if (plan && plan.length > 0) {
        setSlides(plan.map((slide: any) => ({ ...slide, isGeneratingImage: false })));
      } else {
        throw new Error("Received an empty or invalid plan.");
      }
    } catch (err) {
      setError('An error occurred while generating the carousel plan. Please try again.');
      console.error(err);
    } finally {
      setIsLoadingPlan(false);
    }
  };

  // FIX: Refactored state updates to be immutable and use functional updates to prevent race conditions.
  const handleGenerateImage = async (index: number) => {
    setSlides(prevSlides => 
      prevSlides.map((slide, i) => 
        i === index ? { ...slide, isGeneratingImage: true, imageUrl: undefined } : slide
      )
    );

    try {
      const visualPrompt = slides[index].visualSuggestion;
      const imageUrl = await generateImage(visualPrompt);
      setSlides(prevSlides => 
        prevSlides.map((slide, i) => 
          i === index ? { ...slide, imageUrl, isGeneratingImage: false } : slide
        )
      );
    } catch (err) {
      console.error(`Error generating image for slide ${index + 1}:`, err);
      // Optionally set an error message on the slide itself
      setSlides(prevSlides => 
        prevSlides.map((slide, i) => 
          i === index ? { ...slide, isGeneratingImage: false } : slide
        )
      );
    }
  };

  return (
    <Card title="Carousel Creator">
      <div className="space-y-4">
        <p className="text-gray-600">
          Enter a topic, and our AI will generate a 5-slide carousel plan. Then, you can generate a unique, professional image for each slide.
        </p>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g., 5 Common Mistakes in Nonprofit Fundraising"
            className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <Button onClick={handleGeneratePlan} isLoading={isLoadingPlan} disabled={!topic.trim()}>
            Generate Plan
          </Button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {isLoadingPlan && <p className="text-gray-500 mt-2">Our strategist is designing your carousel...</p>}
      </div>

      {slides.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.map((slide, index) => (
            <div key={slide.slide} className="border border-gray-200 rounded-lg p-4 flex flex-col justify-between">
              <div>
                <p className="font-bold text-sm text-blue-600">Slide {slide.slide}</p>
                <h4 className="font-bold text-lg text-gray-800 mt-1">{slide.title}</h4>
                <p className="text-gray-600 text-sm mt-2">{slide.content}</p>
                <p className="text-xs text-gray-500 mt-3 italic">Visual: {slide.visualSuggestion}</p>
              </div>
              <div className="mt-4">
                <div className="w-full aspect-square bg-gray-100 rounded-md flex items-center justify-center mb-4">
                  {slide.isGeneratingImage ? (
                    <div className="flex flex-col items-center text-gray-500">
                      <Spinner />
                      <span className="text-sm mt-2">Generating...</span>
                    </div>
                  ) : slide.imageUrl ? (
                    <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover rounded-md" />
                  ) : (
                    <p className="text-gray-400 text-sm">Image will appear here</p>
                  )}
                </div>
                <Button 
                  onClick={() => handleGenerateImage(index)} 
                  isLoading={slide.isGeneratingImage}
                  className="w-full text-xs"
                >
                  Generate Image
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default CarouselCreator;