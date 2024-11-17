import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Group {
  id_grupo: number;
  nome_grupo: string;
  tema: string;
  avaliacoes?: {
    descricao: string;
    nota: number;
  }[];
  alunos?: {
    nome: string;
  }[]; // Adiciona o array de alunos
}

interface GroupCardProps {
  group: Group;
}

export default function GroupCard({ group }: GroupCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <TouchableOpacity
      onPress={() => setIsExpanded(!isExpanded)}
      style={styles.card}
    >
      <Text style={styles.cardTitle}>{group.nome_grupo || 'Nome não disponível'}</Text>
      <Text style={styles.cardSubtitle}>Tema: {group.tema || 'Tema não disponível'}</Text>

      {isExpanded && (
        <View style={styles.details}>
          <Text style={styles.detailTitle}>Integrantes:</Text>
          {group.alunos && group.alunos.length > 0 ? (
            group.alunos.map((aluno, index) => (
              <Text key={index} style={styles.detailItem}>
                - {aluno.nome}
              </Text>
            ))
          ) : (
            <Text style={styles.detailItem}>Nenhum integrante cadastrado</Text>
          )}

          <Text style={styles.detailTitle}>
            Avaliação: {group.avaliacoes?.[0]?.descricao || 'Sem descrição'}
          </Text>
          <Text style={styles.detailTitle}>
            Nota: {group.avaliacoes?.[0]?.nota ?? 'Sem nota disponível'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#007bff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  details: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 4,
  },
  detailItem: {
    fontSize: 14,
    color: '#666',
  },
});
