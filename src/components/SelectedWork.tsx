import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Maximize2, Sparkles, Film, Sliders, Bookmark, BookmarkCheck, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export interface WorkItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Mathematics' | 'Computer Science' | 'Physics & Chemistry' | 'Humanities';
  year: string;
  client: string;
  location: string;
  imageUrl: string;
  description: string;
  specs: {
    camera?: string;
    lens?: string;
    aspectRatio?: string;
    runtime?: string;
    acclaim?: string;
  };
  gridSpan?: string; // e.g., 'col-span-1 md:col-span-2'
}

const WORKS: WorkItem[] = [
  {
    id: 'math-solver',
    title: 'Multivariable Calculus & Algebra Engine',
    subtitle: 'Step-by-Step Problem Solver',
    category: 'Mathematics',
    year: '2026',
    client: 'Heptagon Math Lab',
    location: 'Calculus / Linear Algebra',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1600&auto=format&fit=crop',
    description: 'Deconstruct complex differential equations, triple integrals, and matrix transformations into digestible, step-by-step mathematical proofs with instant visual breakdowns.',
    specs: {
      camera: 'Symbolic Math Parser',
      lens: 'Step-by-step Logic',
      aspectRatio: 'LaTeX Formatted',
      runtime: 'Instant',
      acclaim: 'Used by over 120,000 STEM students'
    },
    gridSpan: 'col-span-1 md:col-span-2 row-span-2'
  },
  {
    id: 'code-debugger',
    title: 'Algorithms & Data Structures Coach',
    subtitle: 'Interactive Code Explainer',
    category: 'Computer Science',
    year: '2026',
    client: 'Heptagon CS Studio',
    location: 'Python / C++ / TypeScript',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
    description: 'Instant runtime complexity analysis, memory profiling, line-by-line code debugging, and algorithm refactoring assistance in over 20 programming languages.',
    specs: {
      camera: 'Gemini Code Reasoning',
      lens: 'Big-O Inspector',
      aspectRatio: 'Syntax Highlighted',
      runtime: 'Real-time',
      acclaim: 'Top-rated CS Exam & Interview prep'
    },
    gridSpan: 'col-span-1 md:col-span-1'
  },
  {
    id: 'quantum-physics',
    title: 'Quantum Mechanics & Physical Chemistry',
    subtitle: 'Conceptual Visualizer',
    category: 'Physics & Chemistry',
    year: '2026',
    client: 'Heptagon Science Engine',
    location: 'Thermodynamics / Quantum',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop',
    description: 'Simplifies wave-particle duality, thermodynamics laws, organic synthesis reaction mechanisms, and molecular orbital diagrams into intuitive analogies.',
    specs: {
      camera: 'Physical Model AI',
      lens: 'Concept Simplifier',
      aspectRatio: 'Visual Diagrams',
      runtime: 'Instant',
      acclaim: 'AP & Honors Science Favorite'
    },
    gridSpan: 'col-span-1 md:col-span-1'
  },
  {
    id: 'essay-synthesizer',
    title: 'Thesis & Rhetorical Essay Architect',
    subtitle: 'Humanities & History Assistant',
    category: 'Humanities',
    year: '2026',
    client: 'Heptagon Rhetoric Lab',
    location: 'History / World Literature',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1600&auto=format&fit=crop',
    description: 'Structures persuasive essay arguments, synthesizes historical primary source documents, refines grammar and flow, and verifies citation formatting (APA, MLA, Chicago).',
    specs: {
      camera: 'NLP Synthesis Engine',
      lens: 'Citation Verifier',
      aspectRatio: 'Academic Prose',
      runtime: 'Instant',
      acclaim: 'AP History & English Honors Pick'
    },
    gridSpan: 'col-span-1 md:col-span-2'
  },
  {
    id: 'bio-genetics',
    title: 'Genetics & Molecular Cell Biology',
    subtitle: 'Interactive Pathways',
    category: 'Physics & Chemistry',
    year: '2026',
    client: 'Heptagon Life Science',
    location: 'DNA Replication / CRISPR',
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=1200&auto=format&fit=crop',
    description: 'Visualizes DNA transcription, central dogma of biology, cellular respiration cycles, and genetic inheritance trees.',
    specs: {
      camera: '3D Molecular AI',
      lens: 'Pathway Mapper',
      aspectRatio: 'Diagrams + Text',
      runtime: 'Instant',
      acclaim: 'Medical & AP Bio Essential'
    },
    gridSpan: 'col-span-1 md:col-span-1'
  },
  {
    id: 'literature-critique',
    title: 'World Literature & Literary Analysis',
    subtitle: 'Symbolism & Theme Extractor',
    category: 'Humanities',
    year: '2026',
    client: 'Heptagon Humanities',
    location: 'Classics / Modern Prose',
    imageUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1200&auto=format&fit=crop',
    description: 'Extracts core motifs, character archetypes, thematic paradoxes, and rhetorical devices from classic literature and philosophy.',
    specs: {
      camera: 'Hermeneutic AI',
      lens: 'Motif Scanner',
      aspectRatio: 'Annotated Text',
      runtime: 'Instant',
      acclaim: 'High School & University Lit Favorite'
    },
    gridSpan: 'col-span-1 md:col-span-1'
  }
];

const CATEGORIES = ['All', 'Saved', 'Mathematics', 'Computer Science', 'Physics & Chemistry', 'Humanities'] as const;

export function SelectedWork() {
  const { savedWorkIds, likedWorkIds, toggleSave, toggleLike } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeWorkIndex, setActiveWorkIndex] = useState<number | null>(null);

  const filteredWorks = selectedCategory === 'All'
    ? WORKS
    : selectedCategory === 'Saved'
    ? WORKS.filter((w) => savedWorkIds.includes(w.id))
    : WORKS.filter((w) => w.category === selectedCategory);

  const activeWork = activeWorkIndex !== null ? filteredWorks[activeWorkIndex] : null;

  const handleNext = useCallback(() => {
    if (activeWorkIndex === null) return;
    setActiveWorkIndex((prev) => (prev !== null ? (prev + 1) % filteredWorks.length : null));
  }, [activeWorkIndex, filteredWorks.length]);

  const handlePrev = useCallback(() => {
    if (activeWorkIndex === null) return;
    setActiveWorkIndex((prev) => (prev !== null ? (prev - 1 + filteredWorks.length) % filteredWorks.length : null));
  }, [activeWorkIndex, filteredWorks.length]);

  const handleClose = useCallback(() => {
    setActiveWorkIndex(null);
  }, []);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (activeWorkIndex === null) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeWorkIndex, handleClose, handleNext, handlePrev]);

  return (
    <section id="work" className="relative bg-black py-24 px-4 sm:px-6 overflow-hidden border-t border-white/5">
      {/* Background noise and soft ambient lighting */}
      <div className="absolute inset-0 bg-noise opacity-[0.12] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <span className="text-primary/70 text-[10px] sm:text-xs tracking-[0.2em] uppercase font-medium block mb-3">
              Academic Disciplines
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#E1E0CC] font-normal leading-[0.95] tracking-tight">
              Interactive <span className="font-serif italic text-primary">AI Modules</span>
            </h2>
          </div>

          <p className="text-primary/60 text-xs sm:text-sm max-w-md leading-relaxed">
            Exploration of Heptagon's specialized AI study engines engineered across STEM, humanities, languages, and competitive exam preparation.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar border-b border-white/10">
          <Sliders className="w-3.5 h-3.5 text-primary/40 mr-2 shrink-0 hidden sm:block" />
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-black shadow-lg'
                    : 'bg-[#101010] text-primary/60 hover:text-primary hover:bg-white/5 border border-white/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[280px] sm:auto-rows-[340px]"
        >
          <AnimatePresence mode="popLayout">
            {filteredWorks.map((work, index) => (
              <motion.div
                key={work.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                onClick={() => setActiveWorkIndex(index)}
                className={`group relative rounded-2xl overflow-hidden bg-[#101010] border border-white/10 cursor-pointer ${work.gridSpan || 'col-span-1'}`}
              >
                {/* Image */}
                <img
                  src={work.imageUrl}
                  alt={work.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-85 group-hover:opacity-100"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute inset-0 noise-overlay opacity-30 mix-blend-overlay pointer-events-none" />

                {/* Top Badges & Actions */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-primary/80 border border-white/10 pointer-events-none">
                    {work.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(work.id);
                      }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all backdrop-blur-md border ${
                        likedWorkIds.includes(work.id)
                          ? 'bg-red-500/20 text-red-400 border-red-500/40'
                          : 'bg-black/50 hover:bg-black/80 text-primary/70 border-white/10 hover:text-primary'
                      }`}
                      title={likedWorkIds.includes(work.id) ? 'Appreciated' : 'Appreciate'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${likedWorkIds.includes(work.id) ? 'fill-current text-red-400' : ''}`} />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSave(work.id);
                      }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all backdrop-blur-md border ${
                        savedWorkIds.includes(work.id)
                          ? 'bg-primary text-black border-primary font-bold'
                          : 'bg-black/50 hover:bg-black/80 text-primary/70 border-white/10 hover:text-primary'
                      }`}
                      title={savedWorkIds.includes(work.id) ? 'Saved' : 'Save'}
                    >
                      {savedWorkIds.includes(work.id) ? (
                        <BookmarkCheck className="w-3.5 h-3.5" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Bottom Content Info */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[10px] tracking-wider text-primary/60 uppercase font-mono mb-1">
                        {work.subtitle}
                      </p>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-normal text-[#E1E0CC] group-hover:text-primary transition-colors flex items-center gap-2">
                        {work.title}
                      </h3>
                    </div>

                    <div className="w-9 h-9 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-black text-primary border border-primary/20 flex items-center justify-center shrink-0 transition-all duration-300 transform group-hover:scale-110">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* FULL SCREEN DARK LIGHTBOX OVERLAY */}
      <AnimatePresence>
        {activeWork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col justify-between overflow-y-auto"
          >
            {/* Ambient Overlay FX */}
            <div className="absolute inset-0 noise-overlay opacity-[0.25] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 pointer-events-none" />

            {/* LIGHTBOX HEADER */}
            <div className="relative z-20 flex items-center justify-between px-6 py-6 border-b border-white/10 max-w-7xl mx-auto w-full">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs text-primary/60 font-mono tracking-widest">
                  <Film className="w-3.5 h-3.5 text-primary" />
                  <span>
                    {(activeWorkIndex ?? 0) + 1 < 10 ? `0${(activeWorkIndex ?? 0) + 1}` : (activeWorkIndex ?? 0) + 1}
                  </span>
                  <span>/</span>
                  <span>
                    {filteredWorks.length < 10 ? `0${filteredWorks.length}` : filteredWorks.length}
                  </span>
                </div>
                <span className="hidden sm:inline-block text-white/20">|</span>
                <span className="hidden sm:inline-block text-xs text-primary/80 uppercase tracking-widest font-mono">
                  {activeWork.category}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] text-primary/40 uppercase tracking-widest hidden md:inline-block">
                  Press ESC to close • Use ← → keys
                </span>
                <button
                  onClick={handleClose}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 text-primary border border-white/15 flex items-center justify-center transition-all cursor-pointer hover:rotate-90 duration-300"
                  aria-label="Close Lightbox"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* LIGHTBOX MAIN CONTENT */}
            <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto w-full p-4 sm:p-8 md:p-12 gap-8 my-auto">
              {/* Navigation Left Button */}
              <button
                onClick={handlePrev}
                className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-primary hover:text-black text-primary border border-white/15 items-center justify-center transition-all duration-300 cursor-pointer z-30 shadow-2xl backdrop-blur-md"
                aria-label="Previous Work"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Central Image Container */}
              <div className="relative w-full lg:w-2/3 max-h-[60vh] lg:max-h-[72vh] flex items-center justify-center rounded-2xl overflow-hidden border border-white/10 bg-[#080808] group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeWork.id}
                    src={activeWork.imageUrl}
                    alt={activeWork.title}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full max-h-[60vh] lg:max-h-[72vh] object-contain"
                  />
                </AnimatePresence>

                {/* Mobile Navigation Arrows Overlay */}
                <div className="flex md:hidden absolute inset-x-2 top-1/2 -translate-y-1/2 justify-between pointer-events-none z-30">
                  <button
                    onClick={handlePrev}
                    className="w-10 h-10 rounded-full bg-black/70 text-primary border border-white/20 flex items-center justify-center pointer-events-auto"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-10 h-10 rounded-full bg-black/70 text-primary border border-white/20 flex items-center justify-center pointer-events-auto"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Navigation Right Button */}
              <button
                onClick={handleNext}
                className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-primary hover:text-black text-primary border border-white/15 items-center justify-center transition-all duration-300 cursor-pointer z-30 shadow-2xl backdrop-blur-md"
                aria-label="Next Work"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Project Info Panel */}
              <motion.div
                key={activeWork.id + '-info'}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="w-full lg:w-1/3 flex flex-col justify-between space-y-6 bg-[#101010] p-6 sm:p-8 rounded-2xl border border-white/10"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <span className="text-xs text-primary/60 font-mono uppercase tracking-widest">
                      {activeWork.client}
                    </span>
                    <span className="text-xs text-primary/80 font-mono bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                      {activeWork.location}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-primary/50 uppercase tracking-widest block font-mono">
                      {activeWork.subtitle}
                    </span>
                    <h3 className="text-2xl sm:text-3xl text-[#E1E0CC] font-normal leading-tight mt-1">
                      {activeWork.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-primary/70 leading-relaxed font-light">
                    {activeWork.description}
                  </p>

                  {/* Interactive Firestore Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => toggleSave(activeWork.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                        savedWorkIds.includes(activeWork.id)
                          ? 'bg-primary text-black border-primary'
                          : 'bg-white/5 hover:bg-white/10 text-primary border-white/15'
                      }`}
                    >
                      {savedWorkIds.includes(activeWork.id) ? (
                        <>
                          <BookmarkCheck className="w-4 h-4" />
                          <span>Saved to Library</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-4 h-4" />
                          <span>Save Project</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => toggleLike(activeWork.id)}
                      className={`p-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                        likedWorkIds.includes(activeWork.id)
                          ? 'bg-red-500/20 text-red-400 border-red-500/40'
                          : 'bg-white/5 hover:bg-white/10 text-primary/70 hover:text-primary border-white/15'
                      }`}
                      title="Appreciate Work"
                    >
                      <Heart className={`w-4 h-4 ${likedWorkIds.includes(activeWork.id) ? 'fill-current text-red-400' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Technical Specs & Acclaim */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <span className="text-[10px] text-primary/50 uppercase tracking-widest font-mono block">
                    Technical Specifications
                  </span>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {activeWork.specs.camera && (
                      <div className="bg-black/50 p-2.5 rounded-lg border border-white/5">
                        <span className="text-primary/40 text-[9px] block">CAMERA</span>
                        <span className="text-primary/90 text-[11px]">{activeWork.specs.camera}</span>
                      </div>
                    )}
                    {activeWork.specs.lens && (
                      <div className="bg-black/50 p-2.5 rounded-lg border border-white/5">
                        <span className="text-primary/40 text-[9px] block">LENS</span>
                        <span className="text-primary/90 text-[11px]">{activeWork.specs.lens}</span>
                      </div>
                    )}
                    {activeWork.specs.aspectRatio && (
                      <div className="bg-black/50 p-2.5 rounded-lg border border-white/5">
                        <span className="text-primary/40 text-[9px] block">ASPECT RATIO</span>
                        <span className="text-primary/90 text-[11px]">{activeWork.specs.aspectRatio}</span>
                      </div>
                    )}
                    {activeWork.specs.runtime && (
                      <div className="bg-black/50 p-2.5 rounded-lg border border-white/5">
                        <span className="text-primary/40 text-[9px] block">RUNTIME</span>
                        <span className="text-primary/90 text-[11px]">{activeWork.specs.runtime}</span>
                      </div>
                    )}
                  </div>

                  {activeWork.specs.acclaim && (
                    <div className="mt-3 flex items-start gap-2 bg-primary/10 border border-primary/20 p-3 rounded-lg text-xs text-primary">
                      <Sparkles className="w-4 h-4 shrink-0 text-primary mt-0.5" />
                      <span className="font-medium text-[11px]">{activeWork.specs.acclaim}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* LIGHTBOX FOOTER / THUMBNAIL STRIP */}
            <div className="relative z-20 px-6 py-4 border-t border-white/10 max-w-7xl mx-auto w-full flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {filteredWorks.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveWorkIndex(idx)}
                    className={`w-12 h-10 rounded-lg overflow-hidden border transition-all cursor-pointer shrink-0 ${
                      idx === activeWorkIndex
                        ? 'border-primary ring-2 ring-primary/40 scale-105'
                        : 'border-white/10 opacity-40 hover:opacity-80'
                    }`}
                  >
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-4">
                <button
                  onClick={handlePrev}
                  className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-primary text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </button>
                <button
                  onClick={handleNext}
                  className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-primary text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
