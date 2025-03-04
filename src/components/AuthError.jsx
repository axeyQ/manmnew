'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthError() {
  const searchParams = useSearchParams();
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      switch (errorParam) {
        case 'OAuthAccountNotLinked':
          setError('This email is already associated with another account. Please sign in using the original method you used.');
          break;
        case 'OAuthSignin':
          setError('Error in the OAuth sign-in process. Please try again.');
          break;
        case 'OAuthCallback':
          setError('Error in the OAuth callback. Please try again.');
          break;
        case 'OAuthCreateAccount':
          setError('Error creating OAuth account. Please try again.');
          break;
        case 'EmailCreateAccount':
          setError('Error creating email account. Please try again.');
          break;
        case 'Callback':
          setError('Error in the OAuth callback. Please try again.');
          break;
        case 'AccessDenied':
          setError('Access denied. You do not have permission to sign in.');
          break;
        default:
          setError(`An error occurred during sign in: ${errorParam}`);
          break;
      }
    }
  }, [searchParams]);

  if (!error) return null;

  return (
    <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg">
      <p>{error}</p>
    </div>
  );
}