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

const generatePrompt = (playlist: Playlist) => {
  const isHeadAndNeck = playlist.title.includes('Head and Neck');
  const isPharmacology = playlist.title.includes('Pharmacology');
  const isOralRadiology = playlist.title.includes('Oral Radiology');

  let videoContext = '';
  if (isHeadAndNeck) {
    videoContext = `
    For this specific "Head & Neck Anatomy" playlist, you MUST use the following 20 videos with their EXACT URLs. 
    Do NOT search for them, use the provided URLs:
    ${HEAD_AND_NECK_VIDEOS.map((v, i) => `${i + 1}. ${v.title}: ${v.url}`).join('\n    ')}
    `;
  } else if (isPharmacology) {
    videoContext = `
    For this specific "Pharmacology" playlist, you MUST use the following 10 videos with their EXACT URLs. 
    Do NOT search for them, use the provided URLs:
    ${PHARMACOLOGY_VIDEOS.map((v, i) => `${i + 1}. ${v.title}: ${v.url}`).join('\n    ')}
    `;
  } else if (isOralRadiology) {
    videoContext = `
    For this specific "Oral Radiology" playlist, you MUST use the following 7 videos with their EXACT URLs. 
    Do NOT search for them, use the provided URLs:
    ${ORAL_RADIOLOGY_VIDEOS.map((v, i) => `${i + 1}. ${v.title}: ${v.url}`).join('\n    ')}
    `;
  }

  return `
    You are an expert tutor specializing in the INBDE dental examination.
    
    TASK: Generate comprehensive study materials for the "${playlist.title}" playlist.
    
    ${videoContext}
    
    For EACH video listed above, create an independent study module with:
    - "videoTitle": The exact title of the video
    - "videoUrl": The specific YouTube link provided above
    - "summary": A detailed 3-4 paragraph high-yield summary of key clinical concepts
    - "flashcards": Exactly 5 detailed flashcards (Front/Back format)
    - "multipleChoice": Exactly 3 clinical scenario MCQs with 4 options each, correct answer, and detailed explanation
    - "trueFalse": Exactly 3 True/False statements with detailed reasoning
    
    CRITICAL: The output MUST be a valid JSON object with:
    - "playlistTitle": "${playlist.title}"
    - "playlistUrl": "${playlist.url}"
    - "modules": An array containing one object for EACH video above
    
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
      model: 'gemini-2.0-flash',
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