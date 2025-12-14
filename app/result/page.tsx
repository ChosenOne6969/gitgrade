"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Bot, Code, Shield, Zap, AlertTriangle } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

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
        if (!res.ok) throw new Error("Failed to analyze repository");
        return res.json();
      })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setData(data);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "An unknown error occurred");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [repoUrl]);

  const handleChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: chatInput }]);
    const question = chatInput;
    setChatInput("");
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: `That's a great question about ${question}.` }]);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-400 animate-pulse">Analyzing Repository...</p>
      </div>
    );
  }

  // *** SAFETY CHECK: If there is an error, show this instead of crashing ***
  if (error || !data || !data.scores) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Analysis Failed</h1>
        <p className="text-gray-400 mb-6 max-w-md">
          {error || "The AI could not process this repository. It might be private, empty, or too large."}
        </p>
        <Link href="/" className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition">
          Try Another Repo
        </Link>
      </div>
    );
  }

  const chartData = [
    { subject: 'Code Quality', A: data.scores.quality, fullMark: 100 },
    { subject: 'Security', A: data.scores.security, fullMark: 100 },
    { subject: 'Performance', A: data.scores.performance, fullMark: 100 },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <header className="max-w-6xl mx-auto flex items-center justify-between mb-12">
        <Link href="/" className="flex items-center text-gray-400 hover:text-white transition">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </Link>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          GitGrade Report
        </h1>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
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
          
          <div className="grid grid-cols-1 gap-4">
             {/* Score Cards */}
            <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl flex items-center gap-4">
              <Code className="text-green-400" />
              <div>
                <p className="text-xs text-green-300">Code Quality</p>
                <p className="text-2xl font-bold text-green-400">{data.scores.quality}/100</p>
              </div>
            </div>
             {/* ... You can add other score cards here ... */}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6">Analysis Summary</h2>
            <p className="text-gray-300 leading-relaxed mb-8 text-lg">{data.summary}</p>
            {/* ... Rest of your report UI ... */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>}>
      <ResultContent />
    </Suspense>
  );
}