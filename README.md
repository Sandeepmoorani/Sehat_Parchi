# Sehat Parchi - Lab Report Samjhao

## What it does & Problem it solves
In Pakistan, especially in regions like Hyderabad Sindh, many families receive medical lab reports in English and struggle to understand the medical jargon and complex parameters. 
**Sehat Parchi** solves this problem by allowing users to upload a photo of their lab report and receive a simple, easy-to-understand explanation in their native language (English, Urdu Roman, Urdu Script, or Sindhi). 
It empowers patients and their families to understand their health status without feeling intimidated by complex medical terms.

## Live URL
[https://sehat-parchi.vercel.app](https://sehat-parchi.vercel.app) (Placeholder)

## Features list
- **Multi-language Support:** Choose between English, Urdu Roman, اردو (Urdu Script), and سنڌي (Sindhi).
- **Image Upload:** Simple drag-and-drop or click-to-upload interface for lab reports (JPG/PNG).
- **AI-Powered OCR & Analysis:** Uses Google Gemini 1.5 Flash to accurately read the report and extract parameters, values, and normal ranges.
- **Detailed Results Dashboard:** Beautifully structured cards showing the test summary, a detailed values table, a simple explanation, diet/lifestyle tips, and advice on when to see a doctor.
- **Local History:** Saves your last 5 analyzed reports securely in your browser's local storage for easy access.
- **Export & Share:** Options to save the report as a PDF or share it directly via WhatsApp.

## AI Feature & System Prompt
This application uses `@google/generative-ai` with the `gemini-1.5-flash` model for both OCR and natural language generation.

**System Prompt:**
```text
You are Sehat Parchi, a friendly Pakistani health educator. You are NOT a doctor and you never prescribe medicine.

User requested language: {LANGUAGE} - can be English, Urdu Roman, اردو (Urdu Script), سنڌي (Sindhi)

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
  "simpleExplanation": "Detailed simple explanation in {LANGUAGE}, 4-5 bullet points, easy words, non-scary, friendly",
  "dietTips": ["3 diet tips in {LANGUAGE}"],
  "whenToSeeDoctor": "1-2 lines in {LANGUAGE} about when to see doctor",
  "disclaimer": "This is for education only, consult a real doctor."
}

RULES:
- simpleExplanation, dietTips, whenToSeeDoctor MUST be in {LANGUAGE}
- If {LANGUAGE} is اردو, write in proper Urdu script. If سنڌي, write in Sindhi/Urdu script mix.
- If {LANGUAGE} is Urdu Roman, write roman urdu like "Khoon ki kami hai"
- Status must be exactly: Low, High, or Normal
- If image is not a lab report, return {"error": "Not a lab report image"}
- Never mention you are AI. Be warm, caring.
- NEVER give medicine names or dosage.
```

## Tools & Models
- **Framework:** Next.js 14 App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS + custom UI components
- **Icons:** `lucide-react`
- **AI Model:** Google Gemini 1.5 Flash Vision API
- **Fonts:** Inter (English) and Noto Nastaliq Urdu (Urdu)

## Screenshots
*(Add screenshots here)*

## How to run locally
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env.local` and add your Gemini API Key.
   ```bash
   GEMINI_API_KEY=your_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
