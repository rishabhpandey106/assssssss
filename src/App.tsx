import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Submissions } from './components/Submissions';
import { ProjectDetails } from './components/ProjectDetails';
import { Chatbot } from './components/Chatbot';
import { Project, TabType } from './types';
import { INITIAL_PROJECTS } from './data/initialData';
import { Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('hackhub_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    localStorage.setItem('hackhub_projects', JSON.stringify(projects));
  }, [projects]);

  const addProject = (project: Omit<Project, 'id' | 'submittedAt' | 'score'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      score: 0
    };
    setProjects(prev => [newProject, ...prev]);
  };

  const updateProjectScore = (projectId: string, score: number) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, score } : p
    ));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard projects={projects} />;
      case 'submissions':
        return <Submissions addProject={addProject} projects={projects} />;
      case 'details':
        return <ProjectDetails projects={projects} isAdmin={isAdmin} updateProjectScore={updateProjectScore} />;
      case 'chatbot':
        return <Chatbot projects={projects} />;
      default:
        return <Dashboard projects={projects} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
      />
      
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center px-6 z-30">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-1 hover:bg-[#141414]/10 rounded"
        >
          <Menu size={24} />
        </button>
        <span className="ml-4 font-sans font-bold uppercase tracking-tighter">HackHub</span>
      </div>

      <main className="lg:ml-64 p-6 pt-24 lg:pt-12 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-7xl mx-auto"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
