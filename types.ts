export interface Playlist {
  id: string;
  title: string;
  url: string;
  description: string;
}

export interface VideoInfo {
  title: string;
  url: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface MultipleChoice {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface TrueFalse {
  statement: string;
  isTrue: boolean;
  explanation: string;
}

// New question types introduced in version 2.0.0
export interface FillInTheBlank {
  question: string;
  answer: string;
  explanation: string;
  difficulty?: string;
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface Matching {
  prompt: string;
  pairs: MatchingPair[];
  explanation: string;
  difficulty?: string;
}

export interface ClinicalScenario {
  scenario: string;
  answer: string;
  explanation: string;
  difficulty?: string;
}

export interface StudyData {
  playlistTitle: string;
  videoTitle: string;
  videoUrl: string;
  summary: string;
  flashcards: Flashcard[];
  multipleChoice: MultipleChoice[];
  trueFalse: TrueFalse[];
  fillInTheBlank: FillInTheBlank[];
  matching: Matching[];
  clinical: ClinicalScenario[];
  // Cache metadata
  isCached?: boolean;
  generatedAt?: string;
  lastUpdated?: string;
  generationCount?: number; // How many times re-analyzed
}

export enum AppState {
  IDLE = 'IDLE',
  VIDEO_SELECTION = 'VIDEO_SELECTION',
  GENERATING = 'GENERATING',
  COMPLETE = 'COMPLETE',
  STUDY = 'STUDY',
  ERROR = 'ERROR'
}
