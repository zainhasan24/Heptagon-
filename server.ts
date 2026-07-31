import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization of Gemini client
function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Route for Heptagon Student AI Q&A
app.post('/api/student-ai/ask', async (req, res) => {
  try {
    const { question, subject, level, chatHistory } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question parameter is required.' });
    }

    const ai = getGenAIClient();

    const systemInstruction = `You are Heptagon AI (H-E-P-T-A-G-O-N), an intelligent, empathetic, and exceptionally clear AI tutor and study assistant for students.
Your goal is to answer student questions accurately, concisely, and encouragingly.

Guidelines for your answers:
1. Subject & Level Context: Subject is "${subject || 'General Academic'}" at level "${level || 'All Levels'}".
2. Formatting: Use Markdown (bold headers, bullet points, numbered step-by-step logic, LaTeX-style code/math notation where appropriate).
3. Structure:
   - **Direct Answer / Concept Summary**: Start with a clean, clear high-level answer.
   - **Step-by-Step Explanation**: Break down the solution or explanation logically.
   - **Key Formula or Concept Takeaway**: Highlight 1-2 core insights to remember.
   - **Follow-up / Practice Prompt**: Suggest 1-2 related practice questions or deeper topics the student might want to ask next.
4. Tone: Inspiring, professional, clear, and focused on student mastery. Never talk down to the user.`;

    let prompt = question;
    if (chatHistory && Array.isArray(chatHistory) && chatHistory.length > 0) {
      const historyContext = chatHistory
        .map((msg: any) => `${msg.role === 'user' ? 'Student' : 'Heptagon AI'}: ${msg.content}`)
        .join('\n');
      prompt = `Conversation History:\n${historyContext}\n\nCurrent Student Question: ${question}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const answer = response.text || 'Heptagon AI is processing your request. Please retry.';

    return res.json({
      answer,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in Heptagon AI endpoint:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate answer from Heptagon AI.',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Heptagon AI for Students' });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Heptagon Student AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
