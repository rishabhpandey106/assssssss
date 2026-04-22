import React, { useState, useMemo } from 'react';
import { Project } from '../types';
import { Plus, CheckCircle2, Terminal, UserPlus, UserMinus, Github, Link, Users, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { ProjectDetailPanel } from './ProjectDetailPanel';

interface SubmissionsProps {
  addProject: (project: Omit<Project, 'id' | 'submittedAt' | 'score'>) => void;
  projects: Project[];
}

export const Submissions: React.FC<SubmissionsProps> = ({ addProject, projects }) => {
  const initialForm = {
    submissionType: 'solo' as 'solo' | 'team',
    participants: [''],
    teamName: '',
    projectTitle: '',
    description: '',
    techStack: '',
    liveLink: '',
    githubLink: ''
  };

  const [formData, setFormData] = useState(initialForm);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Get the most recent project (the one just submitted)
  const lastProject = useMemo(() => {
    if (projects.length === 0) return null;
    return [...projects].sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )[0];
  }, [projects]);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddParticipant = () => {
    setFormData(prev => ({
      ...prev,
      participants: [...prev.participants, '']
    }));
  };

  const handleRemoveParticipant = (index: number) => {
    if (formData.participants.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index)
    }));
  };

  const handleParticipantChange = (index: number, value: string) => {
    const newParticipants = [...formData.participants];
    newParticipants[index] = value;
    setFormData(prev => ({
      ...prev,
      participants: newParticipants
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validation
    if (formData.participants.some(p => !p.trim())) {
      newErrors.participants = "All participant names are required";
    }
    if (!formData.projectTitle.trim()) {
      newErrors.projectTitle = "Project title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Project description is required";
    }
    if (!formData.githubLink.trim()) {
      newErrors.githubLink = "GitHub repository link is mandatory";
    } else if (!validateUrl(formData.githubLink)) {
      newErrors.githubLink = "Invalid GitHub URL";
    }
    if (formData.liveLink && !validateUrl(formData.liveLink)) {
      newErrors.liveLink = "Invalid Live Link URL";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Success
    setErrors({});
    
    // Construct project object
    const participantName = formData.submissionType === 'solo' 
      ? formData.participants[0] 
      : (formData.teamName || formData.participants[0]);

    addProject({
      submissionType: formData.submissionType,
      participantName,
      participants: formData.participants.filter(p => p.trim()),
      teamName: formData.teamName.trim() || undefined,
      projectTitle: formData.projectTitle.trim(),
      description: formData.description.trim(),
      techStack: formData.techStack.split(',').map(t => t.trim()).filter(t => t),
      liveLink: formData.liveLink.trim() || undefined,
      githubLink: formData.githubLink.trim(),
    });

    setFormData(initialForm);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 pb-12 relative">
      <div className="space-y-8">
        <header>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 uppercase">Project Intake</h2>
        </header>

        <div className="bg-indigo-600 rounded-2xl p-8 shadow-xl shadow-indigo-100 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-bold text-xl mb-2">Detailed Submission</h3>
            <p className="text-indigo-100 text-sm mb-6 max-w-sm">Please provide all necessary details about your project to ensure correct indexing.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form implementation remains the same as before */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">Submission Type</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(f => ({ ...f, submissionType: 'solo', participants: [f.participants[0] || ''] }))}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold border transition-all",
                      formData.submissionType === 'solo' 
                        ? "bg-white text-indigo-600 border-white shadow-lg" 
                        : "bg-indigo-500/30 border-indigo-400/50 text-indigo-100"
                    )}
                  >
                    <User size={16} /> Solo
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(f => ({ ...f, submissionType: 'team' }))}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold border transition-all",
                      formData.submissionType === 'team' 
                        ? "bg-white text-indigo-600 border-white shadow-lg" 
                        : "bg-indigo-500/30 border-indigo-400/50 text-indigo-100"
                    )}
                  >
                    <Users size={16} /> Team
                  </button>
                </div>
              </div>

              {/* Dynamic Participants */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-indigo-200 block">
                  {formData.submissionType === 'solo' ? 'Participant Name' : 'Team Members'}
                </label>
                <div className="space-y-2">
                  <AnimatePresence initial={false}>
                    {formData.participants.map((p, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          required
                          value={p}
                          onChange={e => handleParticipantChange(idx, e.target.value)}
                          className="flex-1 bg-indigo-500/30 border border-indigo-400/50 rounded-xl p-3 text-sm placeholder-indigo-300 outline-none focus:bg-indigo-500/50 transition-all font-sans"
                          placeholder={`${formData.submissionType === 'solo' ? 'Full name' : `Member ${idx + 1}`}`}
                        />
                        {formData.submissionType === 'team' && formData.participants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveParticipant(idx)}
                            className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 hover:bg-red-500/40 transition-all"
                          >
                            <UserMinus size={16} />
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                {formData.submissionType === 'team' && (
                  <button
                    type="button"
                    onClick={handleAddParticipant}
                    className="flex items-center gap-2 text-xs font-bold text-indigo-100 hover:text-white transition-opacity py-1"
                  >
                    <UserPlus size={14} /> Add team member
                  </button>
                )}
                {errors.participants && <p className="text-[10px] text-red-200 font-bold uppercase">{errors.participants}</p>}
              </div>

              {/* Team Name - Conditional */}
              {formData.submissionType === 'team' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">Team Name (Optional)</label>
                  <input
                    type="text"
                    value={formData.teamName}
                    onChange={e => setFormData(f => ({ ...f, teamName: e.target.value }))}
                    className="w-full bg-indigo-500/30 border border-indigo-400/50 rounded-xl p-3 text-sm placeholder-indigo-300 outline-none focus:bg-indigo-500/50 transition-all"
                    placeholder="Enter your team name"
                  />
                </div>
              )}

              {/* Project Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">Project Title</label>
                  <input
                    type="text"
                    required
                    value={formData.projectTitle}
                    onChange={e => setFormData(f => ({ ...f, projectTitle: e.target.value }))}
                    className={cn(
                      "w-full bg-indigo-500/30 border rounded-xl p-3 text-sm placeholder-indigo-300 outline-none focus:bg-indigo-500/50 transition-all",
                      errors.projectTitle ? "border-red-400" : "border-indigo-400/50"
                    )}
                    placeholder="Innovation name"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    value={formData.techStack}
                    onChange={e => setFormData(f => ({ ...f, techStack: e.target.value }))}
                    className="w-full bg-indigo-500/30 border border-indigo-400/50 rounded-xl p-3 text-sm placeholder-indigo-300 outline-none focus:bg-indigo-500/50 transition-all font-mono"
                    placeholder="e.g. Next.js, Prisma"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">GitHub Repository Link (Mandatory)</label>
                <div className="relative">
                  <Github size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300" />
                  <input
                    type="text"
                    required
                    value={formData.githubLink}
                    onChange={e => setFormData(f => ({ ...f, githubLink: e.target.value }))}
                    className={cn(
                      "w-full bg-indigo-500/30 border rounded-xl p-3 pl-9 text-sm placeholder-indigo-300 outline-none focus:bg-indigo-500/50 transition-all font-mono",
                      errors.githubLink ? "border-red-400" : "border-indigo-400/50"
                    )}
                    placeholder="https://github.com/..."
                  />
                </div>
                {errors.githubLink && <p className="text-[10px] text-red-200 font-bold uppercase">{errors.githubLink}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">Project Live Link (Optional)</label>
                <div className="relative">
                  <Link size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300" />
                  <input
                    type="text"
                    value={formData.liveLink}
                    onChange={e => setFormData(f => ({ ...f, liveLink: e.target.value }))}
                    className={cn(
                      "w-full bg-indigo-500/30 border rounded-xl p-3 pl-9 text-sm placeholder-indigo-300 outline-none focus:bg-indigo-500/50 transition-all font-mono",
                      errors.liveLink ? "border-red-400" : "border-indigo-400/50"
                    )}
                    placeholder="https://yourlink.com"
                  />
                </div>
                {errors.liveLink && <p className="text-[10px] text-red-200 font-bold uppercase">{errors.liveLink}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">Project Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                  className={cn(
                    "w-full bg-indigo-500/30 border rounded-xl p-3 text-sm placeholder-indigo-300 outline-none focus:bg-indigo-500/50 transition-all resize-none",
                    errors.description ? "border-red-400" : "border-indigo-400/50"
                  )}
                  placeholder="Explain the problem and your solution..."
                />
              </div>

              <button
                type="submit"
                disabled={isSuccess}
                className={cn(
                  "w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-shadow flex items-center justify-center gap-2",
                  isSuccess 
                    ? "bg-emerald-500 text-white" 
                    : "bg-white text-indigo-600 hover:shadow-lg active:scale-[0.98]"
                )}
              >
                {isSuccess ? (
                  <>
                    <CheckCircle2 size={16} />
                    Registration Complete
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Finalize Submission
                  </>
                )}
              </button>
            </form>
          </div>
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recent Submission</h3>
          <Terminal size={14} className="text-slate-300" />
        </div>

        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden p-8 h-full min-h-[400px] flex flex-col justify-center items-center text-center">
          {lastProject ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              key={lastProject.id}
              className="space-y-6 w-full max-w-sm"
            >
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={40} />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-2">Successfully Indexed</h3>
                <p className="text-slate-500 text-sm">Your project is now live in the global directory and visible to adjudicators.</p>
              </div>

              <div 
                onClick={() => setSelectedProject(lastProject)}
                className="p-6 bg-slate-50 border border-slate-100 rounded-3xl cursor-pointer hover:border-indigo-600 transition-all group group-hover:shadow-md"
              >
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Receipt Hash: #{lastProject.id.slice(-8)}</div>
                <div className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{lastProject.projectTitle}</div>
                <div className="text-xs text-slate-500 mt-1">Click to view audit log</div>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4 max-w-xs">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                <Terminal size={32} />
              </div>
              <div className="text-sm text-slate-400 italic">Scan pending. Submit your project to see the receipt.</div>
            </div>
          )}
        </div>
      </div>

      <ProjectDetailPanel 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </div>
  );
};
