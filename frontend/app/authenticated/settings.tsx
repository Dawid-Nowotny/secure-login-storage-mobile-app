import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

const SettingsScreen = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default SettingsScreen;