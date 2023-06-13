'use client';
import { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import ChatbotContainer from './components/ChatbotContainer';
import ChatbotHeader from './components/ChatbotHeader';
import Conversation from './components/Conversation';

const appSettings = {
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB_URL,
};

const app = initializeApp(appSettings);
const db = getDatabase(app);

const Home = () => {
  const [resetIndicator, setResetIndicator] = useState(false);

  const handleReset = () => {
    setResetIndicator(!resetIndicator);
  };

  return (
    <main>
      <ChatbotContainer>
        <ChatbotHeader onReset={handleReset} />
        <Conversation db={db} resetIndicator={resetIndicator} />
      </ChatbotContainer>
    </main>
  );
};

export default Home;
