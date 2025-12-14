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
    
    // Using 2.5-flash with JSON enforcement
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", 
      generationConfig: {
        temperature: 0.1, 
        responseMimeType: "application/json" // This forces strict JSON
      },
    });

    const prompt = `
    Analyze this GitHub repository: ${repoUrl}.
    Act as a strict Senior Code Reviewer.
    
    You must return a JSON object with the following structure. Do not include markdown formatting.
    
    {
      "scores": {
        "quality": (number 0-100),
        "security": (number 0-100),
        "performance": (number 0-100)
      },
      "summary": "A 2-sentence executive summary of the code quality.",
      "strengths": ["Strength 1", "Strength 2"],
      "weaknesses": ["Weakness 1", "Weakness 2"],
      "roadmap": ["Step 1", "Step 2", "Step 3"]
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("🤖 Raw AI Response:", text); // Check Vercel Logs if this fails

    // Cleanup: Remove any markdown backticks if they sneak in
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanText);

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("🔥 Analysis Error:", error.message);
    return NextResponse.json({ error: "Failed to analyze repository." }, { status: 500 });
  }
}