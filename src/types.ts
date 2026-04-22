export interface Project {
  id: string;
  submissionType: 'solo' | 'team';
  participantName: string;
  participants: string[];
  teamName?: string;
  projectTitle: string;
  description: string;
  techStack: string[];
  liveLink?: string;
  githubLink: string;
  submittedAt: string;
  isWinner?: boolean;
  score: number;
}

export type TabType = 'dashboard' | 'submissions' | 'details' | 'chatbot';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
