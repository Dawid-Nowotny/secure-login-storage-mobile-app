import React, { useState } from 'react';
import { StyleSheet, FlatList, Text, View, TouchableOpacity, Modal } from 'react-native';
import { Account } from '../models/Account';
import { loadAccounts, saveAccounts } from '../utils/secureStorage';
import { useFocusEffect } from '@react-navigation/native';
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

const AccountList = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      const fetchAccounts = async () => {
        try {
          const storedAccounts = await loadAccounts();
          setAccounts(storedAccounts);
        } catch (error) {
          setAlertMessage('Failed to load accounts');
          setAlertVisible(true);
        }
      };

      fetchAccounts();
    }, [])
  );

  const deleteAccount = async (index: number) => {
    try {
      const updatedAccounts = accounts.filter((_, i) => i !== index); 
      setAccounts(updatedAccounts); 
      await saveAccounts(updatedAccounts); 
      setAlertMessage('Account deleted successfully');
      setAlertVisible(true);
    } catch (error) {
      setAlertMessage('Failed to delete account');
      setAlertVisible(true);
    }
  };

  const renderItem = ({ item, index }: { item: Account; index: number }) => (
    <View style={styles.item}>
      <View style={styles.info}>
        <Text style={styles.platformName}>{item.platform_name}</Text>
        <Text style={styles.text}>Username: {item.username}</Text>
        <Text style={styles.text}>Password: {item.password}</Text>
      </View>
      <TouchableOpacity onPress={() => deleteAccount(index)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={accounts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No accounts found</Text>}
      />
      
      <CustomAlert visible={alertVisible} message={alertMessage} onClose={() => setAlertVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 10, 
    color: '#fff', 
    backgroundColor: '#141414' 
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    backgroundColor: '#202020',
    borderRadius: 5,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: { flex: 1 },
  text: { fontSize: 16, color: '#fff' },
  platformName: { fontSize: 18, fontWeight: 'bold', color: '#ffdd00' },
  deleteButton: {
    backgroundColor: '#ff4444', 
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 18, color: 'gray' },
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

export default AccountList;
