import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useGameContext } from "./context/GameContext";

export default function index() {

  const router = useRouter();

  const [playerName, setPlayerName] = useState("Jaś Fasola");
  const { updateSettings } = useGameContext();

  const handleStartGame = async () => {
    if (playerName.length >= 3) {
      try {
        await updateSettings({ nickname: playerName });

        router.push("/Game");
      } catch (error) {
        console.error("Error saving player name: ", error);
      }
    }
  }

  const handleSettings = () => {
    router.push("/Settings");
  }

  const handleHighScores = () => {
    router.push("/HighScores");
  }

  return (
    <View style={styles.outerContainer}>
      <View style={styles.cardContainer}>
        <Text style={styles.title}>SNEJK</Text>

        <Text style={styles.label}>Podaj swoje imię:</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Jaś Fasola"
          placeholderTextColor="#666"
          value={playerName}
          onChangeText={(text) => setPlayerName(text || "")}
        />

        <View style={styles.buttonGroup}>
          <Pressable onPress={handleStartGame} disabled={playerName.length < 3} style={styles.buttonWrapper}>
            <Text disabled={playerName.length < 3} style={[styles.buttonText, playerName.length < 3 ? styles.disabledButton : styles.activeButton]}>
              Rozpocznij grę
            </Text>
          </Pressable>

          <Pressable onPress={handleSettings} style={styles.buttonWrapper}>
            <Text style={[styles.buttonText, styles.activeButton, { backgroundColor: "#2196F3" }]}>Ustawienia</Text>
          </Pressable>

          <Pressable onPress={handleHighScores} style={styles.buttonWrapper}>
            <Text style={[styles.buttonText, styles.activeButton, { backgroundColor: "#FF9800" }]}>Wyniki</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}


export const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#131313",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  cardContainer: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#333",
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 35,
    textTransform: "uppercase",
    letterSpacing: 2,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    color: "#aaa",
    alignSelf: "flex-start",
    marginBottom: 8,
    marginLeft: "10%",
  },
  textInput: {
    height: 48,
    borderColor: "#444",
    borderWidth: 1,
    borderRadius: 8,
    width: "80%",
    color: "#fff",
    backgroundColor: "#222",
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 25,
  },
  buttonGroup: {
    width: "80%",
    marginTop: 10,
  },
  buttonWrapper: {
    width: "100%",
    marginVertical: 6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FAFAFA",
    textAlign: "center",
    paddingVertical: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  disabledButton: {
    backgroundColor: "#2a2a2a",
    color: "#555",
    borderWidth: 1,
    borderColor: "#222",
    opacity: 0.6,
  },
  activeButton: {
    backgroundColor: "#4CAF50",
    opacity: 1,
  },
});
