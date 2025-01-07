import React, { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import Ionicons from "react-native-vector-icons/Ionicons";

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
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#202020', 
          borderTopWidth: 0, 
        },
        tabBarActiveTintColor: '#ffdd00', 
        tabBarInactiveTintColor: '#aaa', 
        headerStyle: { backgroundColor: '#202020' }, 
        headerTintColor: '#ffdd00', 
        headerTitleStyle: { fontWeight: 'bold' }, 
      }}
    >
      <Tabs.Screen 
        name="home" 
        options={{ 
          title: 'Add account',
          tabBarIcon: ({ color }) => <Ionicons name="add-circle-outline" size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="accountList" 
        options={{ 
          title: 'Account list',
          tabBarIcon: ({ color }) => <Ionicons name="list-outline" size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="options" 
        options={{ 
          title: 'Options',
          tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={24} color={color} />
        }} 
      />
    </Tabs>
  );
};

export default AuthenticatedLayout;
