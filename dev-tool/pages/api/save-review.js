import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const { prId, prTitle, prUrl, reviewContent } = req.body;

      // Here you would typically save to a database
      // For now, we'll use localStorage on the client side
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error saving review:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
} 