import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
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

const AuthenticationScreen = ({ onAuthenticated }: { onAuthenticated: () => void }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const authenticate = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        setIsAuthenticated(true);
        onAuthenticated();
        return;
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        setAlertMessage('Please set up PIN or biometrics on your device');
        setAlertVisible(true);
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access the app',
        fallbackLabel: 'Use PIN',
      });

      if (result.success) {
        setIsAuthenticated(true);
        onAuthenticated();
      } else {
        setAlertMessage('Authentication failed. Please try again.');
        setAlertVisible(true);
      }
    } catch (error) {
      setAlertMessage('Something went wrong during authentication');
      setAlertVisible(true);
      console.error(error);
    }
  };

  useEffect(() => {
    authenticate();
  }, []);

  return (
    <View style={styles.container}>
      {!isAuthenticated && <Text style={styles.text}>Please authenticate to continue</Text>}
      {!isAuthenticated && (
        <TouchableOpacity onPress={authenticate} style={styles.button}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      )}
      <CustomAlert visible={alertVisible} message={alertMessage} onClose={() => setAlertVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#141414',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#ffdd00',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#222',
    fontSize: 16,
    fontWeight: 'bold',
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

export default AuthenticationScreen;
