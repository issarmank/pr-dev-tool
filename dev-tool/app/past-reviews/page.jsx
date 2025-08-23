'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import ReactMarkdown from 'react-markdown';
import { getUserReviews, deleteReview } from '../../lib/database';

export default function PastCodeReviews() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadReviews() {
      if (!session?.user?.email) return;
      
      setLoading(true);
      const result = await getUserReviews(session.user.email);
      
      if (result.success) {
        // Transform the data to match the expected format
        const transformedReviews = result.data.map(review => ({
          prId: review.pr_id,
          prTitle: review.pr_title,
          prUrl: review.pr_url,
          reviewContent: review.review_content,
          timestamp: review.created_at,
          id: review.id
        }));
        setReviews(transformedReviews);
      } else {
        setError(result.error);
      }
      
      setLoading(false);
    }

    loadReviews();
  }, [session]);

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    const result = await deleteReview(reviewId);
    if (result.success) {
      setReviews(reviews.filter(review => review.id !== reviewId));
      if (selectedReview?.id === reviewId) {
        setSelectedReview(null);
      }
    } else {
      alert('Failed to delete review: ' + result.error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading your reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Past Code Reviews</h1>

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
          {/* Left column: Reviews list */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Reviews</h2>
            {reviews.length > 0 ? (
              <ul className="space-y-4">
                {reviews.map((review) => (
                  <li 
                    key={review.id} 
                    className={`p-4 bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200 ${
                      selectedReview?.id === review.id ? 'bg-blue-50 border-2 border-blue-200' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedReview(review)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{review.prTitle}</h3>
                        <div className="mt-1 text-sm text-gray-600">
                          Reviewed on {new Date(review.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteReview(review.id);
                        }}
                        className="ml-2 p-1 text-red-500 hover:text-red-700 transition-colors duration-200"
                        title="Delete review"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
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