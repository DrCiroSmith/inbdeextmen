import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Playlist, StudyData } from '../types';

const generatePrompt = (playlist: Playlist) => {
  const isHeadAndNeck = playlist.title.includes('Head and Neck');
  
  const videoContext = isHeadAndNeck ? `
    For this specific "Head & Neck Anatomy" playlist, you must find and include these 20 specific videos:
    1. Embryology & Pharyngeal Arches
    2. Bones of the Skull
    3. Foramina of the Skull
    4. Fossae of the Skull
    5. Fascial Space Infections
    6. Muscles of Mastication
    7. Muscles of Facial Expression
    8. Triangles of the Neck & Neck Muscles
    9. Tongue Muscles
    10. Soft Palate Muscles
    11. Pharynx & Larynx Muscles
    12. Ear Muscles
    13. Eye Muscles
    14. Cranial Nerves
    15. Salivary Glands
    16. TMJ Anatomy
    17. Craniofacial Arteries
    18. Craniofacial Veins
    19. Craniofacial Lymphatics
    20. PRACTICE QUESTIONS
  ` : '';

  return `
    You are an expert tutor specializing in the INBDE. 
    TASK: Use Google Search to access the YouTube playlist: ${playlist.url}.
    
    1. Identify EVERY video in this playlist ("${playlist.title}").
    ${videoContext}
    2. For each video, retrieve the specific YouTube URL (e.g., https://www.youtube.com/watch?v=...).
    3. Generate a comprehensive, independent study JSON module for EACH video found.

    Each module MUST contain:
    - "videoTitle": The exact title of the video.
    - "videoUrl": The specific YouTube link to that video.
    - "summary": A detailed high-yield summary of the clinical concepts.
    - "flashcards": 5 detailed Flashcards (Front/Back).
    - "multipleChoice": 3 Scenario-based MCQs with 4 options, correct answer, and explanation.
    - "trueFalse": 3 True/False statements with reasoning.

    The output MUST be a single JSON object with a "modules" array containing one entry for every video in the playlist.
    Ensure 100% accuracy to Dr. Ryan's Mental Dental curriculum.
  `;
};

const studyDataSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    playlistTitle: { type: Type.STRING },
    playlistUrl: { type: Type.STRING },
    modules: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          videoTitle: { type: Type.STRING },
          videoUrl: { type: Type.STRING },
          summary: { type: Type.STRING },
          flashcards: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                front: { type: Type.STRING },
                back: { type: Type.STRING }
              }
            }
          },
          multipleChoice: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.STRING },
                explanation: { type: Type.STRING }
              }
            }
          },
          trueFalse: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                statement: { type: Type.STRING },
                isTrue: { type: Type.BOOLEAN },
                explanation: { type: Type.STRING }
              }
            }
          }
        },
        required: ["videoTitle", "videoUrl", "summary", "flashcards", "multipleChoice", "trueFalse"]
      }
    }
  },
  required: ["playlistTitle", "modules"]
};

export const generatePlaylistData = async (apiKey: string, playlist: Playlist): Promise<StudyData> => {
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: generatePrompt(playlist),
      config: {
        responseMimeType: 'application/json',
        responseSchema: studyDataSchema,
        temperature: 0.1,
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text;
    if (!text) throw new Error("No data returned from Gemini");

    const data = JSON.parse(text) as StudyData;
    data.playlistTitle = playlist.title;
    data.playlistUrl = playlist.url;
    
    if (!data.modules || !Array.isArray(data.modules)) {
      data.modules = [];
    }
    
    return data;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};