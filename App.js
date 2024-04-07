import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import LogoPage from './pages/LogoPage';
import MainPage from './pages/MainPage';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); 
  }, []);

  if (isLoading) {
    return <LogoPage />;
  }

  return (
    <NavigationContainer>
      <MainPage />
    </NavigationContainer>
  );
}
