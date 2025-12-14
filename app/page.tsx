"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Github, ArrowRight, Loader2 } from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    // Redirect to the result page with the repo URL as a query parameter
    router.push(`/result?repo=${encodeURIComponent(url)}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4">
      {/* Hero Section */}
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-blue-500/10 border border-blue-500/20 animate-pulse">
            <Github className="w-12 h-12 text-blue-400" />
          </div>
        </div>
        
        <h1 className="text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
          GitGrade AI
        </h1>
        <p className="text-xl text-gray-400">
          Paste your repository. Get an instant 360° audit, performance visualization, and personalized roadmap.
        </p>

        {/* Input Form */}
        <form onSubmit={handleAnalyze} className="relative max-w-lg mx-auto mt-10 group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-1000"></div>
          <div className="relative flex items-center bg-black rounded-lg p-2">
            <input
              type="text"
              placeholder="https://github.com/username/repo"
              className="w-full bg-transparent text-white px-4 py-3 outline-none placeholder-gray-600"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button 
              disabled={loading}
              className="bg-white text-black px-6 py-2 rounded-md font-bold hover:bg-gray-200 transition flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin w-4 h-4"/> : "Analyze"}
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-600 mt-8">
          Powered by Gemini 2.5 Flash • No Token Required
        </p>
      </div>
    </div>
  );
}