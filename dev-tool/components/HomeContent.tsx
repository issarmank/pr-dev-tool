'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function HomeContent() {
  const { data: session } = useSession();

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mt-10">PR Dev Tool</h1>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to PR Dev Tool</h2>
            <p className="text-gray-600 text-lg">
              A powerful tool to help you review pull requests efficiently using AI.
            </p>
          </div>
        </div>

        {session ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link 
                href="/open-prs"
                className="p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors duration-200"
              >
                <div className="flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">Open PRs</h3>
                <p className="text-gray-600 text-center">Review your open pull requests</p>
              </Link>

              <Link 
                href="/past-reviews"
                className="p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors duration-200"
              >
                <div className="flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">Past Reviews</h3>
                <p className="text-gray-600 text-center">View your past code reviews</p>
              </Link>
            </div>
            <div className="text-center mt-8">
              <button
                onClick={() => signOut()}
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-6">Please sign in to access the PR Dev Tool</p>
            <Link
              href="/api/auth/signin"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Sign In
            </Link>
          </div>
        )}
      </div>
    </>
  );
} 