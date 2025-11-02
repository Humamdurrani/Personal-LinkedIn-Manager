import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// General purpose text generation
export const generateContent = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Basic text task model
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content from Gemini API.");
  }
};

// Enhance a profile image
export const enhanceProfileImage = async (base64: string, mimeType: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64, mimeType } },
          { text: 'Enhance this professional headshot. Improve lighting, clarity, and overall quality to make it suitable for a LinkedIn profile picture. Do not add or change any features.' }
        ]
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });
    
    const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (imagePart && imagePart.inlineData) {
      const base64ImageBytes = imagePart.inlineData.data;
      return `data:${imagePart.inlineData.mimeType};base64,${base64ImageBytes}`;
    }
    throw new Error("No image data found in response.");

  } catch (error) {
    console.error("Error enhancing image:", error);
    throw new Error("Failed to enhance image with Gemini API.");
  }
};


// Generate a LinkedIn banner (16:9 aspect ratio is typical for banners)
export const generateLinkedInBanner = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `A professional LinkedIn banner image based on the following theme: "${prompt}". The style should be modern, clean, and corporate-friendly. Avoid text unless specifically requested.`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    throw new Error("No banner image generated.");

  } catch (error) {
    console.error("Error generating banner:", error);
    throw new Error("Failed to generate banner with Gemini API.");
  }
};

// Generate a carousel plan as a JSON object
export const generateCarouselPlan = async (topic: string): Promise<any[]> => {
  const prompt = `
    Create a 5-slide LinkedIn carousel plan about "${topic}".
    For each slide, provide a "slide" number (1 to 5), a short "title", "content" (max 20 words), and a "visualSuggestion" for an accompanying image.
  `;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            slides: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  slide: { type: Type.NUMBER },
                  title: { type: Type.STRING },
                  content: { type: Type.STRING },
                  visualSuggestion: { type: Type.STRING },
                },
                required: ["slide", "title", "content", "visualSuggestion"]
              }
            }
          },
          required: ["slides"]
        },
      },
    });

    const jsonStr = response.text.trim();
    const result = JSON.parse(jsonStr);
    return result.slides;

  } catch (error) {
    console.error("Error generating carousel plan:", error);
    throw new Error("Failed to generate carousel plan from Gemini API.");
  }
};

// Generate an image for a carousel slide (square aspect ratio)
export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `A professional, modern, and clean image for a LinkedIn carousel slide. The image should visually represent: "${prompt}". The style should be abstract or conceptual, suitable for a corporate audience.`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    throw new Error("No image generated.");

  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image with Gemini API.");
  }
};
