import React, { useState } from 'react';
import { StyleSheet, FlatList, Text, View, Alert, TouchableOpacity } from 'react-native';
import { Credential } from '../models/Credential';
import { loadCredentials, saveCredentials } from '../utils/secureStorage';
import { useFocusEffect } from '@react-navigation/native';

const CredentialList = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchCredentials = async () => {
        try {
          const storedCredentials = await loadCredentials();
          setCredentials(storedCredentials);
        } catch (error) {
          Alert.alert('Error', 'Failed to load credentials');
        }
      };

      fetchCredentials();
    }, [])
  );

  const deleteCredential = async (index: number) => {
    try {
      const updatedCredentials = credentials.filter((_, i) => i !== index); 
      setCredentials(updatedCredentials); 
      await saveCredentials(updatedCredentials); 
      Alert.alert('Success', 'Credential deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete credential');
    }
  };

  const renderItem = ({ item, index }: { item: Credential; index: number }) => (
    <View style={styles.item}>
      <View style={styles.info}>
        <Text style={styles.platformName}>{item.platform_name}</Text>
        <Text style={styles.text}>Username: {item.username}</Text>
        <Text style={styles.text}>Password: {item.password}</Text>
      </View>
      <TouchableOpacity onPress={() => deleteCredential(index)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={credentials}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No credentials found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 10, color: '#fff', backgroundColor: '#141414' },
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
});

export default CredentialList;
