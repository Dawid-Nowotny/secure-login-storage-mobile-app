import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, View, Alert } from 'react-native';
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
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Add Credential" onPress={addCredential} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 },
});

export default Home;
