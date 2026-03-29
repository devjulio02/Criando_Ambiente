import { Image } from "expo-image";
import { StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function GranjaScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#FFFFFF", dark: "#000000" }}
      headerImage={
        <Image
          source={require("@/assets/images/logoGalinha.png")}
          style={styles.reactLogo}
          contentFit="contain"
        />
      }    
    >
      <ThemedView style={styles.titleContainer}> 
        <ThemedText type="title">Seja bem vindo a nossa granja!</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Quem Somos?</ThemedText>
        <ThemedText>
          Somos uma granja familiar dedicada à avicultura de postura caipira.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">O que fazemos?</ThemedText>
        <ThemedText>
          Produzimos ovos caipira de qualidade, prezando sempre os cuidados com
          o meio ambiente e o bem-estar animal.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Nosso objetivo:</ThemedText>
        <ThemedText>
          Sermos referência em nossa região, sendo sinônimo de confiabilidade e
          qualidade para nossos clientes.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
