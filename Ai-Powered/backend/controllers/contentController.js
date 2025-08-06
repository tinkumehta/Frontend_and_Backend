// controllers/contentController.js
import { openai } from '../utils/openaiClient.js';
import asyncHandler from 'express-async-handler';


export const generateContent = asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    res.status(400);
    throw new Error("Prompt is missing");
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.choices[0].message.content;
    res.status(200).json({ content });

  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500);
    throw new Error("Failed to generate content");
  }
});

export const getContentHistory = asyncHandler(async (req, res) => {
  const history = await Content.find({}).sort({ createdAt: -1 });
  res.json(history);
});

export const deleteContent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await Content.findById(id);
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  await item.deleteOne();
  res.json({ message: 'Deleted successfully' });
});
