import { StyleSheet, TouchableOpacity, Modal, TextInput, View, Text } from "react-native";
import { useState } from "react";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

// Formato de um Galpão para iniciar a lista vazia
type Galpao = {
  id: string;
  nome: string;
  capacidade: string;
};

export default function GalpoesScreen() {
  // A lista inicia vazia
  const [galpoes, setGalpoes] = useState<Galpao[]>([]);
  
  const [modalVisible, setModalVisible] = useState(false);
  
  const [novoNome, setNovoNome] = useState('');
  const [novaCap, setNovaCap] = useState('');

  const salvarGalpao = () => {
    if (novoNome.trim() === '' || novaCap.trim() === '') return;

    const novo = {
      id: Math.random().toString(),
      nome: novoNome,
      capacidade: novaCap 
    };

    setGalpoes([...galpoes, novo]);
    
    setNovoNome('');
    setNovaCap('');
    setModalVisible(false);
  };

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#ffffff", dark: "#000000" }}
        headerImage={
          <TouchableOpacity 
            style={styles.addButtonHeader}
            onPress={() => setModalVisible(true)}
          >
            <ThemedText style={styles.addButtonText}>+ Adicionar Galpão</ThemedText>
          </TouchableOpacity>
        }
      >
        <ThemedView style={styles.containerLista}>
          <ThemedText type="title" style={{ marginBottom: 15 }}>Meus Galpões</ThemedText>
          
          {/* Onde os cards da lista são desenhados */}
          {galpoes.map((galpao) => (
            <View key={galpao.id} style={styles.card}>
              <ThemedText type="subtitle" style={styles.cardTitle}>Nome: {galpao.nome}</ThemedText>
              <ThemedText>Capacidade: {galpao.capacidade} aves</ThemedText>
            </View>
          ))}
        </ThemedView>
      </ParallaxScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalFundo}>
          <View style={styles.modalCaixa}>
            <Text style={styles.modalTitulo}>Novo Galpão</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome do Galpão"
              placeholderTextColor="#999"
              value={novoNome}
              onChangeText={setNovoNome}
            />

            <TextInput
              style={styles.input}
              placeholder="Capacidade Máxima"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={novaCap}
              onChangeText={setNovaCap}
            />

            <View style={styles.botoesContainer}>
              <TouchableOpacity 
                style={[styles.botao, styles.botaoCancelar]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textoBotao}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.botao, styles.botaoSalvar]} 
                onPress={salvarGalpao}
              >
                <Text style={styles.textoBotao}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  addButtonHeader: {
    alignSelf: 'center',
    marginTop: 100,
    backgroundColor: '#d97706',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    elevation: 6,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  containerLista: {
    paddingTop: 10,
  },
  card: {
    backgroundColor: '#2A2D32',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#d97706',
  },
  cardTitle: {
    marginBottom: 4,
  },
  modalFundo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalCaixa: {
    width: '85%',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
    elevation: 10,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#2A2D32',
    color: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botao: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  botaoCancelar: {
    backgroundColor: '#555',
  },
  botaoSalvar: {
    backgroundColor: '#d97706',
  },
  textoBotao: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  }
});