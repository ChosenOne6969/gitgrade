"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Bot, User, Shield, Zap, Code } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

// Component to handle the search params logic
function ResultContent() {
  const searchParams = useSearchParams();
  const repoUrl = searchParams.get("repo");
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "I've analyzed your code. Ask me anything about the results!" }
  ]);

  useEffect(() => {
    if (!repoUrl) return;

    // Fetch analysis on load
    fetch("/api/analyze", {
      method: "POST",
      body: JSON.stringify({ repoUrl }),
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, [repoUrl]);

  const handleChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', text: chatInput }]);
    const question = chatInput;
    setChatInput("");

    // Simulate AI response (For Hackathon Demo)
    // In a real app, you would send this to another API endpoint
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: `That's a great question about ${question}. Based on the analysis, I'd recommend looking at the file structure in /src again.` }]);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-400 animate-pulse">Reading thousands of lines of code...</p>
      </div>
    );
  }

  // Transform scores for the Radar Chart
  const chartData = [
    { subject: 'Code Quality', A: data.scores.quality, fullMark: 100 },
    { subject: 'Security', A: data.scores.security, fullMark: 100 },
    { subject: 'Performance', A: data.scores.performance, fullMark: 100 },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex items-center justify-between mb-12">
        <Link href="/" className="flex items-center text-gray-400 hover:text-white transition">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </Link>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          GitGrade Report
        </h1>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Visuals & Scores */}
        <div className="lg:col-span-1 space-y-6">
          {/* Radar Chart Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold mb-4 text-center text-gray-200">System Vitality</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                  <PolarGrid stroke="#333" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <Radar name="Score" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl flex items-center gap-4">
              <Code className="text-green-400" />
              <div>
                <p className="text-xs text-green-300">Code Quality</p>
                <p className="text-2xl font-bold text-green-400">{data.scores.quality}/100</p>
              </div>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-4">
              <Shield className="text-red-400" />
              <div>
                <p className="text-xs text-red-300">Security</p>
                <p className="text-2xl font-bold text-red-400">{data.scores.security}/100</p>
              </div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-center gap-4">
              <Zap className="text-blue-400" />
              <div>
                <p className="text-xs text-blue-300">Performance</p>
                <p className="text-2xl font-bold text-blue-400">{data.scores.performance}/100</p>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: The Report */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6">Analysis Summary</h2>
            <p className="text-gray-300 leading-relaxed mb-8 text-lg">{data.summary}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
                   ✅ Strengths
                </h3>
                <ul className="space-y-2">
                  {data.strengths.map((item: string, i: number) => (
                    <li key={i} className="text-gray-400 text-sm flex gap-2">
                      <span className="text-green-500/50">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-orange-400 mb-3 flex items-center gap-2">
                   ⚠️ Weaknesses
                </h3>
                <ul className="space-y-2">
                  {data.weaknesses.map((item: string, i: number) => (
                    <li key={i} className="text-gray-400 text-sm flex gap-2">
                      <span className="text-orange-500/50">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <h3 className="font-semibold text-purple-400 mb-4">🚀 Recommended Roadmap</h3>
              <div className="space-y-3">
                {data.roadmap.map((step: string, i: number) => (
                  <div key={i} className="flex items-start gap-4 bg-white/5 p-3 rounded-lg">
                    <span className="bg-purple-500/20 text-purple-300 w-6 h-6 flex items-center justify-center rounded-full text-xs shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-gray-300 text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm h-[400px] flex flex-col">
            <div className="mb-4 border-b border-white/10 pb-2">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-400" /> AI Mentor Chat
              </h3>
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white/10 text-gray-200 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <form onSubmit={handleChat} className="flex gap-2">
              <input
                type="text"
                placeholder="Ask about how to fix these issues..."
                className="flex-1 bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

// Main page component wrapped in Suspense boundary
export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>}>
      <ResultContent />
    </Suspense>
  );
}