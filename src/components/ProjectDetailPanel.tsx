import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Users, Calendar, Github, Link, ExternalLink } from 'lucide-react';
import { Project } from '../types';
import { cn } from '../lib/utils';

interface ProjectDetailPanelProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDetailPanel: React.FC<ProjectDetailPanelProps> = ({ project, onClose }) => {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-end bg-slate-900/40 backdrop-blur-sm p-4 lg:p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full max-w-xl h-full bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-slate-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-8 flex-1 overflow-y-auto scrollbar-hide">
              <div className="flex justify-between items-start mb-8">
                 <div className={cn(
                   "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5",
                   project.submissionType === 'team' ? "bg-indigo-50 text-indigo-600" : "bg-slate-50 text-slate-600"
                 )}>
                   {project.submissionType === 'team' ? <Users size={12} /> : <User size={12} />}
                   {project.submissionType} Entry
                 </div>
                 <button 
                  onClick={onClose}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all active:scale-95"
                 >
                   <X size={20} />
                 </button>
              </div>

              <div className="space-y-8">
                <header className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900 leading-tight">
                    {project.projectTitle}
                  </h2>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar size={14} />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      Index Date: {new Date(project.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-3">Principal</span>
                    <div className="font-bold text-slate-800 text-lg">{project.participantName}</div>
                    {project.teamName && (
                      <div className="text-xs text-indigo-600 font-bold mt-1 uppercase tracking-tight">Team: {project.teamName}</div>
                    )}
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-3">Manifest Content</span>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map(t => (
                        <span key={t} className="text-[9px] font-bold bg-white text-slate-500 border border-slate-200 px-2 py-1 rounded-md uppercase">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {project.submissionType === 'team' && (
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-3">Squad Roster</span>
                    <div className="grid grid-cols-2 gap-3">
                       {project.participants.map((p, i) => (
                         <div key={i} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-100">
                            <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold">{i+1}</div>
                            <span className="text-xs font-semibold text-slate-700">{p}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Abstract Analysis</span>
                  <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    {project.description}
                  </p>
                </div>

                <div className="space-y-4">
                   <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Retrieval Paths</span>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <a 
                        href={project.githubLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl hover:bg-indigo-600 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <Github size={18} />
                          <span className="text-xs font-bold uppercase tracking-widest">Source Repo</span>
                        </div>
                        <ExternalLink size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                      </a>
                      {project.liveLink && (
                        <a 
                          href={project.liveLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-100 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <Link size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">Live System</span>
                          </div>
                          <ExternalLink size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                        </a>
                      )}
                   </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-end">
               <button 
                onClick={onClose}
                className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-xs font-bold uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95 shadow-sm"
               >
                 Return to Flow
               </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
