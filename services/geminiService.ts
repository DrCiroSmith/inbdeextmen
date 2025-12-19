import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Playlist, StudyData } from '../types';

const HEAD_AND_NECK_VIDEOS = [
  { title: "Embryology & Pharyngeal Arches", url: "https://www.youtube.com/watch?v=4n2H2eQOmc8" },
  { title: "Bones of the Skull", url: "https://www.youtube.com/watch?v=NQtXvfJCtxo" },
  { title: "Foramina of the Skull", url: "https://www.youtube.com/watch?v=Yc0xxRAuwG0" },
  { title: "Fossae of the Skull", url: "https://www.youtube.com/watch?v=z7TIYC6mfo4" },
  { title: "Fascial Space Infections", url: "https://www.youtube.com/watch?v=4n2H2eQOmc8&list=PLVmK7sDA_arEKUbDuKoqUMSnIMNBXYiqV&index=5" },
  { title: "Muscles of Mastication", url: "https://www.youtube.com/watch?v=reqF1EORKSg" },
  { title: "Muscles of Facial Expression", url: "https://www.youtube.com/watch?v=cqoOAz8i6nI" },
  { title: "Triangles of the Neck & Neck Muscles", url: "https://www.youtube.com/watch?v=Ewj3Wf9D4zw" },
  { title: "Tongue Muscles", url: "https://www.youtube.com/watch?v=Zz3cO2MhwhQ" },
  { title: "Soft Palate Muscles", url: "https://www.youtube.com/watch?v=4dIGQ3L2YG4" },
  { title: "Pharynx & Larynx Muscles", url: "https://www.youtube.com/watch?v=4n2H2eQOmc8&list=PLVmK7sDA_arEKUbDuKoqUMSnIMNBXYiqV&index=11" },
  { title: "Ear Muscles", url: "https://www.youtube.com/watch?v=VTDQt-KO0YQ" },
  { title: "Eye Muscles", url: "https://www.youtube.com/watch?v=FhHqKGLeZkI" },
  { title: "Cranial Nerves", url: "https://www.youtube.com/watch?v=1gB90u2JOYg" },
  { title: "Salivary Glands", url: "https://www.youtube.com/watch?v=EF-YTC5yHi0" },
  { title: "TMJ Anatomy", url: "https://www.youtube.com/watch?v=UjT_8kOnITE" },
  { title: "Craniofacial Arteries", url: "https://www.youtube.com/watch?v=m97am1kHpoo" },
  { title: "Craniofacial Veins", url: "https://www.youtube.com/watch?v=xcyUm5ZEzng" },
  { title: "Craniofacial Lymphatics", url: "https://www.youtube.com/watch?v=4n2H2eQOmc8&list=PLVmK7sDA_arEKUbDuKoqUMSnIMNBXYiqV&index=19" },
  { title: "PRACTICE QUESTIONS", url: "https://www.youtube.com/watch?v=PG6ZFCYt5S4" }
];

const PHARMACOLOGY_VIDEOS = [
  { title: "Local Anesthetics | Categories and Calculations", url: "https://www.youtube.com/watch?v=5Ujl1VbAcgc" },
  { title: "Local Anesthetics | Injections and Techniques", url: "https://www.youtube.com/watch?v=eWXuKFSnkIY" },
  { title: "Pharmacology | Antibiotics", url: "https://www.youtube.com/watch?v=4Ym3f-N01yI" },
  { title: "Pharmacology | Analgesics", url: "https://www.youtube.com/watch?v=0_u-mE3_r_M" },
  { title: "Pharmacology | Pharmacokinetics", url: "https://www.youtube.com/watch?v=53s41reBCFQ" },
  { title: "Pharmacology | Pharmacodynamics", url: "https://www.youtube.com/watch?v=Cq5Zi_3mrfo" },
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
            },
            required: ["front", "back"]
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
            },
            required: ["question", "options", "correctAnswer", "explanation"]
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
            },
            required: ["statement", "isTrue", "explanation"]
          }
        }
      },
      required: ["videoTitle", "videoUrl", "summary", "flashcards", "multipleChoice", "trueFalse"]
    }
  }
  },
required: ["playlistTitle", "playlistUrl", "modules"]
};

export const generatePlaylistData = async (apiKey: string, playlist: Playlist): Promise<StudyData> => {
  const ai = new GoogleGenAI({ apiKey });

  try {
    // Use gemini-1.5-flash-latest which is stable and has better quota
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: generatePrompt(playlist),
      config: {
        responseMimeType: 'application/json',
        responseSchema: studyDataSchema,
        temperature: 0.2
      }
    });

    const text = response.text;
    if (!text) throw new Error("No data returned from Gemini");

    const data = JSON.parse(text) as StudyData;

    // Ensure required fields
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