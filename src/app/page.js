'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import SurveySelector from '@/components/SurveySelector';
import AuthButton from '@/components/AuthButton';
import AuthError from '@/components/AuthError';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [name, setName] = useState('');
  const [selectedSurvey, setSelectedSurvey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!selectedSurvey) {
      setError('Please select a survey');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    // If the user is already authenticated, proceed to the selected survey
    if (session) {
      redirectToSurvey();
    } else {
      // Store form data in localStorage before authentication
      localStorage.setItem('userData', JSON.stringify({ name, selectedSurvey }));
      
      // Trigger Google OAuth sign-in
      signIn('google', { callbackUrl: '/api/auth/callback/google' });
    }
  };
  
  const redirectToSurvey = () => {
    // Redirect to the selected Google Form
    const surveyData = selectedSurvey ? JSON.parse(selectedSurvey) : null;
    
    if (surveyData && surveyData.url) {
      // Save user selection to database
      saveSurveySelection(surveyData);
      
      // Redirect to the Google Form
      window.location.href = surveyData.url;
    }
  };
  
  const saveSurveySelection = async (surveyData) => {
    try {
      await fetch('/api/surveys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          userName: name,
          userEmail: session.user.email,
          surveyId: surveyData.id,
          surveyTitle: surveyData.title,
        }),
      });
    } catch (error) {
      console.error('Error saving survey selection:', error);
    }
  };

  // If the user just got authenticated, retrieve stored data and redirect
  if (status === 'authenticated' && localStorage.getItem('userData')) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    setName(userData.name);
    setSelectedSurvey(userData.selectedSurvey);
    localStorage.removeItem('userData');
    if (userData.selectedSurvey) {
      redirectToSurvey();
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">NGO Survey Portal</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <SurveySelector 
            name={name}
            setName={setName}
            selectedSurvey={selectedSurvey}
            setSelectedSurvey={setSelectedSurvey}
          />
          
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          
          <div className="mt-4">
            <AuthButton 
              isSubmitting={isSubmitting}
              session={session}
            />
          </div>
        </form>
        
        {status === 'loading' && (
          <div className="mt-4 text-center">
            <p>Loading...</p>
          </div>
        )}
      </div>
    </main>
  );
}