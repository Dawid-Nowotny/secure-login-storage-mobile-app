import React from 'react';
import { StyleSheet, TouchableOpacity, View, Alert, Text } from 'react-native';
import { Credential } from '../models/Credential';
import { useRouter } from 'expo-router';
import { clearTokens, clearCredentials } from '../utils/secureStorage';

const OptionsScreen = ({ credentials }: { credentials: Credential[] }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await clearTokens();
    router.replace('/');
  };

  const handleDelete = async () => {
    try {
      await clearCredentials(); 
      Alert.alert('Success', 'All credentials have been deleted');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete credentials');
    }
  };

  const syncWithBackend = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8000/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        Alert.alert('Success', 'Credentials synchronized with the backend');
      } else {
        Alert.alert('Error', 'Failed to sync with backend');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while syncing');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={syncWithBackend} style={styles.button}>
        <Text style={styles.buttonText}>Sync with Backend</Text>
      </TouchableOpacity>

      <View style={styles.textBox}>
        <Text style={styles.text}>All your credentials are saved on this device.</Text>
        <Text style={styles.text}>You can remove your credentials from the device before logging out.</Text>
        <Text style={styles.text}>If you have synchronized them with the server,</Text>
        <Text style={styles.text}>you will have the option to restore them.</Text>
      </View>

      <TouchableOpacity onPress={handleDelete} style={[styles.button, styles.deleteButton]}>
        <Text style={styles.buttonText}>Delete Credentials</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={[styles.button, styles.logoutButton]}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#141414' 
  },
  textBox: {  
    borderColor: '#ffdd00', 
    borderWidth: 2, 
    paddingHorizontal: 10, 
    paddingVertical: 10,
    marginVertical: 20,
    backgroundColor: '#202020',
    borderRadius: 5,
  },
  text: { 
    fontSize: 16, 
    color: '#fff', 
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#ffdd00', 
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: '#222', 
    fontWeight: '700',
    textTransform: 'uppercase',
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
  },
  logoutButton: {
    backgroundColor: '#ffdd00',
  },
});

export default OptionsScreen;
