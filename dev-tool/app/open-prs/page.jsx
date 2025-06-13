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

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.statusText}`);
        }

        const data = await response.json();
        setPullRequests(data.items || []);
      } catch (err) {
        console.error('Error fetching PRs:', err);
        setError('Failed to fetch pull requests. Please try again.');
      }
    }

    if (session) {
      fetchPRs();
    }
  }, [session]);

  async function handleReview(prId, prTitle, prUrl) {
    setLoading(true);
    setError(null);
    setSelectedPR(prId);
    
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
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch review');
      }

      const data = await response.json();
      const reviewContent = data.result;

      // Save the review to localStorage
      const review = {
        prId,
        prTitle,
        prUrl,
        reviewContent,
        timestamp: new Date().toISOString()
      };

      // Get existing reviews
      const existingReviews = JSON.parse(localStorage.getItem('prReviews') || '[]');
      
      // Add new review
      const updatedReviews = [review, ...existingReviews];
      
      // Save back to localStorage
      localStorage.setItem('prReviews', JSON.stringify(updatedReviews));

      setReviewSuggestions((prev) => ({
        ...prev,
        [prId]: reviewContent,
      }));
    } catch (error) {
      console.error('Error fetching review suggestions:', error);
      setError(error.message || 'Failed to fetch review suggestions. Please try again.');
      setReviewSuggestions((prev) => ({
        ...prev,
        [prId]: null,
      }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Open Pull Requests</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column: Pull requests list */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Pull Requests</h2>
            {pullRequests.length > 0 ? (
              <ul className="space-y-4">
                {pullRequests.map((pr) => (
                  <li key={pr.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <a 
                          href={pr.html_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-lg font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {pr.title}
                        </a>
                        <div className="mt-1 text-sm text-gray-600">
                          in <span className="font-semibold">{pr.repository_url.split('/').slice(-1)[0]}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleReview(pr.id, pr.title, pr.html_url)}
                        disabled={loading && selectedPR === pr.id}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                          loading && selectedPR === pr.id 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {loading && selectedPR === pr.id ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Reviewing...
                          </span>
                        ) : reviewSuggestions[pr.id] ? 'Reviewed' : 'Review'}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-center py-8">You have no open pull requests.</p>
            )}
          </div>

          {/* Right column: Review document */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Code Review</h2>
            {loading && selectedPR ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 text-lg">Analyzing pull request...</p>
              </div>
            ) : selectedPR && reviewSuggestions[selectedPR] ? (
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <ReactMarkdown
                    components={{
                      code: ({node, inline, className, children, ...props}) => (
                        <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                          {children}
                        </code>
                      ),
                      h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-gray-900 mb-4" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-2xl font-semibold text-gray-800 mb-3" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-xl font-semibold text-gray-800 mb-2" {...props} />,
                      p: ({node, ...props}) => <p className="text-gray-700 mb-4 leading-relaxed" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                      li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
                      blockquote: ({node, ...props}) => (
                        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-4" {...props} />
                      ),
                    }}
                  >
                    {reviewSuggestions[selectedPR]}
                  </ReactMarkdown>
                </div>
                
                {/* Export options */}
                <div className="border-t pt-6 mt-6 flex gap-4">
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
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download as Markdown
                  </button>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(reviewSuggestions[selectedPR]);
                      alert('Review copied to clipboard!');
                    }}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-600 text-lg">Select a pull request to review</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}