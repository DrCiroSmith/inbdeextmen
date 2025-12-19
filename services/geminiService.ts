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
  { title: "Pharmacology | Analgesics", url: "https://www.youtube.com/watch?v=0_u-mE3_r_M" },
  { title: "Pharmacology | Pharmacokinetics", url: "https://www.youtube.com/watch?v=53s41reBCFQ" },
  { title: "Pharmacology | Pharmacodynamics", url: "https://www.youtube.com/watch?v=Cq5Zi_3mrfo" },
  { title: "Pharmacology | Autonomic Nervous System", url: "https://www.youtube.com/watch?v=J98_052yC20" },
  { title: "Pharmacology | Antifungals, Antivirals, and Antiretrovirals", url: "https://www.youtube.com/watch?v=4q7_1yO0-d8" },
  { title: "Pharmacology | Antianxiety and Antidepressants", url: "https://www.youtube.com/watch?v=t5Jm-t--3pE" },
  { title: "Pharmacology | PRACTICE QUESTIONS", url: "https://www.youtube.com/watch?v=3g5YyYy-Y-s" }
];

const ORAL_RADIOLOGY_VIDEOS = [
  { title: "Fundamentals of X-Rays", url: "https://www.youtube.com/watch?v=SZFqei91R9w" },
  { title: "X-Ray Settings", url: "https://www.youtube.com/watch?v=BxHmsb1Gnyg" },
  { title: "Radiation Dose", url: "https://www.youtube.com/watch?v=GxHsvxywvtE" },
  { title: "Film vs. Digital Imaging", url: "https://www.youtube.com/watch?v=UFsr49CdfJQ" },
  { title: "Types of Radiographs", url: "https://www.youtube.com/watch?v=Rj6QTrOG3hI" },
  { title: "Radiographic Interpretation", url: "https://www.youtube.com/watch?v=SZFqei91R9w&list=PLVmK7sDA_arEPhqt_QjcHwJfbMCFFcs9W&index=6" },
  { title: "PRACTICE QUESTIONS", url: "https://www.youtube.com/watch?v=wDTtl31n1m4" }
];

const ORAL_PATHOLOGY_VIDEOS = [
  { title: "Oral Pathology | Developmental Conditions | INBDE, ADAT", url: "https://www.youtube.com/watch?v=3zcuZ6U7vQA" },
  { title: "Oral Pathology | Mucosal Reactive Lesions | INBDE, ADAT", url: "https://www.youtube.com/watch?v=wzthel3wEcw" },
  { title: "Oral Pathology | Mucosal Infections | INBDE, ADAT", url: "https://www.youtube.com/watch?v=X1rF7Iv5Q_k" },
  { title: "Oral Pathology | Mucosal Immunologic Diseases | INBDE, ADAT", url: "https://www.youtube.com/watch?v=FLjpsVbUbT0" },
  { title: "Oral Pathology | Mucosal Premalignant Lesions | INBDE, ADAT", url: "https://www.youtube.com/watch?v=TYzW59l-nXo" },
  { title: "Oral Pathology | Mucosal Malignant Lesions | INBDE, ADAT", url: "https://www.youtube.com/watch?v=I8XPdNC_Xk8" },
  { title: "Oral Pathology | Connective Tissue Benign Tumors | INBDE, ADAT", url: "https://www.youtube.com/watch?v=rw7gzh25h9o" },
  { title: "Oral Pathology | Connective Tissue Malignant Tumors | INBDE, ADAT", url: "https://www.youtube.com/watch?v=M4l0Vr-gR7o" },
  { title: "Oral Pathology | Salivary Gland Reactive Diseases | INBDE, ADAT", url: "https://www.youtube.com/watch?v=AMV0fQn2QWM" },
  { title: "Oral Pathology | Salivary Gland Benign Diseases | INBDE, ADAT", url: "https://www.youtube.com/watch?v=_8xHh1tk7jY" },
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