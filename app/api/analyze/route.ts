import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { repoUrl } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Switch to 'gemini-1.5-flash' - it is currently the most stable model for this
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.1, // Strict mode
      },
    });

    const prompt = `
    Analyze this GitHub repository: ${repoUrl}.
    Act as a strict Senior Code Reviewer.
    
    Return a STRICT JSON object (no markdown, no backticks) with this structure:
    {
      "scores": {
        "quality": (number 0-100),
        "security": (number 0-100),
        "performance": (number 0-100)
      },
      "summary": "Short executive summary.",
      "strengths": ["Point 1", "Point 2"],
      "weaknesses": ["Point 1", "Point 2"],
      "roadmap": ["Step 1", "Step 2", "Step 3"]
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // *** CRITICAL FIX: Strip Markdown formatting ***
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const json = JSON.parse(text);
      return NextResponse.json(json);
    } catch (parseError) {
      console.error("JSON Parse Error:", text);
      return NextResponse.json({ error: "AI returned invalid format" }, { status: 500 });
    }

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to analyze repo" }, { status: 500 });
  }
}