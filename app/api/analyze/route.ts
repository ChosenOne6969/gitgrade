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
    
    // Low temperature for consistent grading
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.1,
        responseMimeType: "application/json",
      },
    });

    const prompt = `
    Analyze this GitHub repository: ${repoUrl}.
    Act as a strict Senior Code Reviewer.
    
    Return a STRICT JSON object with this exact structure:
    {
      "scores": {
        "quality": (number 0-100, based on cleanliness/DRY),
        "security": (number 0-100, based on safety/secrets),
        "performance": (number 0-100, based on efficiency)
      },
      "summary": "2 sentence executive summary of the code quality.",
      "strengths": ["Point 1", "Point 2"],
      "weaknesses": ["Point 1", "Point 2"],
      "roadmap": ["Actionable step 1", "Actionable step 2", "Actionable step 3"]
    }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    return NextResponse.json(JSON.parse(responseText));

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to analyze repo" }, { status: 500 });
  }
}