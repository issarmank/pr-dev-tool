'use client';

import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">PR Dev Tool</h1>
          <p className="text-xl text-gray-700 mb-8">AI-powered code review assistant</p>
          <button
            onClick={() => signIn('github')}
            className="bg-gray-900 text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-gray-800 transition-colors"
          >
            Sign in with GitHub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome, {session.user?.name}!</h1>
          <p className="text-gray-600">Choose an option below to get started</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Link href="/open-prs">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">Review Open PRs</h2>
              <p className="text-gray-600">Generate AI reviews for your open pull requests</p>
            </div>
          </Link>

          <Link href="/past-reviews">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">Past Reviews</h2>
              <p className="text-gray-600">View your previously generated reviews</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}