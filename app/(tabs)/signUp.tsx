import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../supabase'; // Certifique-se de que o caminho está correto para o arquivo supabase.js

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); // Para armazenar mensagens de erro ou sucesso
  const [messageType, setMessageType] = useState<'error' | 'success' | ''>(''); // Define o tipo da mensagem
  const router = useRouter();

  const handleSignUp = async () => {
    setMessage(''); // Limpa mensagens anteriores
    setMessageType('');

    // Verifica se os campos estão preenchidos
    if (!name || !matricula || !email || !password || !confirmPassword) {
      setMessage('Por favor, preencha todos os campos.');
      setMessageType('error');
      return;
    }

    // Verifica se as senhas coincidem
    if (password !== confirmPassword) {
      setMessage('As senhas não coincidem!');
      setMessageType('error');
      return;
    }

    setLoading(true);

    try {
      // Passo 1: Criação do usuário no Supabase Auth
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setMessage(`Erro no cadastro: ${authError.message}`);
        setMessageType('error');
        return;
      }

      // Passo 2: Inserção de dados na tabela "alunos"
      const { error: insertError } = await supabase.from('alunos').insert([
        { nome: name, matricula, email },
      ]);

      if (insertError) {
        setMessage(`Erro ao salvar informações: ${insertError.message}`);
        setMessageType('error');
        return;
      }

      // Sucesso no cadastro
      setMessage('Cadastro realizado com sucesso!');
      setMessageType('success');
      setTimeout(() => router.push('/login'), 2000); // Redireciona para a tela de login após 2 segundos
    } catch (error) {
      console.error('Erro inesperado:', error);
      setMessage('Ocorreu um erro inesperado. Tente novamente mais tarde.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      {/* Nome e Matrícula */}
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Nome"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Matrícula"
          value={matricula}
          onChangeText={setMatricula}
          keyboardType="numeric"
        />
      </View>

      {/* Email */}
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Senha e Confirmação de Senha */}
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmação de Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {/* Botão de Cadastro */}
      <TouchableOpacity
        style={styles.signUpButton}
        onPress={handleSignUp}
        disabled={loading}
      >
        <Text style={styles.signUpButtonText}>{loading ? 'Carregando...' : 'Cadastrar'}</Text>
      </TouchableOpacity>

      {/* Mensagem de Feedback */}
      {message ? (
        <Text style={[styles.feedbackMessage, messageType === 'error' ? styles.errorText : styles.successText]}>
          {message}
        </Text>
      ) : null}

      {/* Link para Login */}
      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.backLinkText}>Já possui cadastro?</Text>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    maxWidth: 300,
    marginBottom: 16,
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
  halfInput: {
    width: '48%',
  },
  signUpButton: {
    height: 45,
    width: '60%',
    maxWidth: 200,
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 16,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  feedbackMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
  },
  successText: {
    color: 'green',
  },
  backLinkText: {
    color: '#007bff',
    fontSize: 16,
    marginTop: 16,
    textDecorationLine: 'underline',
  },
});
