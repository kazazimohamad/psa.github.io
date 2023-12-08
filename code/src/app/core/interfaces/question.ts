export interface Question {
  id: number;
  type: 'choice' | 'text'; // Added to distinguish between multiple-choice and text-entry questions
  songSnippetPath?: string; // Just enter the file name
  startTime: number; // Second to start of the mp3 file
  duration: number; // The music stops and the options are shown after this number of seconds
  lyricsDisplay?: string[]; // Every line in an item
  options: string[]; // Answers to show
  correctOptionIndex?: number;
  correctTextAnswer?: string; // The correct answer for text type questions
  points: number;
  lifelineUsed?: boolean[]; // Tracks usage of lifelines: [false, false, false]

}
