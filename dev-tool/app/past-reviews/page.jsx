'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function PastCodeReviews() {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    // Load reviews from localStorage
    const savedReviews = localStorage.getItem('prReviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Past Code Reviews</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column: Reviews list */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Reviews</h2>
            {reviews.length > 0 ? (
              <ul className="space-y-4">
                {reviews.map((review) => (
                  <li 
                    key={review.prId} 
                    className={`p-4 bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200 ${
                      selectedReview?.prId === review.prId ? 'bg-blue-50 border-2 border-blue-200' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedReview(review)}
                  >
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{review.prTitle}</h3>
                      <div className="mt-1 text-sm text-gray-600">
                        Reviewed on {new Date(review.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-center py-8">No past reviews found.</p>
            )}
          </div>

          {/* Right column: Review content */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Review Details</h2>
            {selectedReview ? (
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
                    {selectedReview.reviewContent}
                  </ReactMarkdown>
                </div>
                
                <div className="border-t pt-6 mt-6">
                  <a 
                    href={selectedReview.prUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View Pull Request
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-600 text-lg">Select a review to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}