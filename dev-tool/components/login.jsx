"use client"; 

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession(); 
  
  return (
    <div className="auth-container h-screen bg-blue-200">
      <nav className='flex justify-between items-center bg-[#e74c3c] p-4'>
      {session && (
          <>
            <Link href="/open-prs" className="font-comic hover:text-blue-600 ml-20 font-bold">
              Open Pull Requests
            </Link>
            <Link href="/past-reviews" className="font-comic hover:text-blue-600 mr-20 font-bold">
              Past Code Reviews
            </Link>
          </>
        )}
      </nav>
      <h1 className='text-center text-2xl transform translate-y-60 font-comic font-bold'>Welcome to the Code Review Tool</h1>
      {session ? (
        <div className="signed-in">
          <p>Signed in as <strong>{session.user.email}</strong></p>
          <button className="sign-out-btn font-comic mt-4" onClick={() => signOut()}>Sign out</button>
        </div>
      ) : (
        <div className="not-signed-in">
          <button className="sign-in-btn font-comic" onClick={() => signIn()}>Sign in</button>
          <h1 className='font-comic text-center text-lg mt-5'>Created By Issar Manknojiya</h1>
        </div>
      )}
    </div>
  );
}
