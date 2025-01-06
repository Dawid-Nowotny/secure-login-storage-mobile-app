import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text, View, Alert } from 'react-native';
import { Credential } from '../models/Credential';
import { loadCredentials, saveCredentials } from '../utils/secureStorage';

const Home = () => {
  const [platformName, setPlatformName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const addCredential = async () => {
    if (!platformName || !username || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    const newCredential: Credential = {
      platform_name: platformName,
      username,
      password, 
    };

    const existingCredentials = await loadCredentials();
    const updatedCredentials = [...existingCredentials, newCredential];
    await saveCredentials(updatedCredentials);

    setPlatformName('');
    setUsername('');
    setPassword('');
    Alert.alert('Success', 'Credential added');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Platform Name"
        value={platformName}
        onChangeText={setPlatformName}
        placeholderTextColor="#aaa" 
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#aaa" 
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#aaa" 
        secureTextEntry
      />
      <TouchableOpacity onPress={addCredential} style={styles.button}>
        <Text style={styles.buttonText}>Add Credential</Text>
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
  input: { 
    color: '#fff', 
    borderRadius: 5, 
    borderColor: '#ffdd00', 
    backgroundColor: '#202020', 
    fontSize: 20,
    borderWidth: 2, 
    marginBottom: 10, 
    paddingHorizontal: 10 
  },
  button: {
    backgroundColor: '#ffdd00', 
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#222', 
    fontWeight: '700',
    textTransform: 'uppercase',
    textAlign: 'center',
    fontSize: 20,
  },
  logoText1: {
    color: '#ffdd00', 
    fontSize: 39,
    fontWeight: '500',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  logoText2: {
    color: '#ffdd00', 
    fontSize: 39,
    fontWeight: '500',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 150, 
  },
});

export default Home;
