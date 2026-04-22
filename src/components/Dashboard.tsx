import React, { useState } from 'react';
import { Project } from '../types';
import { Trophy, Users, FileCheck, Code2, TrendingUp, Calendar } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Cell
} from 'recharts';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { ProjectDetailPanel } from './ProjectDetailPanel';

interface DashboardProps {
  projects: Project[];
}

export const Dashboard: React.FC<DashboardProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const winners = [...projects].sort((a, b) => b.score - a.score).slice(0, 3);
  
  const techCounts: Record<string, number> = {};
  projects.forEach(p => {
    p.techStack.forEach(tech => {
      techCounts[tech] = (techCounts[tech] || 0) + 1;
    });
  });

  const chartData = Object.entries(techCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  const timelineData = projects
    .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime())
    .map(p => ({
      date: new Date(p.submittedAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      submissions: 1
    }));

  const stats = [
    { label: 'Total Participants', value: projects.length, icon: Users, color: 'text-blue-600' },
    { label: 'Submissions', value: projects.length, icon: FileCheck, color: 'text-green-600' },
    { label: 'Avg Tech / Project', value: (projects.reduce((acc, p) => acc + p.techStack.length, 0) / projects.length || 0).toFixed(1), icon: Code2, color: 'text-purple-600' },
    { label: 'Active Tracks', value: 4, icon: TrendingUp, color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">Hackathon Overview</h2>
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            LIVE SESSION
          </span>
          <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
            <img src="https://picsum.photos/seed/user/100/100" alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-center relative overflow-hidden group hover:shadow-md transition-shadow"
          >
            <div className={cn("p-2 rounded-lg w-fit mb-3", stat.color.replace('text-', 'bg-').replace('-600', '-50'))}>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{stat.label}</span>
            <div className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Winners - PROMOTE TO MAIN VIEW */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm h-full">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-50 rounded-2xl">
                  <Trophy size={24} className="text-amber-600" />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-slate-900">Hall of Fame</h2>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">Top Adjudicated Innovations</p>
                </div>
              </div>
              <button className="text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-colors tracking-widest uppercase border border-indigo-100">Full Standings</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {winners.map((winner, idx) => (
                <div 
                  key={winner.id} 
                  className={cn(
                    "flex flex-col p-6 rounded-[2rem] border transition-all hover:shadow-xl hover:shadow-indigo-50 group relative",
                    idx === 0 
                      ? "bg-slate-900 border-slate-800 text-white md:scale-105 z-10 shadow-2xl shadow-indigo-200/20" 
                      : "bg-white border-slate-100 text-slate-900"
                  )}
                >
                  {idx === 0 && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                      Champion
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner",
                      idx === 0 ? "bg-white/10 text-white" : 
                      idx === 1 ? "bg-slate-100 text-slate-600" : "bg-amber-50 text-amber-600"
                    )}>
                      {idx + 1}
                    </div>
                    <div className={cn(
                      "text-[10px] font-mono px-3 py-1 rounded-lg border",
                      idx === 0 ? "bg-white/5 border-white/10 text-indigo-300" : "bg-slate-50 border-slate-100 text-slate-400"
                    )}>
                      {winner.score} PTS
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <h4 className={cn("font-bold text-lg leading-tight mb-1", idx === 0 ? "text-white" : "text-slate-900 group-hover:text-indigo-600 transition-colors")}>
                        {winner.projectTitle}
                      </h4>
                      <p className={cn("text-xs font-bold uppercase tracking-tight", idx === 0 ? "text-slate-400" : "text-slate-500")}>
                        by {winner.participantName}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {winner.techStack.slice(0, 2).map(tech => (
                        <span key={tech} className={cn(
                          "text-[8px] font-bold px-2 py-0.5 rounded",
                          idx === 0 ? "bg-white/5 text-slate-400 border border-white/10" : "bg-slate-50 text-slate-500 border border-slate-200"
                        )}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={cn(
                    "mt-6 pt-4 border-t flex items-center justify-between",
                    idx === 0 ? "border-white/5" : "border-slate-50"
                  )}>
                    <div className="flex items-center gap-2">
                       <Users size={12} className={idx === 0 ? "text-slate-500" : "text-slate-400"} />
                       <span className={cn("text-[10px] font-bold", idx === 0 ? "text-slate-500" : "text-slate-400")}>
                        {winner.submissionType}
                       </span>
                    </div>
                    <button 
                      onClick={() => setSelectedProject(winner)}
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg transition-colors border",
                        idx === 0 
                          ? "bg-white text-slate-900 border-white hover:bg-indigo-50" 
                          : "bg-slate-900 text-white border-slate-900 hover:bg-indigo-600"
                      )}
                    >
                      Profile
                    </button>
                  </div>
                </div>
              ))}
              {winners.length === 0 && (
                <div className="col-span-3 py-16 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                  <p className="text-sm text-slate-400 italic">The scoreboard is awaiting its first entries.</p>
                </div>
              )}
            </div>

            <div className="mt-8 p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 text-indigo-600 p-2.5 rounded-xl shadow-sm">
                  <Calendar size={18} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Next Award cycle</div>
                  <div className="font-bold text-slate-900">May 24, 2024 at 18:00 UTC</div>
                </div>
              </div>
              <div className="hidden sm:block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Automated Adjudication Status: <span className="text-emerald-500 ml-1">Optimized</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Distribution - RELOCATED & COMPACTED */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Code2 size={16} className="text-indigo-600" />
                <h3 className="font-bold text-slate-800 text-sm">Tech Distribution</h3>
              </div>
            </div>
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: -20, right: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category"
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontFamily: 'sans-serif', fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                    width={80}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc', radius: 4 }} 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      color: '#f8fafc', 
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '11px'
                    }} 
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#e2e8f0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold uppercase text-slate-400 tracking-wider">
               <span>Total Stacks: {Object.keys(techCounts).length}</span>
               <TrendingUp size={12} className="text-emerald-500" />
            </div>
          </div>

          <div className="p-6 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h2 className="font-black text-xl mb-2 flex items-center gap-2">
                LIVE <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              </h2>
              <p className="text-indigo-100 text-xs font-medium leading-relaxed opacity-90">
                Submissions are trending up. Complete your entry before the next assessment.
              </p>
            </div>
            <TrendingUp size={120} className="text-white/5 absolute -right-8 -bottom-8 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
          </div>
        </div>
      </div>
      <ProjectDetailPanel 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </div>
  );
};
