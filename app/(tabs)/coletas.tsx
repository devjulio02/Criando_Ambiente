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

type Coleta = {
  id: number;
  dataHora: Date;
  quantidadeOvos: number;
  latitude?: number;
  longitude?: number;
};

export default function ColetasScreen() {
  const [coletas, setColetas] = useState<Coleta[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editarColeta, setEditarColeta] = useState<Coleta>();
  
  const [novaQuantidadeOvos, setNovaQuantidadeOvos] = useState("");

  const [localizacao, setLocalizacao] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    async function getData() {
      try {
        const data = await AsyncStorage.getItem("@ColetasApp:coletas");
        if (data !== null) {
          const coletasSalvas = JSON.parse(data);
          //Ajuste para lidar com a data do mesmo jeito que estava antes;
          const coletasComDataReal = coletasSalvas.map((coleta: any) => ({
            ...coleta,
            dataHora: new Date(coleta.dataHora) 
          }));
          
          setColetas(coletasComDataReal);
        }
      } catch (e) {
        console.log("Erro ao ler coletas", e);
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

  const salvarColeta = () => {
    if (!editarColeta) {
      if (novaQuantidadeOvos.trim() === "") return;
      const novaColeta = {
        id: Date.now(), 
        dataHora: new Date(), 
        quantidadeOvos: Number(novaQuantidadeOvos), 
        //Salva a coordenada lida junto com a nova coleta
        latitude: localizacao?.coords.latitude,
        longitude: localizacao?.coords.longitude,
      };

      //Salvar;
      const novaLista = [...coletas, novaColeta];
      setColetas(novaLista);
      AsyncStorage.setItem("@ColetasApp:coletas", JSON.stringify(novaLista));

      setNovaQuantidadeOvos("");
      setModalVisible(false);
    } else {
      if (novaQuantidadeOvos.trim() === "") return;

      const editar = {
        id: editarColeta.id,
        dataHora: editarColeta.dataHora, 
        quantidadeOvos: Number(novaQuantidadeOvos),
        latitude: editarColeta.latitude, // Mantém o GPS original
        longitude: editarColeta.longitude, 
      };

      //Editar;
      const novaLista = coletas.map((coleta) => {
        if (coleta.id === editarColeta.id) {
          return editar;
        } else {
          return coleta;
        }
      });

      setColetas(novaLista);
      AsyncStorage.setItem("@ColetasApp:coletas", JSON.stringify(novaLista));

      setNovaQuantidadeOvos("");
      setEditarColeta(undefined);
      setModalVisible(false);
    }
  };

  const prepararEdicao = (coletaClicada: Coleta) => {
    setEditarColeta(coletaClicada);
    setNovaQuantidadeOvos(coletaClicada.quantidadeOvos.toString());
    setModalVisible(true);
  };

  const deletarColeta = () => {
    if (editarColeta) {
      
      //Deletar;
      const novaLista = coletas.filter((coleta) => coleta.id !== editarColeta.id);

      setColetas(novaLista);
      AsyncStorage.setItem("@ColetasApp:coletas", JSON.stringify(novaLista));

      setNovaQuantidadeOvos("");
      setEditarColeta(undefined);
      setModalVisible(false);
    }
  };

  const abrirModalNovo = () => {
    setEditarColeta(undefined);
    setNovaQuantidadeOvos("");
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
              + Adicionar Coleta
            </ThemedText>
          </TouchableOpacity>
        }
      >
        <ThemedView style={styles.containerLista}>
          <ThemedText type="title" style={{ marginBottom: 15 }}>
            Minhas Coletas
          </ThemedText>

          {coletas.map((coleta) => (
            <TouchableOpacity
              key={coleta.id}
              style={styles.card}
              onPress={() => prepararEdicao(coleta)}
            >
              {/* O JavaScript formata a data automática para o padrão brasileiro aqui na tela */}
              <ThemedText type="subtitle" style={styles.cardTitle}>
                Data: {coleta.dataHora.toLocaleDateString("pt-BR")} às {coleta.dataHora.toLocaleTimeString("pt-BR", { hour: '2-digit', minute:'2-digit' })}
              </ThemedText>
              <ThemedText>Quantidade: {coleta.quantidadeOvos} ovos</ThemedText>
              {coleta.latitude && coleta.longitude && (
                <ThemedText style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>
                    Localização: {coleta.latitude.toFixed(4)}, {coleta.longitude.toFixed(4)}
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
              {editarColeta ? "Corrigir Quantidade" : "Nova Coleta"}
            </Text>

            {/* O ÚNICO campo de texto do modal inteiro */}
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

              {/* Só aparece se tiver uma coleta na prancheta para ser deletada */}
              {editarColeta && (
                <TouchableOpacity
                  style={[styles.botao, styles.botaoDeletar]}
                  onPress={deletarColeta}
                >
                  <Text style={styles.textoBotao}>Deletar</Text>
                </TouchableOpacity>
              )}

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
  botaoDeletar: {
    backgroundColor: "red",
  },
  textoBotao: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});