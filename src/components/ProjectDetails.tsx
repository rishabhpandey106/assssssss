import React, { useState, useMemo } from 'react';
import { Project } from '../types';
import { Search, Filter, User, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { ProjectDetailPanel } from './ProjectDetailPanel';

interface ProjectDetailsProps {
  projects: Project[];
  isAdmin: boolean;
  updateProjectScore: (id: string, score: number) => void;
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projects, isAdmin, updateProjectScore }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const allTechs = useMemo(() => {
    const techs = new Set<string>();
    projects.forEach(p => p.techStack.forEach(t => techs.add(t)));
    return Array.from(techs).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = 
        p.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTech = !selectedTech || p.techStack.includes(selectedTech);
      
      return matchesSearch && matchesTech;
    });
  }, [projects, searchTerm, selectedTech]);

  return (
    <div className="space-y-6 pb-12 relative">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 uppercase">Project Hub</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative group flex-1 sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              placeholder="Filter archives..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-4 outline-none text-sm focus:ring-2 ring-indigo-100 focus:border-indigo-600 transition-all"
            />
          </div>

          <div className="relative group sm:w-48">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={selectedTech || ''}
              onChange={e => setSelectedTech(e.target.value || null)}
              className="w-full appearance-none bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-10 outline-none text-sm focus:ring-2 ring-indigo-100 focus:border-indigo-600 transition-all cursor-pointer"
            >
              <option value="">All Stacks</option>
              {allTechs.map(tech => (
                <option key={tech} value={tech}>{tech}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, idx) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => setSelectedProject(project)}
              className={cn(
                "flex flex-col bg-white border rounded-2xl group cursor-pointer transition-all overflow-hidden",
                selectedProject?.id === project.id 
                  ? "border-indigo-600 ring-4 ring-indigo-50 shadow-xl shadow-indigo-100" 
                  : "border-slate-200 hover:shadow-lg hover:shadow-indigo-100/50"
              )}
            >
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className={cn(
                    "font-bold text-lg leading-tight transition-colors",
                    selectedProject?.id === project.id ? "text-indigo-600" : "text-slate-900 group-hover:text-indigo-600"
                  )}>
                    {project.projectTitle}
                  </h3>
                  {project.isWinner && (
                    <div className="p-1 bg-amber-100 text-amber-700 rounded shadow-sm">
                      <Trophy size={14} />
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-slate-500 line-clamp-2 mb-6 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                   <div className="flex items-center gap-2 text-slate-400">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                        <User size={12} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-tight">{project.participantName}</span>
                   </div>
                   <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                    {new Date(project.submittedAt).getFullYear()}
                   </span>
                </div>

                {isAdmin && (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score Assessment</span>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        min="0" 
                        max="100"
                        value={project.score}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateProjectScore(project.id, parseInt(e.target.value) || 0)}
                        className="w-14 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-indigo-600 outline-none focus:border-indigo-600"
                      />
                      <span className="text-[10px] font-bold text-slate-400">/ 100</span>
                    </div>
                  </div>
                )}
              </div>

              <div className={cn(
                "px-6 py-4 flex flex-wrap gap-1.5 border-t",
                selectedProject?.id === project.id ? "bg-indigo-50/50 border-indigo-100" : "bg-slate-50/50 border-slate-100"
              )}>
                {project.techStack.map(tech => (
                  <span 
                    key={tech} 
                    className={cn(
                      "text-[9px] font-bold px-2 py-1 rounded-md transition-colors",
                      selectedTech === tech ? "bg-indigo-600 text-white" : "bg-white text-slate-500 border border-slate-200"
                    )}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredProjects.length === 0 && (
        <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-3xl">
          <p className="text-slate-400 italic">No entries matched your search criteria.</p>
        </div>
      )}

      <ProjectDetailPanel 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </div>
  );
};
