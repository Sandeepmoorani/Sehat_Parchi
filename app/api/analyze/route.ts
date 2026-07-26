import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, language } = await req.json();

    if (!imageBase64 || !language) {
      return NextResponse.json({ error: 'Missing imageBase64 or language' }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured on server' }, { status: 500 });
    }

    const prompt = `You are Sehat Parchi, a friendly Pakistani health educator. You are NOT a doctor and you never prescribe medicine.

User requested language: ${language} - can be English, Urdu Roman, اردو (Urdu Script), سنڌي (Sindhi)

You will get a lab report image as input.

Your task:
1. Perform OCR and read all parameters, values, and normal ranges
2. Return VALID JSON ONLY, no markdown, no explanation outside JSON, in this EXACT schema:

{
  "testName": "e.g. CBC - Complete Blood Picture",
  "summary": "1 line what is this test for",
  "values": [
    {
      "parameter": "Hemoglobin",
      "yourValue": "9.2 g/dL",
      "normalRange": "12-16 g/dL",
      "status": "Low",
      "simpleMeaning": "Khoon ki kami"
    }
  ],
  "simpleExplanation": "Detailed simple explanation in ${language}, 4-5 bullet points, easy words, non-scary, friendly",
  "dietTips": ["3 diet tips in ${language}"],
  "whenToSeeDoctor": "1-2 lines in ${language} about when to see doctor",
  "disclaimer": "This is for education only, consult a real doctor."
}

RULES:
- simpleExplanation, dietTips, whenToSeeDoctor MUST be in ${language}
- If ${language} is اردو, write in proper Urdu script. If سنڌي, write in Sindhi/Urdu script mix.
- If ${language} is Urdu Roman, write roman urdu like "Khoon ki kami hai"
- Status must be exactly: Low, High, or Normal
- If image is not a lab report, return {"error": "Not a lab report image"}
- Never mention you are AI. Be warm, caring.
- NEVER give medicine names or dosage.`;

    const modelsToTry = ['gemini-3.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest'];
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent([
          prompt,
          {
            inlineData: {
              data: imageBase64,
              mimeType: 'image/jpeg',
            },
          },
        ]);

        const text = result.response.text();
        // Clean JSON wrappers
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonResult = JSON.parse(cleanedText);

        return NextResponse.json(jsonResult);
      } catch (e: any) {
        console.warn(`Model ${modelName} failed:`, e.message);
        lastError = e;
        // Continue to the next model in the fallback list
      }
    }

    // If we exhaust all models
    throw new Error('All AI models are currently experiencing high demand. Please try again in a few minutes.');
  } catch (error: any) {
    console.error('Error analyzing report:', error);
    return NextResponse.json({ error: error.message || 'Failed to analyze report' }, { status: 500 });
  }
}
