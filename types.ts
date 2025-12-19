export interface Playlist {
  id: string;
  title: string;
  url: string;
  description: string;
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

export interface VideoModule {
  videoTitle: string;
  videoUrl: string;
  summary: string;
  flashcards: Flashcard[];
  multipleChoice: MultipleChoice[];
  trueFalse: TrueFalse[];
}

export interface StudyData {
  playlistTitle: string;
  playlistUrl: string;
  modules: VideoModule[];
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}