"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Github, Loader2, Sparkles, ArrowRight } from "lucide-react";
import ParticlesBackground from "@/components/ParticlesBackground";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    router.push(`/result?repo=${encodeURIComponent(url)}`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-sans flex items-center justify-center p-4">
      
      {/* =============== NEW SECTION: YOUR NAME LOGO =============== */}
      <div className="absolute top-6 left-6 z-30 animate-fade-in">
        <h2 className="text-xl font-bold tracking-wide">
          <span className="text-white">Andrea</span>
          {/* Adding a subtle gradient to the last name to match the theme */}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"> Piu</span>
        </h2>
      </div>
      {/* =========================================================== */}


      {/* LAYER 1: The Deep Black Background (Bottom) */}
      <div className="absolute inset-0 bg-[#050505] z-0" />

      {/* LAYER 2: The Particles (Middle) */}
      <div className="absolute inset-0 z-0">
         <ParticlesBackground />
      </div>

      {/* LAYER 3: Ambient Glows (Middle-Top) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none z-0" />

      {/* LAYER 4: The Content (Top) */}
      <div className="max-w-xl w-full relative z-10 group mt-12 md:mt-0"> {/* Added mt-12 for spacing on small screens if needed */}
        
        {/* Card Glow Animation */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl opacity-20 group-hover:opacity-40 transition duration-1000 blur"></div>
        
        <div className="relative bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col items-center text-center">
          
          {/* Logo */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-blue-500 blur-[40px] opacity-40 rounded-full animate-pulse"></div>
            <div className="relative bg-[#161b22] p-4 rounded-2xl border border-white/10 shadow-xl ring-1 ring-white/5">
              <Github className="w-12 h-12 text-white" />
              <Sparkles className="absolute -top-3 -right-3 w-6 h-6 text-purple-400 animate-bounce" />
            </div>
          </div>

          <h1 className="text-5xl font-black tracking-tight mb-4">
            <span className="text-white">GitGrade</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              AI
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            Instantly audit any GitHub repository. Get AI-powered scoring, security checks, and a personalized improvement roadmap.
          </p>

          {/* Input Area */}
          <form onSubmit={handleAnalyze} className="w-full relative group/input">
            <div className="relative flex items-center bg-[#0F1117] border border-white/10 rounded-xl p-1.5 transition-all duration-300 focus-within:border-blue-500/50 focus-within:shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)]">
              <div className="pl-4 pr-3 text-gray-500">
                <Github className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="https://github.com/username/repo"
                className="w-full bg-transparent text-white px-2 py-3 outline-none placeholder-gray-600 font-medium"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button 
                disabled={loading || !url}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] justify-center"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-4 h-4"/>
                ) : (
                  <>
                    Analyze <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 flex items-center gap-6 text-xs font-semibold tracking-wider text-gray-600 uppercase">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/> 
              Gemini 2.5 Flash
            </span>
            <span>•</span>
            <span>Secure & Instant</span>
          </div>

        </div>
      </div>
    </div>
  );
}