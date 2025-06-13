import OpenAI from 'openai';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to truncate file content
function truncateFileContent(file, maxLines = 100) {
  if (!file.patch) return '';
  
  const lines = file.patch.split('\n');
  if (lines.length <= maxLines) return file.patch;
  
  return lines.slice(0, maxLines).join('\n') + '\n... (truncated)';
}

// Helper function to format files for review
function formatFilesForReview(files) {
  return files.map(file => ({
    filename: file.filename,
    status: file.status,
    additions: file.additions,
    deletions: file.deletions,
    changes: file.changes,
    patch: truncateFileContent(file)
  }));
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { url } = req.body;
    
    // Get the GitHub access token from the session using getServerSession
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
      // Extract owner, repo, and PR number from the URL
      const urlParts = new URL(url).pathname.split('/');
      const owner = urlParts[1];
      const repo = urlParts[2];
      const prNumber = urlParts[4];

      if (!owner || !repo || !prNumber) {
        throw new Error('Invalid PR URL format');
      }

      console.log(`Fetching PR details for: ${owner}/${repo}/pulls/${prNumber}`);
      
      // First, get the PR details to get the base and head commits
      const prResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      if (!prResponse.ok) {
        const errorData = await prResponse.json();
        throw new Error(`GitHub PR API error: ${prResponse.statusText} - ${JSON.stringify(errorData)}`);
      }

      const prData = await prResponse.json();
      
      // Now get the files changed
      const filesResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      if (!filesResponse.ok) {
        const errorData = await filesResponse.json();
        throw new Error(`GitHub Files API error: ${filesResponse.statusText} - ${JSON.stringify(errorData)}`);
      }

      const filesData = await filesResponse.json();
      
      // Prepare the context for OpenAI
      const reviewContext = {
        title: prData.title,
        description: prData.body || '',
        changedFiles: formatFilesForReview(filesData)
      };

      // Create the prompt
      const prompt = `Review this pull request titled "${reviewContext.title}"\n\nDescription: ${reviewContext.description}\n\nChanged Files:\n${reviewContext.changedFiles.map(file => 
        `File: ${file.filename}\nStatus: ${file.status}\nChanges: +${file.additions} -${file.deletions}\n\n${file.patch}\n`
      ).join('\n')}`;
      
      try {
        // First try with GPT-4
        const completion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            { 
              role: "system", 
              content: "You are a code review assistant. Analyze the code changes and provide specific, actionable feedback. Focus on code quality, potential bugs, and best practices. Format your response in markdown with clear sections." 
            },
            { role: "user", content: prompt }
          ],
          max_tokens: 2000,
        });

        res.status(200).json({ result: completion.choices[0].message.content });
      } catch (error) {
        if (error.code === 'rate_limit_exceeded' || error.status === 429) {
          // Fallback to GPT-3.5-turbo if GPT-4 rate limit is exceeded
          console.log('Falling back to GPT-3.5-turbo due to rate limit');
          const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
              { 
                role: "system", 
                content: "You are a code review assistant. Analyze the code changes and provide specific, actionable feedback. Focus on code quality, potential bugs, and best practices. Format your response in markdown with clear sections." 
              },
              { role: "user", content: prompt }
            ],
            max_tokens: 2000,
          });

          res.status(200).json({ result: completion.choices[0].message.content });
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error in review API:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}