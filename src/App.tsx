import { useState } from 'react';
import { ArrowRight, MessageSquare, Sparkles, BookOpen, GraduationCap, Brain, CheckCircle2 } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { WordsPullUp } from './components/WordsPullUp';
import { WordsPullUpMultiStyle } from './components/WordsPullUpMultiStyle';
import { ScrollRevealText } from './components/AnimatedLetter';
import { FeatureCard, CheckItem } from './components/FeatureCard';
import { SelectedWork } from './components/SelectedWork';
import { Newsletter } from './components/Newsletter';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { UserNav } from './components/UserNav';
import { ContactDrawer } from './components/ContactDrawer';
import { CustomCursor } from './components/CustomCursor';
import { StudentAITutor } from './components/StudentAITutor';

export default function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isNavHidden, setIsNavHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 120) {
      setIsNavHidden(true);
    } else {
      setIsNavHidden(false);
    }
  });

  const scrollToAi = () => {
    const element = document.getElementById('heptagon-ai');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <CustomCursor />
        <main className="bg-black text-primary selection:bg-primary selection:text-black min-h-screen font-sans">
        {/* SECTION 1: HERO */}
        <section className="relative h-screen p-4 md:p-6 overflow-hidden">
          <div className="relative h-full w-full rounded-2xl md:rounded-[2rem] overflow-hidden bg-black">
            {/* Background Video / Visual */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            >
              <source
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
                type="video/mp4"
              />
            </video>

            {/* Overlays */}
            <div className="absolute inset-0 noise-overlay opacity-[0.7] mix-blend-overlay pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80 pointer-events-none" />

            {/* Floating Auto-Hiding Navbar */}
            <motion.nav
              variants={{
                visible: { y: 0, opacity: 1 },
                hidden: { y: '-130%', opacity: 0 },
              }}
              animate={isNavHidden ? 'hidden' : 'visible'}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-50"
            >
              <div className="bg-black/85 backdrop-blur-md rounded-2xl md:rounded-3xl px-4 py-2 md:px-8 flex items-center gap-3 sm:gap-5 md:gap-8 border border-white/15 shadow-2xl">
                {[
                  { name: 'AI Tutor', href: '#heptagon-ai' },
                  { name: 'Disciplines', href: '#disciplines' },
                  { name: 'Methodology', href: '#methodology' },
                  { name: 'Features', href: '#features' },
                ].map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-[10px] sm:text-xs md:text-sm transition-colors cursor-pointer whitespace-nowrap"
                    style={{ color: 'rgba(225, 224, 204, 0.8)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#E1E0CC')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(225, 224, 204, 0.8)')}
                  >
                    {link.name}
                  </a>
                ))}

                <button
                  onClick={() => setIsContactOpen(true)}
                  className="flex items-center gap-1.5 text-[10px] sm:text-xs md:text-sm text-primary/90 hover:text-primary transition-all cursor-pointer whitespace-nowrap bg-white/5 hover:bg-white/10 border border-white/15 px-3 py-1.5 rounded-full"
                >
                  <MessageSquare className="w-3 h-3 text-primary" />
                  <span>Support</span>
                </button>

                <ThemeToggle />

                <div className="pl-1 border-l border-white/15">
                  <UserNav />
                </div>
              </div>
            </motion.nav>

            {/* Hero Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-end">
                <div className="md:col-span-8">
                  <WordsPullUp
                    text="Heptagon"
                    showAsterisk
                    className="text-[20vw] sm:text-[18vw] md:text-[16vw] lg:text-[15vw] xl:text-[14vw] 2xl:text-[15vw] font-medium leading-[0.85] tracking-[-0.07em]"
                    style={{ color: '#E1E0CC' }}
                  />
                </div>

                <div className="md:col-span-4 flex flex-col gap-6">
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-primary/80 text-xs sm:text-sm md:text-base leading-relaxed font-light"
                  >
                    <span className="font-medium text-primary">Heptagon</span> is an AI study engine built for students. Deconstruct complex homework questions, solve step-by-step math problems, and master academic subjects effortlessly.
                  </motion.p>

                  <motion.button
                    onClick={scrollToAi}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="group flex items-center justify-between bg-primary text-black rounded-full pl-6 pr-1.5 py-1.5 w-fit gap-2 hover:gap-3 transition-all cursor-pointer shadow-xl"
                  >
                    <span className="font-medium text-sm sm:text-base flex items-center gap-2">
                      <Sparkles className="w-4 h-4 fill-black" />
                      Ask Heptagon AI
                    </span>
                    <div className="bg-black rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-transform group-hover:scale-110 shrink-0">
                      <ArrowRight className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: INTERACTIVE STUDENT AI TUTOR ENGINE */}
        <StudentAITutor />

        {/* SECTION 3: VISION & METHODOLOGY */}
        <section id="methodology" className="bg-black py-24 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto bg-[#101010] rounded-[2rem] p-8 sm:p-16 md:p-24 text-center border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <span className="text-primary text-[10px] sm:text-xs tracking-widest uppercase mb-8 block font-mono">
              Academic Intelligence
            </span>

            <WordsPullUpMultiStyle
              segments={[
                { text: 'I am Heptagon AI,', className: 'font-normal' },
                { text: 'your 24/7 personal student tutor.', className: 'font-serif italic text-primary' },
                { text: 'Trained to answer homework questions with clarity and step-by-step precision.', className: 'font-normal' },
              ]}
              className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl max-w-4xl mx-auto leading-[1.05]"
            />

            <ScrollRevealText
              text="From high school calculus and AP physics to university-level data structures and rhetorical essays, Heptagon breaks down tough concepts into intuitive step-by-step explanations, practice problems, and key takeaways."
              className="mt-10 text-[#DEDBC8] text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-light"
            />
          </div>
        </section>

        {/* SECTION 4: DISCIPLINES & MODULES */}
        <div id="disciplines">
          <SelectedWork />
        </div>

        {/* SECTION 5: FEATURES & WORKFLOWS */}
        <section id="features" className="relative min-h-screen bg-black py-24 px-4 sm:px-6 overflow-hidden">
          <div className="absolute inset-0 bg-noise opacity-[0.15] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="mb-12 sm:mb-16 text-center md:text-left">
              <WordsPullUpMultiStyle
                segments={[
                  { text: 'Engineered for student mastery.', className: 'text-primary font-normal' },
                  { text: ' Smart tools for homework, exams, and deep research.', className: 'text-gray-500 font-normal' },
                ]}
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-2 md:gap-1 lg:h-[480px]">
              {/* Card 1 - Video Canvas Card */}
              <FeatureCard delay={0}>
                <div className="relative h-full w-full min-h-[320px] lg:min-h-0 overflow-hidden rounded-xl border border-white/5">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  >
                    <source
                      src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4"
                      type="video/mp4"
                    />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-[#E1E0CC] font-medium text-base sm:text-lg">
                      Your AI Study Companion.
                    </p>
                  </div>
                </div>
              </FeatureCard>

              {/* Card 2 - Step-by-Step Solver */}
              <FeatureCard
                delay={0.15}
                title="Step-by-Step Problem Solver."
                num="01"
                icon="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85"
              >
                <CheckItem text="Deconstructs math proofs & integrals" />
                <CheckItem text="Line-by-line code debugging" />
                <CheckItem text="Formatted formulas & LaTeX math" />
                <CheckItem text="Saved query history" />
              </FeatureCard>

              {/* Card 3 - Concept Simplifier */}
              <FeatureCard
                delay={0.3}
                title="Concept Simplifier & Essay Builder."
                num="02"
                icon="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85"
              >
                <CheckItem text="Explains complex science concepts" />
                <CheckItem text="Rhetorical thesis statement generator" />
                <CheckItem text="Citation formatting (APA, MLA)" />
              </FeatureCard>

              {/* Card 4 - Exam Prep Engine */}
              <FeatureCard
                delay={0.45}
                title="Exam & Practice Prep."
                num="03"
                icon="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85"
              >
                <CheckItem text="Generates custom follow-up quizzes" />
                <CheckItem text="AP / University level tuning" />
                <CheckItem text="Instant key takeaway summaries" />
              </FeatureCard>
            </div>
          </div>
        </section>

        {/* SECTION 6: ACADEMIC NEWSLETTER */}
        <Newsletter />

        {/* CONTACT DRAWER */}
        <ContactDrawer isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      </main>
    </AuthProvider>
  </ThemeProvider>
  );
}
