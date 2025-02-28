"use client"; 

import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession(); 
  
  return (
    <div className="auth-container h-screen bg-blue-200">
      <h1 className='text-center text-2xl transform translate-y-60 font-comic font-bold'>Welcome to the Code Review Tool</h1>
      {session ? (
        <div className="signed-in">
          <p>Signed in as <strong>{session.user.email}</strong></p>
          <button className="sign-out-btn font-comic" onClick={() => signOut()}>Sign out</button>
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
