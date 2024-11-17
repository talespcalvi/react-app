import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSendEmail = () => {
    console.log('Email de recuperação enviado para:', email);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperação de Senha</Text>
      <Text style={styles.instructions}>Digite seu e-mail para receber as instruções de redefinição de senha.</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.sendButton} onPress={handleSendEmail}>
        <Text style={styles.sendButtonText}>Enviar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backLinkText}>Voltar ao login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center', // Centraliza os elementos horizontalmente
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  input: {
    height: 45,
    width: '80%',
    maxWidth: 300,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sendButton: {
    height: 45,
    width: '60%',
    maxWidth: 200,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 16,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backLinkText: {
    color: '#007bff',
    fontSize: 16,
    marginTop: 16,
    textDecorationLine: 'underline',
  },
});
