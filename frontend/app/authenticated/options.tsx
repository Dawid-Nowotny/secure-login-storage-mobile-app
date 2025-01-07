import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity, View, Text, Modal } from 'react-native';
import { Account } from '../models/Account';
import { BackendAccount } from '../models/BackendAccount';
import { useRouter } from 'expo-router';
import { clearTokens, clearAccounts, getAccessToken, loadAccounts, saveAccounts } from '../utils/secureStorage';
import { syncAccounts, fetchAccounts } from '../utils/api';
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

const OptionsScreen = () => {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useFocusEffect(
      React.useCallback(() => {
        const fetchAccounts = async () => {
          try {
            const storedAccounts = await loadAccounts();
            setAccounts(storedAccounts || []);
          } catch (error) {
            setAlertMessage('Failed to load accounts');
            setAlertVisible(true);
          }
        };
  
        fetchAccounts();
      }, [])
    );

  const handleLogout = async () => {
    await clearTokens();
    router.replace('/');
  };

  const handleDelete = async () => {
    try {
      await clearAccounts();
      setAccounts([]);
      setAlertMessage('All accounts have been deleted');
      setAlertVisible(true);
    } catch (error) {
      setAlertMessage('Failed to delete accounts');
      setAlertVisible(true);
    }
  };

  const syncWithBackend = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        setAlertMessage('You are not authorized to sync accounts');
        setAlertVisible(true);
        return;
      }

      const formattedAccounts: BackendAccount[] = accounts.map(account => ({
        platform_name: account.platform_name,
        username: account.username,
        password_encrypted: account.password, 
      }));

      await syncAccounts(formattedAccounts, token);
  
      setAlertMessage('Accounts synchronized with the backend');
      setAlertVisible(true);
    } catch (error: any) {
      setAlertMessage(error.message || 'Something went wrong while syncing');
      setAlertVisible(true);
    }
  };

  const fetchAccountsFromBackend = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        setAlertMessage('You are not authorized to fetch accounts');
        setAlertVisible(true);
        return;
      }
  
      const fetchedAccounts = await fetchAccounts(token);

      const formattedAccounts: Account[] = fetchedAccounts.map(account => ({
        platform_name: account.platform_name,
        username: account.username,
        password: account.password_encrypted, 
      }));
  
      await saveAccounts(formattedAccounts);
      setAccounts(formattedAccounts);
  
      setAlertMessage('Accounts successfully fetched and updated');
      setAlertVisible(true);
    } catch (error: any) {
      setAlertMessage(error.message || 'Something went wrong while fetching accounts');
      setAlertVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={syncWithBackend} style={styles.button}>
        <Text style={styles.buttonText}>Sync with Backend</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={fetchAccountsFromBackend} style={styles.button}>
        <Text style={styles.buttonText}>Fetch Accounts from Backend</Text>
      </TouchableOpacity>

      <View style={styles.textBox}>
        <Text style={styles.text}>All your accounts are saved on this device.</Text>
        <Text style={styles.text}>You can remove your accounts from the device before logging out.</Text>
        <Text style={styles.text}>If you have synchronized them with the server,</Text>
        <Text style={styles.text}>you will have the option to restore them.</Text>
      </View>

      <TouchableOpacity onPress={handleDelete} style={[styles.button, styles.deleteButton]}>
        <Text style={styles.buttonText}>Delete Accounts</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={[styles.button]}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      <CustomAlert visible={alertVisible} message={alertMessage} onClose={() => setAlertVisible(false)} />
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
});

export default OptionsScreen;
