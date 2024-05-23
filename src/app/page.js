'use client';
import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut, } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import ChatbotContainer from './components/ChatbotContainer';
import ChatbotHeader from './components/ChatbotHeader';
import Conversation from './components/Conversation';
import Auth from './components/Auth';


const appSettings = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(appSettings);
const db = getDatabase(app);
const auth = getAuth(app);

const Home = () => {
  const [resetIndicator, setResetIndicator] = useState(false);
  const [user, setUser] = useState(null);

  const handleReset = () => {
    setResetIndicator(!resetIndicator);
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);


  return (
    <main>
      <ChatbotContainer>
        {user ? (
          <>
            <ChatbotHeader user={user} onReset={handleReset} handleSignOut={handleSignOut} />
            <Conversation user={user} db={db} resetIndicator={resetIndicator} />
          </>
        ) : (
          <>
            <ChatbotHeader onReset={handleReset} />
            <div className="sign-in-container">
              <Auth />
            </div>
          </>
        )}
      </ChatbotContainer>
    </main>
  );
};

export default Home;
