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

export interface StudyData {
  playlistTitle: string;
  videoTitle: string;
  videoUrl: string;
  summary: string;
  flashcards: Flashcard[];
  multipleChoice: MultipleChoice[];
  trueFalse: TrueFalse[];
}

export enum AppState {
  IDLE = 'IDLE',
  VIDEO_SELECTION = 'VIDEO_SELECTION',
  GENERATING = 'GENERATING',
  COMPLETE = 'COMPLETE',
  STUDY = 'STUDY',
  ERROR = 'ERROR'
}