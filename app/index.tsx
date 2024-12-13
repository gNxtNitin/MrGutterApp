import { useState, useEffect } from 'react';
import { SplashScreen } from './components/features/splashScreen/SplashScreen';
import { LoginScreen } from './components/features/login/LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HomeScreen } from './components/features/home/HomeScreen';
import { EstimateDetails } from './components/features/estimate/EstimateDetails';
import { EstimateScreen } from './components/features/estimate/EstimateScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  if (!isLoggedIn) {
    // return <EstimateScreen />;
    return <LoginScreen onLogin={handleLogin} isDarkMode={false} />;
  }

  return <HomeScreen />;
} 
