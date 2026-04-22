import { Project } from "../types";

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "1",
    submissionType: "solo",
    participantName: "Alice Chen",
    participants: ["Alice Chen"],
    projectTitle: "EcoTrack AI",
    description: "A machine learning solution for tracking carbon footprints in real-time using IoT sensors.",
    techStack: ["React", "Python", "TensorFlow", "Node.js"],
    githubLink: "https://github.com/alice/ecotrack",
    submittedAt: "2024-03-15T10:00:00Z",
    isWinner: true,
    score: 95
  },
  {
    id: "2",
    submissionType: "team",
    participantName: "Bob Smith",
    participants: ["Bob Smith", "John Doe"],
    teamName: "DeFi Wizards",
    projectTitle: "HealthConnect",
    description: "Decentralized patient record management system on Ethereum for secure data sharing.",
    techStack: ["React", "Solidity", "Web3.js", "Firebase"],
    githubLink: "https://github.com/defiwizards/healthconnect",
    submittedAt: "2024-03-16T14:30:00Z",
    isWinner: true,
    score: 88
  },
  {
    id: "3",
    submissionType: "solo",
    participantName: "Charlie Davis",
    participants: ["Charlie Davis"],
    projectTitle: "EduStream",
    description: "Interactive platform for remote teaching with integrated whiteboards and low-latency video.",
    techStack: ["Vue.js", "WebRTC", "Socket.io", "PostgreSQL"],
    githubLink: "https://github.com/charlie/edustream",
    submittedAt: "2024-03-17T09:15:00Z",
    isWinner: true,
    score: 75
  },
  {
    id: "4",
    submissionType: "solo",
    participantName: "Diana Prince",
    participants: ["Diana Prince"],
    projectTitle: "SmartUrban",
    description: "City planning tool using 3D modeling to optimized traffic flow and green space allocation.",
    techStack: ["React", "Three.js", "Express", "MongoDB"],
    githubLink: "https://github.com/diana/smarturban",
    submittedAt: "2024-03-18T11:45:00Z",
    score: 45
  }
];
