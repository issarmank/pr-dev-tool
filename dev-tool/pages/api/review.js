import OpenAI from 'openai';
import { getSession } from 'next-auth/react';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, url } = req.body;
    
    // Get the GitHub access token from the session
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
      // Extract owner, repo, and PR number from the URL
      const [, , , owner, repo, , prNumber] = new URL(url).pathname.split('/');
      
      // Fetch the changed files and their diffs from GitHub
      const filesResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );
      const filesData = await filesResponse.json();
      
      // Now GPT-4o can see the actual code changes
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: "system", content: "You are a code review assistant. Analyze the code changes and provide specific, actionable feedback." },
          { role: "user", content: `Review this pull request titled "${title}"\n\nHere are the actual code changes:\n${JSON.stringify(filesData, null, 2)}` }
        ],
        max_tokens: 1000,
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