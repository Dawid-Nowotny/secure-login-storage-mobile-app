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
      <Tabs.Screen name="home" options={{ title: 'Add credential' }} />
      <Tabs.Screen name="credentialList" options={{ title: 'Credential list' }} />
      <Tabs.Screen name="options" options={{ title: 'Options' }} />
    </Tabs>
  );
};

export default AuthenticatedLayout;