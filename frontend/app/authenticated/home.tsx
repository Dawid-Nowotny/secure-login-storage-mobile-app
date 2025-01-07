import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text, View, Modal } from 'react-native';
import { Account } from '../models/Account';
import { loadAccounts, saveAccounts } from '../utils/secureStorage';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Importujemy ikonę

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

const Home = () => {
  const [platformName, setPlatformName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const addAccount = async () => {
    if (!platformName || !username || !password) {
      setAlertMessage('All fields are required');
      setAlertVisible(true);
      return;
    }

    const newAccount: Account = {
      platform_name: platformName,
      username,
      password,
    };

    const existingAccounts = await loadAccounts();
    const updatedAccounts = [...existingAccounts, newAccount];
    await saveAccounts(updatedAccounts);

    setPlatformName('');
    setUsername('');
    setPassword('');
    setAlertMessage('Account added');
    setAlertVisible(true);
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
      <TouchableOpacity onPress={addAccount} style={styles.button}>
        <Text style={styles.buttonText}>Add Account</Text>
      </TouchableOpacity>

      <CustomAlert visible={alertVisible} message={alertMessage} onClose={() => setAlertVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingHorizontal: 10,
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
  },
});

export default Home;
