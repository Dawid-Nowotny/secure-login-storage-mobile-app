import React, { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

const AuthenticatedLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const accessToken = await SecureStore.getItemAsync('access_token');
      if (accessToken) {
        setIsLoggedIn(true);
      } else {
        router.replace('/'); 
      }
    };
    checkLoginStatus();
  }, []);

  if (!isLoggedIn) {
    return null; 
  }

  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
};

export default AuthenticatedLayout;