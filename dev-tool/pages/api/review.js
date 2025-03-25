import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, url } = req.body;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: "system", content: "You are a helpful code review assistant." },
          { role: "user", content: `Analyze this GitHub pull request titled "${title}" at ${url}. Provide a list of possible improvements and changes.` }
        ],
        max_tokens: 200,
      });

      res.status(200).json({ result: completion.choices[0].message.content });
    } catch (error) {
      console.error('Error with OpenAI API:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json(`Method Not Allowed`);
  }
}
