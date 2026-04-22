import React, { useState, useRef, useEffect } from 'react';
import { Project, ChatMessage } from '../types';
import { Send, Bot, User, Sparkles, Trash2, Command, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

interface ChatbotProps {
  projects: Project[];
}

export const Chatbot: React.FC<ChatbotProps> = ({ projects }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "I am the HackHub Intelligence System. I have full access to all project logs and submission data. How can I assist you today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    setError(null);
    const userMsg: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured.");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const projectContext = projects.map(p => ({
        id: p.id,
        title: p.projectTitle,
        participant: p.participantName,
        team: p.teamName,
        members: p.participants,
        description: p.description,
        tech: p.techStack,
        isWinner: p.isWinner,
        submittedAt: p.submittedAt
      }));

      const systemInstruction = `
        You are the HackHub Portal Assistant, a specialized AI for a hackathon management system.
        You have access to the current project submissions dataset.
        
        DATASET CONTEXT:
        ${JSON.stringify(projectContext, null, 2)}
        
        GOALS:
        1. Answer questions about specific projects, participants, or tech stacks.
        2. Identify winners and top performers.
        3. Provide statistics if asked (e.g., number of projects using React).
        4. Be helpful, concise, and professional.
        5. If a project is not in the dataset, inform the user clearly.
        6. Always refer to the data provided in the context.
        7. Maintain a "hacker" or "technical specialist" persona: efficient, knowledgeable, and slightly tech-forward.
        
        If asked general questions NOT related to the hackathon, try to pivot back or answer them briefly while maintaining your persona as the portal assistant.
        Use Markdown for all your responses. Use tables or lists for comparisons or data summaries.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: messages.concat(userMsg).map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const botText = response.text || "I processed your request but encountered an empty response. Please try rephrasing.";
      
      const botResponse: ChatMessage = {
        role: 'assistant',
        content: botText,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (err: any) {
      console.error("Gemini API Error, falling back to Regex:", err);
      
      // REGEX FALLBACK MECHANISM
      const query = input.toLowerCase();
      let fallbackText = '';

      if (query.match(/how many|total|count/i)) {
        fallbackText = `The system currently indexes **${projects.length} project submissions**.`;
      } else if (query.match(/winner|top|won|champion/i)) {
        const winners = projects.filter(p => p.isWinner);
        if (winners.length > 0) {
          fallbackText = "### Adjudicated Winners\n\n" + winners.map(w => `- **${w.projectTitle}** by ${w.participantName}`).join('\n');
        } else {
          fallbackText = "No winners have been announced yet. Adjudication is in progress.";
        }
      } else if (query.match(/tech|stack|using|language|tools/i)) {
        const techCounts: Record<string, number> = {};
        projects.forEach(p => p.techStack.forEach(t => {
          techCounts[t] = (techCounts[t] || 0) + 1;
        }));
        fallbackText = "### Technical Distribution\n\n| Technology | Usage count |\n| --- | --- |\n" + 
          Object.entries(techCounts).map(([k, v]) => `| ${k} | ${v} |`).join('\n');
      } else if (query.match(/find|search|where is|who is/i)) {
        const term = query.split(/find|search|where is|who is/i)[1]?.trim();
        if (term) {
          const results = projects.filter(p => 
            p.projectTitle.toLowerCase().includes(term) || 
            p.participantName.toLowerCase().includes(term) ||
            p.techStack.some(t => t.toLowerCase().includes(term))
          );
          if (results.length > 0) {
            fallbackText = `Found **${results.length}** matches for "${term}":\n\n` + 
              results.map(r => `- **${r.projectTitle}** (${r.participantName})`).join('\n');
          } else {
            fallbackText = `No exact matches found for "${term}" in the current archive.`;
          }
        } else {
          fallbackText = "Please specify a search term (e.g., 'find [project name]').";
        }
      } else {
        fallbackText = "Gemini is currently unavailable and I couldn't match your query with standard patterns. \n\n*Try asking about 'total projects', 'winners', or 'tech stacks'.*";
      }

      const botResponse: ChatMessage = {
        role: 'assistant',
        content: `**[FALLBACK ACTIVE]**\n\n${fallbackText}`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-5rem)] flex flex-col bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
      {/* Chat Header */}
      <div className="p-4 bg-slate-800 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="text-white text-sm font-bold tracking-tight leading-none mb-1">HackHub Intelligence</h3>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Gemini 3 Flash • Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none">Dataset Sync</span>
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-tighter">{projects.length} Entries Loaded</span>
          </div>
          <button 
            onClick={() => setMessages([messages[0]])}
            className="p-2 hover:bg-slate-700 rounded-xl transition-all text-slate-400 hover:text-white active:scale-95"
            title="Clear context"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth scrollbar-thin scrollbar-thumb-slate-800"
      >
        <AnimatePresence initial={false}>
          {messages.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex items-start gap-4",
                m.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-lg",
                m.role === 'user' ? "bg-indigo-600 text-white" : "bg-slate-800 text-indigo-400 border border-slate-700"
              )}>
                {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              
              <div className={cn(
                "flex flex-col gap-1 max-w-[85%]",
                m.role === 'user' ? "items-end" : "items-start"
              )}>
                <div className={cn(
                  "p-5 text-sm leading-relaxed shadow-sm markdown-body",
                  m.role === 'user' 
                    ? "bg-indigo-600 text-white rounded-2xl rounded-tr-none" 
                    : "bg-slate-800 text-slate-300 rounded-2xl rounded-tl-none border border-slate-700"
                )}>
                  <div className="prose prose-invert prose-xs max-w-none prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                </div>
                <div className={cn(
                  "text-[9px] font-bold uppercase tracking-widest opacity-40 px-1",
                  m.role === 'user' ? "text-indigo-100" : "text-slate-500"
                )}>
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex gap-4 items-start"
             >
               <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 shrink-0">
                 <Loader2 size={14} className="animate-spin" />
               </div>
               <div className="p-4 bg-slate-800 rounded-2xl rounded-tl-none border border-slate-700 flex gap-1.5 items-center">
                 <div className="w-1.5 h-1.5 bg-indigo-500/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                 <div className="w-1.5 h-1.5 bg-indigo-500/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                 <div className="w-1.5 h-1.5 bg-indigo-500/50 rounded-full animate-bounce" />
               </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="p-6 bg-slate-800/30 border-t border-slate-800">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3"
          >
            <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
            <span className="text-[10px] text-red-200 font-medium leading-relaxed">{error}</span>
          </motion.div>
        )}
        
        <div className="relative flex items-center group">
          <input
            type="text"
            placeholder="Query directory or ask about projects..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            disabled={isTyping}
            className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 pl-5 pr-14 outline-none text-base text-slate-200 placeholder-slate-600 focus:border-indigo-500 transition-all focus:ring-4 ring-indigo-500/10 disabled:opacity-50"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-3 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 active:scale-95 transition-all disabled:opacity-20 shadow-lg shadow-indigo-600/20"
          >
            {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
        <div className="mt-3 flex flex-col items-center gap-2">
          <div className="flex items-center justify-center gap-4 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
             <div className="flex items-center gap-1.5">
               <Command size={10} /> <span>Enter to Send</span>
             </div>
             <div className="w-1 h-1 rounded-full bg-slate-700"></div>
             <span>AI-Powered RAG</span>
          </div>
          <div className="text-[9px] text-slate-500 font-medium italic">
            Regex Fallback Syntax: Search using keywords like "total", "winners", "tech", or "find [term]".
          </div>
        </div>
      </div>
    </div>
  );
};
