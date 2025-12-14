"use client";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyzeRepo = async () => {
    if (!url) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ repoUrl: url }),
      });
      const data = await res.json();
      
      // SAFETY CHECK: If the API sends an error, alert user and stop.
      if (data.error) {
        alert("Error from AI: " + data.error);
        setResult(null);
      } else {
        setResult(data);
      }
    } catch (e) {
      alert("Network or Server Error. Check your terminal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black text-white font-sans selection:bg-blue-500/30">
      <main className="container mx-auto px-4 py-20 flex flex-col items-center">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-12 animate-fade-in">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wider mb-2">
            AI-POWERED CODE MENTOR
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400">
            GitGrade Mirror
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto text-lg">
            Paste your repository link. Get an instant AI critique, score, and personalized roadmap to level up.
          </p>
        </div>

        {/* Input Box */}
        <div className="w-full max-w-2xl relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative flex bg-black rounded-lg border border-white/10 p-2 shadow-2xl">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/username/project"
              className="flex-1 bg-transparent border-none outline-none text-white px-4 placeholder-gray-600"
            />
            <button
              onClick={analyzeRepo}
              disabled={loading}
              className="bg-white text-black font-bold px-6 py-3 rounded hover:bg-gray-200 transition-all disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Grade It"}
            </button>
          </div>
        </div>

        {/* Results Grid */}
        {result && (
          <div className="mt-16 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
            
            {/* Score Card */}
            <div className="md:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center backdrop-blur-sm">
              <h3 className="text-gray-400 text-sm uppercase tracking-widest mb-2">Code Score</h3>
              <div className={`text-6xl font-black ${result.score >= 80 ? 'text-green-400' : result.score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                {result.score || 0}
              </div>
              <span className="text-xs text-gray-500 mt-2">OUT OF 100</span>
            </div>

            {/* Summary & Roadmap */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                  <span className="text-xl">🤖</span> Mentor Summary
                </h3>
                <p className="text-gray-300 leading-relaxed">{result.summary || "No summary available."}</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-purple-400 font-bold mb-4 flex items-center gap-2">
                  <span className="text-xl">🚀</span> Action Plan
                </h3>
                <ul className="space-y-3">
  {/* SAFEGUARD: Only run .map if roadmap is actually an array */}
  {result.roadmap && Array.isArray(result.roadmap) ? (
    result.roadmap.map((item: string, i: number) => (
      <li key={i} className="flex gap-3 text-gray-300 group">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold border border-purple-500/30">
          {i + 1}
        </span>
        <span className="group-hover:text-white transition-colors">{item}</span>
      </li>
    ))
  ) : (
    <li className="text-gray-500 italic">
      {/* Fallback text if AI fails so the app doesn't crash */}
      No roadmap generated. (Check terminal for API errors)
    </li>
  )}
</ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}