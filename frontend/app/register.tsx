import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://10.0.2.2:8000/api/user/register', {
        username: email,
        password,
      });

      if (response.status === 200) {
        await SecureStore.setItemAsync('access_token', response.data.access_token);
        await SecureStore.setItemAsync('refresh_token', response.data.refresh_token);

        Alert.alert('Success', response.data.message);
        router.replace('./login');
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        Alert.alert('Error', error.response.data.message || 'Registration failed');
      } else {
        Alert.alert('Error', 'Something went wrong.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button title="Register" onPress={handleRegister} />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 },
});

export default RegisterScreen;