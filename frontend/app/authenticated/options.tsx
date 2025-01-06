import React from 'react';
import { StyleSheet, Button, View, Alert, Text } from 'react-native';
import { Credential } from '../models/Credential';
import { useRouter } from 'expo-router';
import { clearTokens , clearCredentials} from '../utils/secureStorage';

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
      <Button title="Sync with Backend" onPress={syncWithBackend} />
      <View style={{ height: 10 }} />
      <View style={styles.textBox}>
        <Text style={styles.text}>All your credentials are saved on this device.</Text>
        <Text style={styles.text}>You can remove your credentials from the device before logging out.</Text>
        <Text style={styles.text}>If you have synchronized them with the server,</Text>
        <Text style={styles.text}>you will have the option to restore them.</Text>
      </View>
      <View style={{ height: 10 }} />
      <Button title="Delete credentials" onPress={handleDelete} />
      <View style={{ height: 10 }} />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 },
  textBox: {  borderColor: 'gray', borderWidth: 1, paddingHorizontal: 10, paddingVertical: 10  },
  info: { flex: 1 },
  text: { fontSize: 16, textAlign: 'center'},
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 18, color: 'gray' },
  container: { padding: 20 },
});


export default OptionsScreen;
