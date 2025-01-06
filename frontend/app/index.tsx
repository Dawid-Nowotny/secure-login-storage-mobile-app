import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, View, Alert, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { login } from './utils/api';
import { setTokens } from './utils/secureStorage';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await login(email, password);
      await setTokens(response.access_token, response.refresh_token);

      Alert.alert('Success', 'Login successful!');
      router.replace('./authenticated/home');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logoText1}>Secure Login</Text>
      <Text style={styles.logoText2}>Storage</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#aaa" 
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#aaa" 
      />
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      <View style={{ height: 20 }} />
      
      <TouchableOpacity onPress={() => router.push('./register')} style={styles.button}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 50, color: '#fff', backgroundColor: '#141414' },
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

export default LoginScreen;