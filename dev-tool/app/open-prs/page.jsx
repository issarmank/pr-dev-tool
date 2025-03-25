'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function OpenPullRequests() {
  const { data: session } = useSession();
  const [pullRequests, setPullRequests] = useState([]);
  const [reviewSuggestions, setReviewSuggestions] = useState({});

  useEffect(() => {
    async function fetchPRs() {
      const response = await fetch('https://api.github.com/search/issues?q=is:pr+is:open+author:@me', {
        headers: {
          Authorization: `Bearer ${session.accessToken}`, // Adjust based on your session data structure
          Accept: 'application/vnd.github.v3+json',
        },
      });

      const data = await response.json();
      setPullRequests(data.items || []);
    }

    if (session) {
      fetchPRs();
    }
  }, [session]);

  async function handleReview(prId, prTitle, prUrl) {
    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: prTitle,
          url: prUrl,
        }),
      });

      const data = await response.json();
      setReviewSuggestions((prev) => ({
        ...prev,
        [prId]: data.suggestions,
      }));
    } catch (error) {
      console.error('Error fetching review suggestions:', error);
    }
  }


  return (
    <div className="p-4 bg-blue-200 min-h-screen">
      <h1 className="text-2xl font-bold mb-7 font-comic text-center">Open Pull Requests</h1>

      {pullRequests.length > 0 ? (
        <ul className="list-disc ml-5">
          {pullRequests.map((pr) => (
            <li key={pr.id} className="mb-2 relative pr-24">
              <a href={pr.html_url} target="_blank" className="text-blue-700 underline">
                {pr.title}
              </a>
              {' '}in <strong>{pr.repository_url.split('/').slice(-1)[0]}</strong>

              <button 
                onClick={() => handleReview(pr.id, pr.title, pr.html_url)}
                className='absolute right-20 top-0 px-2 py-1 bg-[#e74c3c] text-white font-comic rounded-md w-20 font-medium'>
                Review
              </button>

              {reviewSuggestions[pr.id] && (
                <div className="mt-4 p-3 bg-gray-100 rounded-md">
                  <h3 className="font-bold">Suggestions:</h3>
                  <p>{reviewSuggestions[pr.id]}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700 mt-6">You have no open pull requests.</p>
      )}
    </div>
  );
}
