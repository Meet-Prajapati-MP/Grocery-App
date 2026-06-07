import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebaseconfig';
import Modal from 'react-native-modal';

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSuccessModal(true);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSuccessModal(false);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Forgot Password</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Enter your email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          onPress={handlePasswordReset}
          style={styles.btn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Send Reset Email</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Success */}
      <Modal isVisible={successModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Success!</Text>
          <Text style={styles.modalMsg}>
            A password reset email has been sent to:
          </Text>
          <Text style={styles.modalEmail}>{email}</Text>
          <TouchableOpacity style={styles.modalBtn} onPress={closeModal}>
            <Text style={styles.modalBtnText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#029A35',
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    color: 'white',
    fontSize: 32,
    fontFamily: 'Montserrat_700Bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'gray',
    fontSize: 18,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#F5F5F5',
  },
  btn: {
    backgroundColor: '#029A35',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  btnText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
  },
  link: {
    color: '#029A35',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',
    marginTop: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    color: '#029A35',
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 10,
  },
  modalMsg: {
    fontSize: 16,
    fontFamily: 'Montserrat_500Medium',
    textAlign: 'center',
  },
  modalEmail: {
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#029A35',
    marginVertical: 10,
  },
  modalBtn: {
    backgroundColor: '#029A35',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 15,
  },
  modalBtnText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',
  },
});
