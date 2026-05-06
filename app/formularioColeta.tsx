import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter, Stack } from "expo-router"; // Importamos o Stack aqui

export default function FormularioColetaScreen() {
  const router = useRouter();
  
  const [novaQuantidadeOvos, setNovaQuantidadeOvos] = useState("");

  return (
    <View style={styles.container}>
     
      <Stack.Screen options={{ headerShown: false }} />

     
        <Text style={styles.titulo}>Nova Coleta</Text>

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
            onPress={() => router.back()}
          >
            <Text style={styles.textoBotao}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botao, styles.botaoSalvar]}
            onPress={() => router.back()} // Apenas volta para simular o salvar
          >
            <Text style={styles.textoBotao}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#151718",
    padding: 20,
  },
  caixa: {
    width: "100%",
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 20,
  },
  titulo: {
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
  textoBotao: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});