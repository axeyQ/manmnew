// src/components/AuthButton.js
'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-4">
        <p>Welcome, {session.user?.name}</p>
        <button
          onClick={() => signOut()}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
      <div className='hidden md:block' >

      <iframe src="https://forms.gle/CgZLtYzL25rmiZw89" width="640" height="722" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
      </div>
      <div className='block md:hidden'>

      <iframe src="https://forms.gle/CgZLtYzL25rmiZw89"  width="380" height="700" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
      </div>
      
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('google')}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Sign in with Google
    </button>
  );
}