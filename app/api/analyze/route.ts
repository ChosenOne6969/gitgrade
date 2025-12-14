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
    
    // ✅ USING YOUR PREFERRED MODEL
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", 
      generationConfig: {
        temperature: 0.1, // Keep it low for consistent JSON
      },
    });

    const prompt = `
    Analyze this GitHub repository: ${repoUrl}.
    Act as a strict Senior Code Reviewer.
    
    Return a STRICT JSON object with this structure:
    {
      "scores": {
        "quality": (number 0-100),
        "security": (number 0-100),
        "performance": (number 0-100)
      },
      "summary": "Short critique.",
      "strengths": ["Point 1", "Point 2"],
      "weaknesses": ["Point 1", "Point 2"],
      "roadmap": ["Step 1", "Step 2", "Step 3"]
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("🤖 Raw AI Response:", text);

    // *** THE MAGIC FIX ***
    // This finds the JSON inside the text, even if the AI adds backticks or markdown
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("AI did not return a valid JSON object");
    }

    // Parse only the clean JSON part
    const cleanJson = jsonMatch[0];
    const data = JSON.parse(cleanJson);

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("🔥 Analysis Error:", error.message);
    return NextResponse.json({ error: "Failed to analyze repository." }, { status: 500 });
  }
}