import OpenAI from "openai";
import dotenv from 'dotenv'

dotenv.config();
//console.log(process.env.OPENAI_API_KEY);


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const getCareerAdvice = async (req, res) => {
  try {
    const { skills, interests } = req.body;

    const prompt = `
      Based on the following user skills and interests:
      Skills: ${skills}
      Interests: ${interests}
      Suggest:
      1. 3 suitable career paths
      2. 3 online courses to upskill
      3. 3 internships or job roles.
      Format the answer in bullet points.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ result: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ message: "Error generating advice", error });
  }
};
