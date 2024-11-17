import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { supabase } from '../../supabase'; // Certifique-se de que o caminho está correto para o seu arquivo supabase.js
import { Ionicons } from '@expo/vector-icons'; // Para o ícone na hotbar
import { useRouter } from 'expo-router'; // Para navegação
import GroupCard from '@/components/groupCard'; // Importa o componente de card

interface Group {
  id_grupo: number;
  nome_grupo: string;
  tema: string;
  integrantes?: string[]; // Array com os nomes dos integrantes
  avaliacoes?: {
    descricao: string;
    nota: number;
  }[];
}

export default function HomeScreen() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  // Função principal para buscar os dados
  const fetchData = async () => {
  setLoading(true);

  try {
    // Query para buscar grupos
    const { data: grupos, error: gruposError } = await supabase
      .from('grupos')
      .select('id_grupo, nome_grupo, tema, id_avaliacao');

    if (gruposError) {
      console.error(`Erro ao buscar grupos: ${gruposError.message}`);
      setGroups([]);
      return;
    }

    // Query para buscar avaliações
    const { data: avaliacoes, error: avaliacoesError } = await supabase
      .from('avaliacoes')
      .select('id_avaliacao, descricao, nota');

    if (avaliacoesError) {
      console.error(`Erro ao buscar avaliações: ${avaliacoesError.message}`);
      setGroups([]);
      return;
    }

    // Query para buscar alunos
    const { data: alunos, error: alunosError } = await supabase
      .from('alunos')
      .select('nome, id_grupo');

    if (alunosError) {
      console.error(`Erro ao buscar alunos: ${alunosError.message}`);
      setGroups([]);
      return;
    }

    // Log de debug para verificar os dados
    console.log('Grupos:', grupos);
    console.log('Avaliações:', avaliacoes);
    console.log('Alunos:', alunos);

    // Combinar os dados
    const combinedData = grupos.map((grupo) => {
      // Obter avaliação associada ao grupo
      const grupoAvaliacoes = avaliacoes.find(
        (avaliacao) => avaliacao.id_avaliacao === grupo.id_avaliacao
      );
    
      // Obter alunos associados ao grupo
      const grupoAlunos = alunos
        .filter((aluno) => aluno.id_grupo === grupo.id_grupo)
        .map((aluno) => ({ nome: aluno.nome })); // Retorna objetos com o nome dos alunos
    
      return {
        ...grupo,
        avaliacoes: grupoAvaliacoes ? [grupoAvaliacoes] : [],
        alunos: grupoAlunos, // Corrige aqui para passar os alunos
      };
    });
    
    // Atualiza o estado com os dados combinados
    setGroups(combinedData);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro inesperado:', error.message); // Acesse a mensagem do erro
    } else {
      console.error('Erro inesperado:', error); // Caso o erro não seja do tipo Error
    }
    setGroups([]);
  }


  setLoading(false);
};
  
  const handleLogout = () => {
    setMenuVisible(false);
    router.push('/login'); // Redireciona para a tela de login
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Hotbar */}
      <View style={styles.hotbar}>
        <Text style={styles.hotbarText}>Inova!</Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.iconButton}>
          <Ionicons name="person-circle-outline" size={50} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Modal de Menu */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setMenuVisible(false)} // Fecha o modal ao clicar fora
        >
          <View style={styles.modalWrapper}>
            {/* Seta do Modal */}
            <View style={styles.triangle} />
            {/* Conteúdo do Modal */}
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={() => { setMenuVisible(false); /* Navegação para Perfil */ }}>
                <Text style={styles.modalOption}>Perfil</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setMenuVisible(false); /* Navegação para Configurações */ }}>
                <Text style={styles.modalOption}>Configurações</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout}>
                <Text style={[styles.modalOption, styles.logoutOption]}>Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Mensagem de Boas-Vindas */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Bem vindo ao{'\n'}Inova!</Text>
        <Text style={styles.subText}>Selecione abaixo os{'\n'}grupos que deseja ver.</Text>
      </View>

      {/* Lista de Grupos como Cards */}
      <FlatList
        data={groups}
        keyExtractor={(item) => (item.id_grupo ? item.id_grupo.toString() : Math.random().toString())}
        renderItem={({ item }) => <GroupCard group={item} />} // Usa o componente `GroupCard`
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f5',
  },
  hotbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10, 
    backgroundColor: '#007bff',
  },
  hotbarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50, // Ajusta a largura
    height: 50, // Ajusta a altura
    borderRadius: 25, // (Opcional) Adiciona uma borda arredondada
    paddingRight: 55,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 70,
    paddingRight: 10,
  },
  modalWrapper: {
    alignItems: 'center',
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fff',
    marginBottom: -1,
  },
  modalContent: {
    width: 120,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOption: {
    fontSize: 16,
    color: '#007bff',
    paddingVertical: 8,
    width: '100%',
    textAlign: 'center',
  },
  logoutOption: {
    color: 'red', // Define a cor de "Sair" como vermelho
  },
  welcomeContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#f0f0f5',
    alignItems: 'flex-start',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subText: {
    fontSize: 16,
    color: '#666',
  },
  list: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f5', // Opcional: cor de fundo durante o carregamento
  },
});
