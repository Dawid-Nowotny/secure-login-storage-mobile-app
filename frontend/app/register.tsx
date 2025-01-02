import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, View, Alert, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { register } from './utils/api';
import { setTokens } from './utils/secureStorage';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const router = useRouter();

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordsMatch(text === confirmPassword);
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    setPasswordsMatch(password === text);
  };

  const handleRegister = async () => {
    if (!passwordsMatch) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const response = await register(email, password);
      await setTokens(response.access_token, response.refresh_token);

      Alert.alert('Success', response.message);
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Registration failed');
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
        onChangeText={handlePasswordChange}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={handleConfirmPasswordChange}
        secureTextEntry
      />
      {!passwordsMatch && (
        <Text style={styles.errorText}>Passwords do not match</Text>
      )}
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 },
  errorText: { color: 'red', marginBottom: 10 },
});

export default RegisterScreen;