import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Send,
  BookOpen,
  GraduationCap,
  Calculator,
  Code,
  Atom,
  PenTool,
  Check,
  Copy,
  RotateCcw,
  Bot,
  User,
  ArrowRight,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ThemeToggle } from './ThemeToggle';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  subject?: string;
}

const SAMPLE_QUESTIONS = [
  {
    icon: Calculator,
    title: 'Math & Physics',
    prompt: 'How do I evaluate the integral of x · sin(x) dx step-by-step using integration by parts?',
  },
  {
    icon: Code,
    title: 'Computer Science',
    prompt: 'Explain Big O notation and compare O(n) vs O(n log n) with simple code examples.',
  },
  {
    icon: Atom,
    title: 'Biology & Chemistry',
    prompt: 'Explain the light-dependent reactions of photosynthesis in clear, easy steps.',
  },
  {
    icon: PenTool,
    title: 'Essay & History',
    prompt: 'How should I structure a thesis statement and outline for an AP European History essay?',
  },
];

const SUBJECTS = [
  'General Academic',
  'Mathematics',
  'Physics & Chemistry',
  'Computer Science & AI',
  'Biology & Life Sciences',
  'History & Literature',
  'Essay & Language Arts',
];

const LEVELS = ['High School', 'AP / Honors', 'Undergraduate', 'Graduate / Advanced'];

export function StudentAITutor() {
  const [question, setQuestion] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('General Academic');
  const [selectedLevel, setSelectedLevel] = useState('High School');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleAsk = async (customPrompt?: string) => {
    const promptToSubmit = customPrompt || question;
    if (!promptToSubmit.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: promptToSubmit.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      subject: selectedSubject,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setQuestion('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/student-ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: promptToSubmit,
          subject: selectedSubject,
          level: selectedLevel,
          chatHistory: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to communicate with Heptagon AI.');
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error('Error asking Heptagon AI:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `**Heptagon AI System Note**: ${
          error?.message || 'Unable to connect to Heptagon AI services. Please try again in a moment.'
        }`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReset = () => {
    setMessages([]);
    setQuestion('');
  };

  return (
    <section id="heptagon-ai" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#080808] text-primary overflow-hidden border-t border-b border-white/10">
      {/* Background Grid & Glows */}
      <div className="absolute inset-0 bg-noise opacity-[0.1] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header Title */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span>Heptagon AI Student Engine</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#E1E0CC] tracking-tight">
            Ask <span className="font-serif italic text-primary">Heptagon AI</span> Anything
          </h2>

          <p className="text-xs sm:text-sm text-primary/70 max-w-2xl mx-auto leading-relaxed font-light">
            Instant step-by-step solutions, conceptual simplifications, essay outlines, and code explanations engineered for academic excellence.
          </p>
        </div>

        {/* Controls: Subject & Academic Level */}
        <div className="bg-[#101010] border border-white/10 rounded-2xl p-4 sm:p-6 mb-8 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Subject Selector */}
            <div className="space-y-1.5 flex-1">
              <label className="text-[10px] uppercase font-mono tracking-widest text-primary/60 block">
                Target Subject
              </label>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.slice(0, 5).map((subj) => (
                  <button
                    key={subj}
                    onClick={() => setSelectedSubject(subj)}
                    className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                      selectedSubject === subj
                        ? 'bg-primary text-black font-medium border border-primary'
                        : 'bg-white/5 hover:bg-white/10 text-primary/70 border border-white/10'
                    }`}
                  >
                    {subj}
                  </button>
                ))}
              </div>
            </div>

            {/* Level Selector & Theme Accessibility */}
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-widest text-primary/60 block">
                  Academic Level
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {LEVELS.map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setSelectedLevel(lvl)}
                      className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                        selectedLevel === lvl
                          ? 'bg-primary/20 text-primary border border-primary font-medium'
                          : 'bg-white/5 text-primary/50 hover:text-primary border border-white/10'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-widest text-primary/60 block">
                  Study Vision
                </label>
                <ThemeToggle className="py-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Chat / Q&A Output Display */}
        <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl min-h-[420px] max-h-[600px] flex flex-col justify-between overflow-hidden shadow-2xl relative">
          {messages.length === 0 ? (
            /* Empty State: Starter Question Cards */
            <div className="p-6 sm:p-10 flex flex-col items-center justify-center my-auto text-center space-y-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
                <GraduationCap className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-md">
                <h3 className="text-lg text-[#E1E0CC] font-normal">
                  What would you like to solve or learn today?
                </h3>
                <p className="text-xs text-primary/60 font-light">
                  Select a prompt below or type your custom homework question into the input field.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-3xl text-left">
                {SAMPLE_QUESTIONS.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAsk(item.prompt)}
                      className="group p-4 rounded-xl bg-[#141414] hover:bg-white/10 border border-white/10 hover:border-primary/40 transition-all cursor-pointer flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-primary/60 flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5 text-primary" />
                          {item.title}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-primary/40 group-hover:text-primary transition-transform group-hover:translate-x-1" />
                      </div>
                      <p className="text-xs text-[#E1E0CC] font-light leading-snug line-clamp-2">
                        "{item.prompt}"
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Active Message Stream */
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs text-primary/60">
                <span className="flex items-center gap-2 font-mono">
                  <Bot className="w-4 h-4 text-primary" /> Heptagon Learning Session ({selectedSubject} - {selectedLevel})
                </span>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-[11px] text-primary/60 hover:text-primary hover:bg-white/5 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear Session</span>
                </button>
              </div>

              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-3.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center shrink-0 text-xs font-bold font-mono">
                      H
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-primary text-black rounded-tr-none font-medium'
                        : 'bg-[#141414] text-[#E1E0CC] border border-white/10 rounded-tl-none font-light'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="space-y-3 relative group">
                        <div className="flex items-center justify-between text-[10px] text-primary/50 font-mono pb-1 border-b border-white/5">
                          <span>HEPTAGON AI TUTOR</span>
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="flex items-center gap-1 text-primary/60 hover:text-primary cursor-pointer transition-colors"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>

                        <div className="prose prose-invert prose-xs max-w-none space-y-2">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      </div>
                    ) : (
                      <p>{msg.content}</p>
                    )}

                    <div
                      className={`text-[9px] mt-2 font-mono ${
                        msg.role === 'user' ? 'text-black/60 text-right' : 'text-primary/40'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-white/10 text-primary border border-white/15 flex items-center justify-center shrink-0 text-xs font-bold">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-3 text-xs text-primary/70 font-mono">
                  <div className="w-7 h-7 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center animate-spin">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="animate-pulse">Heptagon AI is formulating step-by-step logic...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          )}

          {/* Bottom Question Input Bar */}
          <div className="p-4 border-t border-white/10 bg-[#080808]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAsk();
              }}
              className="flex items-center gap-2 bg-[#141414] border border-white/15 focus-within:border-primary rounded-xl p-2 transition-all"
            >
              <input
                type="text"
                placeholder={`Ask Heptagon AI a ${selectedSubject} question...`}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={isLoading}
                className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-primary placeholder:text-primary/30 outline-none"
              />

              <button
                type="submit"
                disabled={!question.trim() || isLoading}
                className="bg-primary hover:bg-[#ECE8D5] text-black font-medium px-4 py-2.5 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <span>Ask</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
