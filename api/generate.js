import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { word } = req.body;
    if (!word) {
      return res.status(400).json({ error: 'Word is required' });
    }

    // Initialize Gemini using the secure environment variable Vercel holds
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Generate exactly 7 unique, clear, and highly illustrative educational example sentences using the word "${word}". Return ONLY a valid JSON array of 7 strings. Example format: ["sentence1", "sentence2", ...]`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Clean up markdown formatting if the model wraps it
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) cleanedText = cleanedText.substring(7);
    else if (cleanedText.startsWith('```')) cleanedText = cleanedText.substring(3);
    if (cleanedText.endsWith('```')) cleanedText = cleanedText.substring(0, cleanedText.length - 3);

    const sentences = JSON.parse(cleanedText);
    
    // Send the sentences back to your frontend
    return res.status(200).json(sentences);

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Failed to generate sentences' });
  }
}
