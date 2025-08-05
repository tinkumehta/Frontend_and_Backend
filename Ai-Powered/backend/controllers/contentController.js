// controllers/contentController.js
import { openai } from '../utils/openaiClient.js';
import asyncHandler from 'express-async-handler';

export const generateContent = asyncHandler(async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    res.status(400).json({ message: "Prompt is required" });
    return;
  }

  const chatResponse = await openai.chat.completions.create({
    model: "gpt-4", // or "gpt-3.5-turbo"
    messages: [
      { role: "system", content: "You are a helpful content assistant." },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 700,
  });

  const generated = chatResponse.choices[0].message.content;
  res.status(200).json({ content: generated });
});
