import { useState, useEffect } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import * as Location from 'expo-location';

// Formato de um Galpão para iniciar a lista vazia
type Galpao = {
  id: number;
  nome: string;
  capacidade: number;
  latitude?: number;
  longitude?: number;
};

export default function GalpoesScreen() {
  // A lista inicia vazia
  const [galpoes, setGalpoes] = useState<Galpao[]>([]);

  const [modalVisible, setModalVisible] = useState(false);

  const [editarGalpao, setEditarGalpao] = useState<Galpao>();

  const [novoNome, setNovoNome] = useState("");
  const [novaCap, setNovaCap] = useState("");

  const [localizacao, setLocalizacao] = useState<Location.LocationObject | null>(null);

  //Quando a tela abre essa função ler os dados;
  useEffect (() => {
    async function getData() {
      try {
        const data = await AsyncStorage.getItem("@GalpoesApp:galpoes");
        if (data !== null) {
          setGalpoes(JSON.parse(data));
        }
      } catch(e) {
        console.log("Erro ao ler dados", e);
      }
    }
    getData();
  }, []);

  useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync(); 
        if (status !== 'granted') {
          console.log('Permissão negada'); 
          return;
        }
        let location = await Location.getCurrentPositionAsync({}); 
        setLocalizacao(location);
      })();
  }, []);

  const salvarGalpao = () => {
    if (!editarGalpao) {
      if (novoNome.trim() === "" || novaCap.trim() === "") return;
      const novo = {
        id: Date.now(),
        nome: novoNome,
        capacidade: Number(novaCap),
        latitude: localizacao?.coords.latitude,
        longitude: localizacao?.coords.longitude,
      };

      //Salvar ultilizando AsyncStorage;
      const novaLista = [...galpoes, novo];
      setGalpoes(novaLista);
      AsyncStorage.setItem("@GalpoesApp:galpoes", JSON.stringify(novaLista));

      setNovoNome("");
      setNovaCap("");

      setModalVisible(false);
    } else {
      const editar = {
        id: editarGalpao.id,
        nome: novoNome,
        capacidade: Number(novaCap),
        latitude: editarGalpao.latitude, 
        longitude: editarGalpao.longitude, 
      };

      //Editar utilizando o AsyncStorage;
      const novaLista = galpoes.map((galpao) => {
        if (galpao.id === editarGalpao.id) {
          return editar;
        } else {
          return galpao;
        }
      });
      
      setGalpoes(novaLista);
      AsyncStorage.setItem("@GalpoesApp:galpoes", JSON.stringify(novaLista));

      setNovoNome("");
      setNovaCap("");
      setEditarGalpao(undefined);
      setModalVisible(false);
    }
  };

  const prepararEdicao = (galpaoClicado: Galpao) => {
    setEditarGalpao(galpaoClicado);
    setNovoNome(galpaoClicado.nome);
    setNovaCap(galpaoClicado.capacidade.toString());
    setModalVisible(true);
  };

  const deletarGalpao = () => {
    if (editarGalpao) {
      //Deletar utilizando o AsyncStorage.
      const novaLista = galpoes.filter((galpao) => galpao.id !== editarGalpao.id);
      
      setGalpoes(novaLista);
      AsyncStorage.setItem("@GalpoesApp:galpoes", JSON.stringify(novaLista));
      
      setNovoNome("");
      setNovaCap("");
      setEditarGalpao(undefined);
      setModalVisible(false);
    }
  };

  const abrirModalNovo = () => {
    setEditarGalpao(undefined);
    setNovoNome("");
    setNovaCap("");
    setModalVisible(true);
  };

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#ffffff", dark: "#000000" }}
        headerImage={
          <TouchableOpacity
            style={styles.addButtonHeader}
            onPress={abrirModalNovo}
          >
            <ThemedText style={styles.addButtonText}>
              + Adicionar Galpão
            </ThemedText>
          </TouchableOpacity>
        }
      >
        <ThemedView style={styles.containerLista}>
          <ThemedText type="title" style={{ marginBottom: 15 }}>
            Meus Galpões
          </ThemedText>

          {/* Onde os cards da lista são desenhados */}
          {galpoes.map((galpao) => (
            <TouchableOpacity
              key={galpao.id}
              style={styles.card}
              onPress={() => prepararEdicao(galpao)}
            >
              <ThemedText type="subtitle" style={styles.cardTitle}>
                Nome: {galpao.nome}
              </ThemedText>
              <ThemedText>Capacidade: {galpao.capacidade} aves</ThemedText>
              {galpao.latitude && galpao.longitude && (
                <ThemedText style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>
                    Localização: {galpao.latitude.toFixed(4)}, {galpao.longitude.toFixed(4)}
                </ThemedText>
              )}
            </TouchableOpacity>
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
            <Text style={styles.modalTitulo}>
              {editarGalpao ? "Editar Galpão" : "Novo Galpão"}
            </Text>

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

              {editarGalpao && (
                <TouchableOpacity
                  style={[styles.botao, styles.botaoDeletar]}
                  onPress={deletarGalpao}
                >
                  <Text style={styles.textoBotao}>Deletar</Text>
                </TouchableOpacity>
              )}

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
    alignSelf: "center",
    marginTop: 100,
    backgroundColor: "#d97706",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    elevation: 6,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  containerLista: {
    paddingTop: 10,
  },
  card: {
    backgroundColor: "#2A2D32",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#d97706",
  },
  cardTitle: {
    marginBottom: 4,
  },
  modalFundo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalCaixa: {
    width: "85%",
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 20,
    elevation: 10,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#2A2D32",
    color: "#FFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  botoesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  botao: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  botaoCancelar: {
    backgroundColor: "#555",
  },
  botaoSalvar: {
    backgroundColor: "#d97706",
  },
  // Estilo adicionado para o botão deletar na cor vermelha
  botaoDeletar: {
    backgroundColor: "red",
  },
  textoBotao: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
