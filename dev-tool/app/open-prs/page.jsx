'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import ReactMarkdown from 'react-markdown';

export default function OpenPullRequests() {
  const { data: session } = useSession();
  const [pullRequests, setPullRequests] = useState([]);
  const [reviewSuggestions, setReviewSuggestions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPR, setSelectedPR] = useState(null);

  useEffect(() => {
    async function fetchPRs() {
      try {
        const response = await fetch('https://api.github.com/search/issues?q=is:pr+is:open+author:@me', {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        });

        const data = await response.json();
        setPullRequests(data.items || []);
      } catch (err) {
        console.error('Error fetching PRs:', err);
      }
    }

    if (session) {
      fetchPRs();
    }
  }, [session]);

  async function handleReview(prId, prTitle, prUrl) {
    setLoading(true);
    setError(null);
    
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

      if (!response.ok) {
        throw new Error('Failed to fetch review');
      }

      const data = await response.json();
      setReviewSuggestions((prev) => ({
        ...prev,
        [prId]: data.result || data.suggestions,
      }));
      setSelectedPR(prId);
    } catch (error) {
      console.error('Error fetching review suggestions:', error);
      setError('Failed to fetch review suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-blue-200">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-7 font-comic text-center">Open Pull Requests</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column: Pull requests list */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold mb-4">Your Pull Requests</h2>
            {pullRequests.length > 0 ? (
              <ul className="space-y-3">
                {pullRequests.map((pr) => (
                  <li key={pr.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                    <div>
                      <a href={pr.html_url} target="_blank" className="text-blue-700 hover:underline">
                        {pr.title}
                      </a>
                      <span className="text-sm text-gray-600 block">
                        in <strong>{pr.repository_url.split('/').slice(-1)[0]}</strong>
                      </span>
                    </div>
                    <button 
                      onClick={() => handleReview(pr.id, pr.title, pr.html_url)}
                      disabled={loading || reviewSuggestions[pr.id]}
                      className={`px-4 py-2 text-white font-comic rounded-md font-medium ${
                        loading || reviewSuggestions[pr.id] ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#e74c3c] hover:bg-red-600'
                      }`}>
                      {loading && selectedPR === pr.id ? 'Reviewing...' : reviewSuggestions[pr.id] ? 'Reviewed' : 'Review'}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700">You have no open pull requests.</p>
            )}
          </div>

          {/* Right column: Review document */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Code Review</h2>
            {selectedPR && reviewSuggestions[selectedPR] ? (
              <div className="space-y-4">
                <div className="prose max-w-none">
                  <ReactMarkdown>
                    {reviewSuggestions[selectedPR]}
                  </ReactMarkdown>
                </div>
                
                {/* Export options */}
                <div className="border-t pt-4 mt-4 flex gap-3">
                  <button 
                    onClick={() => {
                      const element = document.createElement('a');
                      const file = new Blob([reviewSuggestions[selectedPR]], {type: 'text/markdown'});
                      element.href = URL.createObjectURL(file);
                      element.download = `PR-review-${selectedPR}.md`;
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Download as Markdown
                  </button>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(reviewSuggestions[selectedPR]);
                      alert('Review copied to clipboard!');
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Select a pull request to review
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}