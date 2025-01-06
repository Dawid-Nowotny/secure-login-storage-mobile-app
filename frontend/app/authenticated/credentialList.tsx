import React, { useState } from 'react';
import { StyleSheet, FlatList, Text, View, Alert, Button } from 'react-native';
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
        <Text style={styles.text}>Platform: {item.platform_name}</Text>
        <Text style={styles.text}>Username: {item.username}</Text>
        <Text style={styles.text}>Password: {item.password}</Text>
      </View>
      <Button title="Delete" color="red" onPress={() => deleteCredential(index)} />
    </View>
  );

  return (
    <FlatList
      data={credentials}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      ListEmptyComponent={<Text style={styles.emptyText}>No credentials found</Text>}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: { flex: 1 },
  text: { fontSize: 16 },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 18, color: 'gray' },
});

export default CredentialList;
