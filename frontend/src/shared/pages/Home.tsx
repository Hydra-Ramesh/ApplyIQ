import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Bot, Sparkles, Zap, ShieldCheck, MapPin, Mail, Phone, Star, FileText, CheckCircle2, ArrowRight, Flame, Target, Activity } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<HTMLHeadingElement[]>([]);
  const cardsRef = useRef<HTMLDivElement>(null);

  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/public/testimonials`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTestimonials(data);
        } else {
          // Fallback static testimonials if none exist yet
          setTestimonials([
            { _id: '1', name: 'John Doe', role: 'Software Engineer II, Meta', rating: 5, message: 'ApplyIQ literally rewrote my entire experience section in 30 seconds. I got 3 interviews the next week.' },
            { _id: '2', name: 'Alice Smith', role: 'Product Manager, Stripe', rating: 5, message: 'The LaTeX generation is flawless. This output is pixel-perfect and passes the ATS every time.' },
            { _id: '3', name: 'Michael Kim', role: 'Data Scientist, Amazon', rating: 4, message: 'I didn\'t realize how weak my verbs were until the AI roasted my resume. My callback rate jumped from 2% to 15%.' }
          ]);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    // 1. Hero Text Reveal Animation
    gsap.fromTo(
      textRefs.current,
      { y: 100, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 1.2, 
        stagger: 0.2, 
        ease: "power4.out",
        delay: 0.2
      }
    );

    // 2. Feature Cards Scroll Animation
    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { y: 100, opacity: 0, rotationX: -15 },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
          }
        }
      );
    }
  }, []);

  const addToRefs = (el: HTMLHeadingElement | null) => {
    if (el && !textRefs.current.includes(el)) {
      textRefs.current.push(el);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-x-hidden">
      <style>{`
        @keyframes gentle-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes gentle-float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      
      {/* --- FLOATING GLASS NAVBAR --- */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none">
        <nav className="pointer-events-auto w-full max-w-7xl bg-black/10 backdrop-blur-lg border border-white/10 shadow-2xl shadow-black/50 rounded-full transition-all duration-300">
          <div className="px-6 lg:px-8 h-14 flex items-center justify-between">
            <div className="font-extrabold text-xl tracking-tight text-white flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              ApplyIQ <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Pro</span>
            </div>
            
            <div className="hidden md:flex items-center gap-2 bg-black/20 p-1 rounded-full border border-white/5">
              <a href="#features" className="px-5 py-1 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-all">Features</a>
              <a href="#how-it-works" className="px-5 py-1 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-all">How it Works</a>
              <a href="#testimonials" className="px-5 py-1 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-all">Wall of Love</a>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/login" className="hidden md:inline-flex text-white/80 hover:text-white font-medium transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="bg-white text-black px-5 py-2.5 rounded-full font-medium hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* --- GRID BACKGROUND --- */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #ffffff11 1px, transparent 1px), linear-gradient(to bottom, #ffffff11 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      {/* --- HERO SECTION --- */}
      <section ref={heroRef} className="relative min-h-screen w-full flex flex-col items-center pt-32 pb-20 z-10">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-6 lg:px-12 flex flex-col items-center justify-center text-center z-10 w-full flex-1">
          {/* Hero Content */}
          <div className="flex flex-col items-center gap-6 max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-slate-300">The Future of Resume Building</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" }}>
                <span ref={addToRefs} className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">ApplyIQ</span>
                <span ref={addToRefs} className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Unfair Advantage.</span>
              </h1>
              <p ref={addToRefs} className="text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Build an ATS-beating, beautifully typeset resume in seconds. Powered by elite AI logic to perfect every bullet point.
              </p>
            </div>

            <div ref={addToRefs} className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
              <Link to="/register" className="group relative px-8 py-4 bg-white text-black font-semibold rounded-xl overflow-hidden text-center transition-transform hover:scale-105">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Start Building Free <ArrowRight className="w-4 h-4" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 opacity-0 group-hover:opacity-10 transition-opacity" />
              </Link>
              <Link to="/login" className="px-8 py-4 bg-white/5 text-white font-semibold rounded-xl border border-white/10 hover:bg-white/10 transition-colors text-center backdrop-blur-md">
                Sign In
              </Link>
            </div>
          </div>

          {/* Hero App Mockup */}
          <div className="w-full max-w-5xl mx-auto relative perspective-[2000px] mt-auto">
            {/* Fade out bottom of UI so it blends with background */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent z-40 pointer-events-none" />
            
            {/* Widget 1: AI Roast */}
            <div className="absolute -top-4 lg:top-4 -left-4 lg:-left-24 z-30 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-red-500/30 p-5 rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.2)] flex flex-col gap-3 transition-transform duration-500 hover:scale-[1.15] hover:z-50 w-56 hidden sm:flex" style={{ animation: "gentle-float 7s ease-in-out infinite" }}>
               <div className="flex items-center gap-3">
                 <div className="bg-red-500/20 p-2.5 rounded-xl border border-red-500/30"><Flame className="text-red-400 w-6 h-6"/></div>
                 <div className="text-left">
                   <div className="text-white font-bold">AI Resume Roast</div>
                   <div className="text-red-400 text-xs font-bold">Score: 42/100</div>
                 </div>
               </div>
               <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                 <div className="w-[42%] h-full bg-gradient-to-r from-red-600 to-orange-500 rounded-full" />
               </div>
               <div className="text-[10px] text-slate-400 text-left leading-tight">Identified 3 weak action verbs and poor metric formatting.</div>
            </div>

            {/* Widget 2: Auto Tailor */}
            <div className="absolute top-24 lg:top-36 -right-4 lg:-right-32 z-30 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-blue-500/30 p-5 rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.2)] flex flex-col gap-3 transition-transform duration-500 hover:scale-[1.15] hover:z-50 w-64 hidden sm:flex" style={{ animation: "gentle-float-delayed 6s ease-in-out infinite 1s" }}>
               <div className="flex items-center gap-3">
                 <div className="bg-blue-500/20 p-2.5 rounded-xl border border-blue-500/30"><Target className="text-blue-400 w-6 h-6"/></div>
                 <div className="text-left">
                   <div className="text-white font-bold">Job Auto-Tailor</div>
                   <div className="text-blue-400 text-xs font-bold">+14 Keywords Match</div>
                 </div>
               </div>
               <div className="flex gap-2 flex-wrap">
                 <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-[10px] rounded border border-blue-500/20">TypeScript</span>
                 <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-[10px] rounded border border-blue-500/20">AWS</span>
                 <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-[10px] rounded border border-blue-500/20">React</span>
               </div>
            </div>

            {/* Widget 3: Cold Email */}
            <div className="absolute bottom-32 lg:bottom-40 -left-4 lg:-left-20 z-30 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-purple-500/30 p-5 rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.2)] flex flex-col gap-3 transition-transform duration-500 hover:scale-[1.15] hover:z-50 w-56 hidden sm:flex" style={{ animation: "gentle-float 8s ease-in-out infinite 0.5s" }}>
               <div className="flex items-center gap-3">
                 <div className="bg-purple-500/20 p-2.5 rounded-xl border border-purple-500/30"><Mail className="text-purple-400 w-6 h-6"/></div>
                 <div className="text-left">
                   <div className="text-white font-bold">Cold Email AI</div>
                   <div className="text-purple-400 text-xs font-bold">Draft Generated</div>
                 </div>
               </div>
               <div className="space-y-1.5 opacity-70">
                 <div className="h-2 w-full bg-purple-500/20 rounded"></div>
                 <div className="h-2 w-5/6 bg-purple-500/20 rounded"></div>
                 <div className="h-2 w-4/6 bg-purple-500/20 rounded"></div>
               </div>
            </div>

            {/* Widget 4: ATS Optimizer */}
            <div className="absolute bottom-12 lg:bottom-16 -right-4 lg:-right-24 z-30 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-emerald-500/30 p-5 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.2)] flex flex-col gap-3 transition-transform duration-500 hover:scale-[1.15] hover:z-50 w-64 hidden sm:flex" style={{ animation: "gentle-float-delayed 7s ease-in-out infinite 1.5s" }}>
               <div className="flex items-center gap-3">
                 <div className="bg-emerald-500/20 p-2.5 rounded-xl border border-emerald-500/30"><Activity className="text-emerald-400 w-6 h-6"/></div>
                 <div className="text-left flex-1">
                   <div className="text-white font-bold">ATS Optimizer</div>
                   <div className="text-emerald-400 text-xs font-bold">Parse Success: 100%</div>
                 </div>
                 <div className="w-10 h-10 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 flex items-center justify-center">
                   <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                 </div>
               </div>
               <div className="text-[10px] text-slate-400 text-left leading-tight mt-1">Structure, margins, and fonts are machine-readable.</div>
            </div>

            <div className="relative rounded-t-2xl border border-white/10 border-b-0 bg-[#0a0a0a]/80 backdrop-blur-xl overflow-hidden shadow-2xl shadow-blue-500/10 transform rotate-x-[15deg] hover:rotate-x-[5deg] transition-transform duration-1000 ease-out flex flex-col h-[400px]">
              
              {/* App Header */}
              <div className="h-12 border-b border-white/10 bg-white/5 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <div className="mx-auto px-3 py-1 rounded bg-white/5 text-xs text-slate-400 font-mono">applyiq-editor.tex</div>
              </div>

              {/* App Body */}
              <div className="flex-1 flex text-left">
                {/* Sidebar */}
                <div className="w-64 border-r border-white/10 p-4 hidden md:block">
                  <div className="h-4 w-24 bg-white/10 rounded mb-6" />
                  <div className="space-y-3">
                    <div className="h-3 w-full bg-blue-500/20 rounded" />
                    <div className="h-3 w-3/4 bg-white/5 rounded" />
                    <div className="h-3 w-5/6 bg-white/5 rounded" />
                    <div className="h-3 w-4/5 bg-white/5 rounded" />
                    <div className="h-3 w-11/12 bg-white/5 rounded" />
                  </div>
                  <div className="h-4 w-20 bg-white/10 rounded mt-8 mb-4" />
                  <div className="space-y-3">
                    <div className="h-3 w-4/5 bg-white/5 rounded" />
                    <div className="h-3 w-full bg-white/5 rounded" />
                  </div>
                </div>

                {/* Main Editor */}
                <div className="flex-1 p-8 flex flex-col gap-6 relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <span className="text-sm font-bold text-purple-400 tracking-widest">AI BULLET OPTIMIZATION ENGINE</span>
                  </div>
                  
                  {/* Before */}
                  <div className="p-5 rounded-xl bg-red-500/5 border border-red-500/10 relative">
                    <span className="absolute -top-3 left-4 px-2 bg-[#0a0a0a] text-[10px] font-bold text-red-400 tracking-wider">ORIGINAL (WEAK)</span>
                    <p className="text-slate-400 text-sm md:text-base font-mono">Made the database faster and fixed bugs in the API.</p>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center -my-3 relative z-10">
                    <div className="bg-[#0a0a0a] p-2 rounded-full border border-white/10 shadow-lg">
                      <Bot className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>

                  {/* After */}
                  <div className="p-5 rounded-xl bg-blue-500/10 border border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.15)] relative">
                    <span className="absolute -top-3 left-4 px-2 bg-[#0a0a0a] text-[10px] font-bold text-blue-400 tracking-wider">APPLYIQ OPTIMIZED (STRONG)</span>
                    <p className="text-slate-200 text-sm md:text-base font-mono leading-relaxed">Architected database indexing strategy resulting in 40% query latency reduction; resolved 15+ critical API bottlenecks ahead of Q3 launch.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-32 relative z-10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Enterprise-Grade Intelligence</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Our AI doesn't just check grammar; it completely re-architects your bullets to highlight impact, metrics, and leadership.</p>
          </div>

          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-[1000px]">
            {/* Card 1 */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl hover:bg-white/10 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 border border-blue-500/30 group-hover:scale-110 transition-transform">
                <Bot className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">AI Bullet Rewriter</h3>
              <p className="text-slate-400 leading-relaxed">Instantly transform weak tasks into powerful, metric-driven achievements.</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl hover:bg-white/10 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 border border-purple-500/30 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">ATS Optimizer</h3>
              <p className="text-slate-400 leading-relaxed">Analyze your resume against real job descriptions to ensure you pass the robot filters.</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl hover:bg-white/10 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-pink-500/20 flex items-center justify-center mb-6 border border-pink-500/30 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Quality Engine</h3>
              <p className="text-slate-400 leading-relaxed">Scans for overused buzzwords and repetitious verbs, enforcing strict MNC standards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section id="how-it-works" className="py-24 bg-white/5 border-y border-white/10 relative z-10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">From Blank Page to FAANG in 3 Steps</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Our streamlined process takes the pain out of resume writing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-purple-500/0" />
            
            <div className="relative text-center z-10 group">
              <div className="w-24 h-24 mx-auto bg-[#050505] border-2 border-blue-500/30 rounded-full flex items-center justify-center text-3xl font-bold text-blue-400 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-shadow duration-500">1</div>
              <h3 className="text-xl font-bold mb-2">Import Your History</h3>
              <p className="text-slate-400 leading-relaxed">Connect your LinkedIn or paste your old resume. We extract the raw data instantly.</p>
            </div>
            <div className="relative text-center z-10 group">
              <div className="w-24 h-24 mx-auto bg-[#050505] border-2 border-purple-500/30 rounded-full flex items-center justify-center text-3xl font-bold text-purple-400 mb-6 shadow-[0_0_30px_rgba(168,85,247,0.1)] group-hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] transition-shadow duration-500">2</div>
              <h3 className="text-xl font-bold mb-2">AI Optimization</h3>
              <p className="text-slate-400 leading-relaxed">Our engine rewrites your bullets to emphasize metrics, impact, and keywords.</p>
            </div>
            <div className="relative text-center z-10 group">
              <div className="w-24 h-24 mx-auto bg-[#050505] border-2 border-pink-500/30 rounded-full flex items-center justify-center text-3xl font-bold text-pink-400 mb-6 shadow-[0_0_30px_rgba(236,72,153,0.1)] group-hover:shadow-[0_0_40px_rgba(236,72,153,0.3)] transition-shadow duration-500">3</div>
              <h3 className="text-xl font-bold mb-2">Export LaTeX PDF</h3>
              <p className="text-slate-400 leading-relaxed">Download a perfectly typeset, ATS-compliant PDF that recruiters love.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS / TESTIMONIALS --- */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10 rounded-3xl p-8 lg:p-16 text-center shadow-2xl shadow-blue-900/10">
            <h2 className="text-2xl lg:text-4xl font-bold mb-12 text-slate-300">Resumes built with ApplyIQ land interviews at</h2>
            <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
              {/* Mock logos text */}
              <span className="text-3xl font-bold tracking-tighter">Google</span>
              <span className="text-3xl font-bold tracking-tight">Meta</span>
              <span className="text-3xl font-bold">Amazon</span>
              <span className="text-3xl font-bold italic text-red-500">NETFLIX</span>
              <span className="text-3xl font-semibold tracking-widest text-slate-200">APPLE</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- WALL OF LOVE (TESTIMONIALS) --- */}
      <section id="testimonials" className="py-24 relative z-10 bg-[#0a0a0a] overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Wall of Love</h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-6">Don't just take our word for it. See what our users are saying.</p>
            <Link to="/feedback" className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-full transition-colors border border-white/10">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> Share your experience
            </Link>
          </div>
          
          <div className="relative flex overflow-x-hidden group">
            <div className="flex w-max animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused]">
              {/* Render twice for seamless loop */}
              {[...testimonials, ...testimonials].map((t, idx) => (
                <div key={`${t._id}-${idx}`} className="w-80 md:w-96 mx-4 bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl hover:bg-white/10 transition-colors shrink-0 whitespace-normal">
                  <div className="flex text-yellow-500 mb-4">
                    {[...Array(t.rating || 5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                  </div>
                  <p className="text-slate-300 mb-6 italic leading-relaxed">"{t.message}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold uppercase shrink-0">
                      {t.name.substring(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white leading-tight">{t.name}</h4>
                      <p className="text-xs text-slate-500 mt-1">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Gradient faded edges */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* --- DEMO RESUMES --- */}
      <section className="py-24 bg-white/5 border-t border-white/10 relative z-10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Pixel-Perfect LaTeX Templates</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Stand out with beautiful typography that recruiters recognize instantly.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-8 h-8 text-blue-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">The "Harvard" Standard</h4>
                  <p className="text-slate-400 leading-relaxed">Our default template uses the exact spacing, margins, and Computer Modern fonts expected by top-tier engineering firms.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-8 h-8 text-purple-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">100% ATS Machine Readable</h4>
                  <p className="text-slate-400 leading-relaxed">No complex tables or weird columns that confuse bots. Just clean semantic text that parsers digest flawlessly.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-8 h-8 text-pink-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Automated Typesetting</h4>
                  <p className="text-slate-400 leading-relaxed">Never fight with Word margins again. The AI balances your line lengths and prevents visual orphans automatically.</p>
                </div>
              </div>
            </div>

            <div className="relative group perspective-[1000px] flex justify-center mt-10 md:mt-0">
              {/* Fake Resume Preview Box */}
              <div className="relative w-full max-w-md aspect-[1/1.4] bg-[#f8f9fa] rounded-md shadow-[0_0_50px_rgba(59,130,246,0.15)] p-8 transform md:rotate-y-[-15deg] md:rotate-x-[5deg] group-hover:rotate-y-0 group-hover:rotate-x-0 transition-transform duration-700 ease-out border-2 border-white/20">
                <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent pointer-events-none rounded-md" />
                
                {/* Skeleton of a resume */}
                <div className="w-full h-full flex flex-col gap-4 opacity-80 mix-blend-multiply grayscale">
                  <div className="flex flex-col items-center border-b-2 border-slate-800 pb-4 mb-2">
                    <div className="w-1/2 h-8 bg-slate-800 mb-3"></div>
                    <div className="w-3/4 h-2 bg-slate-500"></div>
                  </div>
                  
                  <div className="space-y-3 mb-2">
                    <div className="w-1/4 h-4 bg-slate-800 mb-2"></div>
                    <div className="flex justify-between items-end">
                      <div className="w-1/3 h-3 bg-slate-700"></div>
                      <div className="w-1/6 h-2 bg-slate-400"></div>
                    </div>
                    <div className="w-full h-2 bg-slate-300"></div>
                    <div className="w-11/12 h-2 bg-slate-300"></div>
                    <div className="w-full h-2 bg-slate-300"></div>
                  </div>

                  <div className="space-y-3 mb-2">
                    <div className="flex justify-between items-end mt-4">
                      <div className="w-1/3 h-3 bg-slate-700"></div>
                      <div className="w-1/6 h-2 bg-slate-400"></div>
                    </div>
                    <div className="w-full h-2 bg-slate-300"></div>
                    <div className="w-10/12 h-2 bg-slate-300"></div>
                  </div>

                  <div className="space-y-3">
                    <div className="w-1/4 h-4 bg-slate-800 mt-4 mb-2"></div>
                    <div className="flex gap-2 mb-2">
                      <div className="w-16 h-2 bg-slate-600"></div>
                      <div className="w-full h-2 bg-slate-300"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-16 h-2 bg-slate-600"></div>
                      <div className="w-10/12 h-2 bg-slate-300"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -bottom-6 -right-6 md:right-0 bg-[#050505] p-4 rounded-xl border border-white/10 shadow-2xl flex items-center gap-3 animate-bounce shadow-blue-500/20">
                <FileText className="text-blue-400 w-6 h-6" />
                <div>
                  <div className="text-white font-bold text-sm">John_Doe_Resume.pdf</div>
                  <div className="text-green-400 text-xs font-bold uppercase tracking-wider">100% ATS Match</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- BIG FOOTER --- */}
      <footer className="bg-white/5 border-t border-white/10 pt-20 pb-10 relative z-10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="font-bold text-2xl tracking-tight text-white mb-4">
                ApplyIQ <span className="text-blue-500">Pro</span>
              </div>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                The unfair advantage for ambitious professionals. Build your legacy with perfectly optimized resumes.
              </p>
              <div className="flex flex-col gap-3 text-sm text-slate-400">
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-400" /> San Francisco, CA</span>
                <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-blue-400" /> hello@applyiq.com</span>
                <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-blue-400" /> +1 (555) 123-4567</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Product</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link to="/features" className="hover:text-blue-400 transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
                <li><Link to="/ats-scanner" className="hover:text-blue-400 transition-colors">ATS Scanner</Link></li>
                <li><Link to="/latex-templates" className="hover:text-blue-400 transition-colors">LaTeX Templates</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Company</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                <li><Link to="/careers" className="hover:text-blue-400 transition-colors flex items-center gap-2">Careers <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold border border-blue-500/30">WE'RE HIRING</span></Link></li>
                <li><Link to="/blog" className="hover:text-blue-400 transition-colors">Blog</Link></li>
                <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Social Media</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2">Twitter / X ↗</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2">LinkedIn ↗</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2">GitHub ↗</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2">Instagram ↗</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>© 2026 ApplyIQ. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
