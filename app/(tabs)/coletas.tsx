import { StyleSheet, TouchableOpacity, Modal, TextInput, View, Text } from "react-native";
import { useState } from "react";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

// Formato de um Galpão para iniciar a lista vazia
type Coleta = {
  id: string;
  dataHora: string;
  quantidadeOvos: string;
};

export default function ColetasScreen() {
  // A lista inicia vazia
  const [coletas, setColetas] = useState<Coleta[]>([]);
  
  const [modalVisible, setModalVisible] = useState(false);
  
  const [novaDataHora, setNovaDataHora] = useState('');
  const [novaQuantidadeOvos, setNovaQuantidadeOvos] = useState('');

  const salvarColeta = () => {
    if (novaDataHora.trim() === '' || novaQuantidadeOvos.trim() === '') return;

    const novaColeta = {
      id: Math.random().toString(),
      dataHora: novaDataHora,
      quantidadeOvos: novaQuantidadeOvos 
    };

    setColetas([...coletas, novaColeta]);
    
    setNovaDataHora('');
    setNovaQuantidadeOvos('');
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
            <ThemedText style={styles.addButtonText}>+ Adicionar Coleta</ThemedText>
          </TouchableOpacity>
        }
      >
        <ThemedView style={styles.containerLista}>
          <ThemedText type="title" style={{ marginBottom: 15 }}>Minhas Coletas</ThemedText>
          
          {/* Onde os cards da lista são desenhados */}
          {coletas.map((coleta) => (
            <View key={coleta.id} style={styles.card}>
              <ThemedText type="subtitle" style={styles.cardTitle}>Data e hora: {coleta.dataHora}</ThemedText>
              <ThemedText>Quantidade: {coleta.quantidadeOvos} ovos</ThemedText>
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
            <Text style={styles.modalTitulo}>Nova Coleta</Text>

            <TextInput
              style={styles.input}
              placeholder="Data e hora"
              placeholderTextColor="#999"
              value={novaDataHora}
              onChangeText={setNovaDataHora}
            />

            <TextInput
              style={styles.input}
              placeholder="Quantidade de ovos"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={novaQuantidadeOvos}
              onChangeText={setNovaQuantidadeOvos}
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
                onPress={salvarColeta}
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