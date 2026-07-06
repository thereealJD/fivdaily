import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { word } = req.body;
    if (!word) {
      return res.status(400).json({ error: 'Word is required' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Migrated to Gemini 3.5 Flash
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `Generate exactly 7 unique, clear, and highly illustrative educational example sentences using the word "${word}". Return a JSON array of 7 strings.`;
    
    const result = await model.generateContent(prompt);
    const sentences = JSON.parse(result.response.text());
    
    return res.status(200).json(sentences);

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Failed to generate sentences' });
  }
}
