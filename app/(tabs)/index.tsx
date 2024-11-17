import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { supabase } from '../../supabase'; // Certifique-se de que o caminho para o arquivo supabase.js está correto
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Index() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Testa a conexão com o banco ao tentar buscar um registro da tabela 'grupos'
        const { data, error } = await supabase.from('grupos').select('*').limit(1);
        if (error) {
          console.error('Erro ao conectar ao banco:', error); // Loga o erro inteiro para inspecioná-lo
        }
        setIsReady(true); // Conexão estabelecida
      } catch (err) {
        console.error('Erro inesperado:', err); // Loga o erro inteiro em caso de falha
      }
    };

    checkConnection();
  }, []);

  if (!isReady) {
    // Exibe um indicador de carregamento enquanto verifica a conexão
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  // Redireciona para a tela de home assim que a conexão é confirmada
  return <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f5',
  },
});
