import React, { useState } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { generateContent, enhanceProfileImage, generateLinkedInBanner } from '../services/geminiService';
import Spinner from './common/Spinner';

const MIN_LENGTH = 50;

const fileToBase64 = (file: File): Promise<{ base64: string, mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const mimeType = result.split(':')[1].split(';')[0];
      const base64 = result.split(',')[1];
      resolve({ base64, mimeType });
    };
    reader.onerror = error => reject(error);
  });
};

const ProfileOptimizer: React.FC = () => {
  // State for Text Optimizer
  const [currentProfile, setCurrentProfile] = useState('');
  const [optimization, setOptimization] = useState('');
  const [isLoadingText, setIsLoadingText] = useState(false);
  const [textError, setTextError] = useState<string | null>(null);

  // State for Image Enhancer
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [enhancedImageUrl, setEnhancedImageUrl] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  // State for Banner Generator
  const [bannerPrompt, setBannerPrompt] = useState('');
  const [generatedBannerUrl, setGeneratedBannerUrl] = useState<string | null>(null);
  const [isGeneratingBanner, setIsGeneratingBanner] = useState(false);
  const [bannerError, setBannerError] = useState<string | null>(null);

  const handleDownload = (url: string | null, filename: string) => {
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const handleOptimizeText = async () => {
    const trimmedProfile = currentProfile.trim();
    if (!trimmedProfile) {
      setTextError('Please paste your current profile bio.');
      return;
    }
    if (trimmedProfile.length < MIN_LENGTH) {
      setTextError(`Please enter at least ${MIN_LENGTH} characters for a meaningful analysis.`);
      return;
    }
    
    setIsLoadingText(true);
    setTextError(null);
    setOptimization('');

    const prompt = `
      Analyze the following LinkedIn profile bio and provide a detailed, optimized version based on the 2025 LinkedIn strategy.
      Focus on the "uniquePositioning" and "coreContentPillars" to craft a compelling headline and 'About' section.
      Provide the optimized headline and 'About' section separately. Explain the key changes and why they were made.

      Current Bio:
      ---
      ${currentProfile}
      ---
    `;

    try {
      const result = await generateContent(prompt);
      setOptimization(result);
    } catch (err) {
      setTextError('An error occurred while optimizing your profile. Please try again.');
      console.error(err);
    } finally {
      setIsLoadingText(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setOriginalImageUrl(URL.createObjectURL(file));
      setEnhancedImageUrl(null);
      setImageError(null);
    }
  };

  const handleEnhanceImage = async () => {
    if (!profileImage) {
      setImageError("Please upload a profile image first.");
      return;
    }
    setIsEnhancing(true);
    setImageError(null);
    setEnhancedImageUrl(null);
    try {
      const { base64, mimeType } = await fileToBase64(profileImage);
      const enhancedImage = await enhanceProfileImage(base64, mimeType);
      setEnhancedImageUrl(enhancedImage);
    } catch (err) {
      setImageError("An error occurred while enhancing the image. Please try again.");
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };
  
  const handleGenerateBanner = async () => {
    const trimmedPrompt = bannerPrompt.trim();
    if (!trimmedPrompt) {
        setBannerError("Please describe the banner you want to create.");
        return;
    }
    setIsGeneratingBanner(true);
    setBannerError(null);
    setGeneratedBannerUrl(null);
    try {
        const bannerUrl = await generateLinkedInBanner(trimmedPrompt);
        setGeneratedBannerUrl(bannerUrl);
    } catch (err) {
        setBannerError("An error occurred while generating the banner. Please try again.");
        console.error(err);
    } finally {
        setIsGeneratingBanner(false);
    }
  };


  return (
    <div className="space-y-8">
      <Card title="Profile Text Optimizer">
        <div className="space-y-4">
          <p className="text-gray-600">
            Paste your current LinkedIn bio (About section). Our AI strategist will provide an optimized version.
          </p>
          <textarea
            value={currentProfile}
            onChange={(e) => {
              setCurrentProfile(e.target.value);
              if (textError) setTextError(null);
            }}
            placeholder="Paste your current LinkedIn 'About' section here..."
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            rows={10}
          />
          <Button onClick={handleOptimizeText} isLoading={isLoadingText} disabled={!currentProfile.trim()}>
            Optimize My Bio
          </Button>
          {textError && <p className="text-red-500 mt-2">{textError}</p>}
          {isLoadingText && <p className="text-gray-500 mt-2">Our strategist is analyzing your profile...</p>}
          {optimization && (
            <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Optimized Profile:</h3>
              <pre className="whitespace-pre-wrap font-sans text-gray-700">{optimization}</pre>
            </div>
          )}
        </div>
      </Card>
      
      <Card title="Visual Identity Optimizer">
        {/* Profile Picture Enhancer */}
        <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Profile Picture Enhancer</h3>
            <p className="text-gray-600 mb-4">Upload your headshot to improve its quality for a more professional look.</p>
            <div className="flex items-center gap-4">
                <input type="file" accept="image/png, image/jpeg" onChange={handleFileChange} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                <Button onClick={handleEnhanceImage} isLoading={isEnhancing} disabled={!profileImage}>
                    Enhance Image
                </Button>
            </div>
            {imageError && <p className="text-red-500 mt-2">{imageError}</p>}
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-semibold text-center mb-2">Original</h4>
                    <div className="w-full aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                        {originalImageUrl ? <img src={originalImageUrl} alt="Original profile" className="w-full h-full object-cover rounded-md" /> : <p className="text-gray-400">Upload an image</p>}
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-center mb-2">Enhanced</h4>
                    <div className="w-full aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                        {isEnhancing ? <Spinner /> : enhancedImageUrl ? <img src={enhancedImageUrl} alt="Enhanced profile" className="w-full h-full object-cover rounded-md" /> : <p className="text-gray-400">AI Enhanced version</p>}
                    </div>
                     {enhancedImageUrl && !isEnhancing && (
                        <Button 
                            onClick={() => handleDownload(enhancedImageUrl, 'enhanced-profile.jpeg')}
                            className="w-full mt-2"
                        >
                            Download Enhanced Image
                        </Button>
                    )}
                </div>
            </div>
        </div>

        <hr className="my-8"/>

        {/* Banner Generator */}
        <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">LinkedIn Banner Generator</h3>
            <p className="text-gray-600 mb-4">Describe your profession or brand, and our AI will generate a custom banner for you.</p>
            <div className="flex items-center gap-4">
                <input 
                    type="text" 
                    value={bannerPrompt}
                    onChange={(e) => {
                        setBannerPrompt(e.target.value);
                        if (bannerError) setBannerError(null);
                    }}
                    placeholder="e.g., A banner for a software engineer specializing in AI"
                    className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <Button onClick={handleGenerateBanner} isLoading={isGeneratingBanner} disabled={!bannerPrompt.trim()}>
                    Generate Banner
                </Button>
            </div>
            {bannerError && <p className="text-red-500 mt-2">{bannerError}</p>}

            <div className="mt-6">
                <h4 className="font-semibold mb-2">Generated Banner:</h4>
                <div className="w-full aspect-[4/1] bg-gray-100 rounded-md flex items-center justify-center">
                    {isGeneratingBanner ? <Spinner /> : generatedBannerUrl ? <img src={generatedBannerUrl} alt="Generated LinkedIn Banner" className="w-full h-full object-cover rounded-md" /> : <p className="text-gray-400">Your banner will appear here (16:9 ratio)</p>}
                </div>
                {generatedBannerUrl && !isGeneratingBanner && (
                    <Button 
                        onClick={() => handleDownload(generatedBannerUrl, 'linkedin-banner.jpeg')}
                        className="w-full mt-2"
                    >
                        Download Banner
                    </Button>
                )}
            </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileOptimizer;