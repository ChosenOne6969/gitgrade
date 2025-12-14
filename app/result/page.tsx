"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Code, Shield, Zap, AlertTriangle, Send, Bot, CheckCircle, XCircle } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis } from "recharts";

function ResultContent() {
  const searchParams = useSearchParams();
  const repoUrl = searchParams.get("repo");
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "I've analyzed your code. Ask me anything about the results!" }
  ]);

  useEffect(() => {
    if (!repoUrl) return;

    fetch("/api/analyze", {
      method: "POST",
      body: JSON.stringify({ repoUrl }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("API Failed");
        return res.json();
      })
      .then((responseData) => {
        console.log("✅ FRONTEND RECEIVED:", responseData); // Check your browser console!
        if (responseData.error) throw new Error(responseData.error);
        setData(responseData);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Failed to load");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [repoUrl]);

  const handleChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: chatInput }]);
    const q = chatInput;
    setChatInput("");
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: `That's a good question about ${q}. Based on the analysis, I recommend focusing on the security score first.` }]);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-400 animate-pulse">Analyzing Repository Structure...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Analysis Failed</h1>
        <p className="text-gray-400 mb-6">{error}</p>
        <Link href="/" className="px-6 py-2 bg-blue-600 rounded-lg">Try Again</Link>
      </div>
    );
  }

  // FAILSAFE: Ensure scores exist, default to 50 if missing to prevent crash
  const scores = data?.scores || { quality: 50, security: 50, performance: 50 };
  
  const chartData = [
    { subject: 'Quality', A: scores.quality, fullMark: 100 },
    { subject: 'Security', A: scores.security, fullMark: 100 },
    { subject: 'Performance', A: scores.performance, fullMark: 100 },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8">
      {/* Navbar */}
      <header className="max-w-6xl mx-auto flex items-center justify-between mb-8">
        <Link href="/" className="flex items-center text-gray-400 hover:text-white transition">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </Link>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          GitGrade Report
        </h1>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Visuals */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* CHART CARD */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-2 text-gray-200">Vitality Score</h2>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                  <PolarGrid stroke="#333" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Score" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SCORES LIST */}
          <div className="space-y-3">
            <div className="bg-white/5 p-4 rounded-xl flex items-center justify-between border-l-4 border-green-500">
              <div className="flex items-center gap-3">
                <Code className="text-green-400 w-5 h-5" />
                <span className="text-gray-300">Code Quality</span>
              </div>
              <span className="text-2xl font-bold text-white">{scores.quality}</span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl flex items-center justify-between border-l-4 border-red-500">
              <div className="flex items-center gap-3">
                <Shield className="text-red-400 w-5 h-5" />
                <span className="text-gray-300">Security</span>
              </div>
              <span className="text-2xl font-bold text-white">{scores.security}</span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl flex items-center justify-between border-l-4 border-blue-500">
              <div className="flex items-center gap-3">
                <Zap className="text-blue-400 w-5 h-5" />
                <span className="text-gray-300">Performance</span>
              </div>
              <span className="text-2xl font-bold text-white">{scores.performance}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Analysis */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4">Executive Summary</h2>
            <p className="text-gray-300 leading-relaxed mb-6">{data?.summary || "No summary available."}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
                   <CheckCircle className="w-4 h-4"/> Strengths
                </h3>
                <ul className="space-y-2">
                  {data?.strengths?.map((item: string, i: number) => (
                    <li key={i} className="text-gray-400 text-sm flex gap-2">
                      <span className="text-green-500/50">•</span> {item}
                    </li>
                  )) || <li className="text-gray-500">No strengths detected</li>}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-orange-400 mb-3 flex items-center gap-2">
                   <AlertTriangle className="w-4 h-4"/> Weaknesses
                </h3>
                <ul className="space-y-2">
                  {data?.weaknesses?.map((item: string, i: number) => (
                    <li key={i} className="text-gray-400 text-sm flex gap-2">
                      <span className="text-orange-500/50">•</span> {item}
                    </li>
                  )) || <li className="text-gray-500">No weaknesses detected</li>}
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <h3 className="font-semibold text-purple-400 mb-4">🚀 Improvement Roadmap</h3>
              <div className="space-y-3">
                {data?.roadmap?.map((step: string, i: number) => (
                  <div key={i} className="flex items-start gap-4 bg-white/5 p-3 rounded-lg">
                    <span className="bg-purple-500/20 text-purple-300 w-6 h-6 flex items-center justify-center rounded-full text-xs shrink-0 font-bold">
                      {i + 1}
                    </span>
                    <span className="text-gray-300 text-sm">{step}</span>
                  </div>
                )) || <div className="text-gray-500">No roadmap generated</div>}
              </div>
            </div>
          </div>

           {/* CHAT WIDGET */}
           <div className="bg-white/5 border border-white/10 rounded-2xl p-4 h-[300px] flex flex-col relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
             <h3 className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2">
                <Bot className="w-4 h-4"/> AI Mentor Chat
             </h3>
             <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[85%] p-3 rounded-xl text-sm ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-300'}`}>
                        {m.text}
                     </div>
                  </div>
                ))}
             </div>
             <form onSubmit={handleChat} className="flex gap-2">
                <input 
                  value={chatInput} 
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask how to fix these issues..." 
                  className="flex-1 bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
                <button type="submit" className="bg-blue-600 p-2 rounded-lg hover:bg-blue-500"><Send className="w-4 h-4"/></button>
             </form>
           </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="text-white text-center pt-20">Loading...</div>}>
      <ResultContent />
    </Suspense>
  );
}