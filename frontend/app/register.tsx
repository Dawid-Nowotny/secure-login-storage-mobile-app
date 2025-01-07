import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text, View, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { register } from './utils/api';
import { setTokens } from './utils/secureStorage';
import Ionicons from 'react-native-vector-icons/Ionicons'; 

interface CustomAlertProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ visible, message, onClose }) => {
  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#ffdd00" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
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
    if (!email || !password || !confirmPassword) {
      setAlertMessage('All fields are required');
      setAlertVisible(true);
      return;
    }

    if (!passwordsMatch) {
      setAlertMessage('Passwords do not match');
      setAlertVisible(true);
      return;
    }

    try {
      const response = await register(email, password);
      await setTokens(response.access_token, response.refresh_token);

      setAlertMessage(response.message || 'Registration successful!');
      setAlertVisible(true);
      router.replace('/');
    } catch (error: any) {
      setAlertMessage(error.response?.data?.message || 'Registration failed');
      setAlertVisible(true);
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
        onChangeText={handlePasswordChange}
        secureTextEntry
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={handleConfirmPasswordChange}
        secureTextEntry
        placeholderTextColor="#aaa"
      />
      {!passwordsMatch && (
        <Text style={styles.errorText}>Passwords do not match</Text>
      )}
      <TouchableOpacity onPress={handleRegister} style={styles.button}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <View style={{ height: 10 }} />

      <TouchableOpacity onPress={() => router.push('./')} style={styles.button}>
              <Text style={styles.buttonText}>Go back to login</Text>
      </TouchableOpacity>

      <CustomAlert visible={alertVisible} message={alertMessage} onClose={() => setAlertVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20,
    backgroundColor: '#141414',
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    paddingVertical: 40,
    paddingHorizontal: 30,
    backgroundColor: '#202020',
    borderRadius: 10,
    alignItems: 'flex-start', 
  },
  closeButton: {
    position: 'absolute', 
    right: 10,
    top: 10,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  errorText: { color: 'red', marginBottom: 10 },
});

export default RegisterScreen;
