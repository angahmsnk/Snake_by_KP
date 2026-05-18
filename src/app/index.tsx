import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useGameContext } from "./context/GameContext";

export default function index() {

  const router = useRouter();

  const [playerName, setPlayerName] = useState("Jaś Fasola");
  const { updateSettings } = useGameContext();

  const handleStartGame = async () => {
    if(playerName.length >= 3) {
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
     
      <View style={styles.inputName}>
        <Text style={styles.label}>Podaj swoje imię:</Text>
        <TextInput style={{ height: 40, borderColor: "gray", borderWidth: 1, width: "60%", marginTop: 10, paddingHorizontal: 10 }}
          placeholder="Jaś Fasola"
          value={playerName}
          onChangeText={(text) => setPlayerName(text || "")}
        />
        
        <Pressable onPress={handleStartGame} disabled={playerName.length < 3}>
          <Text disabled={playerName.length < 3} style={[styles.buttonText, playerName.length < 3 ? styles.disabledButton : styles.activeButton]}>Rozpocznij grę</Text>
        </Pressable>
        <Pressable onPress={handleSettings}>
          <Text style={[styles.buttonText, styles.activeButton]}>Ustawienia</Text>
        </Pressable>
        <Pressable onPress={handleHighScores}>
          <Text style={[styles.buttonText, styles.activeButton]}>Wyniki</Text>
        </Pressable>
      </View>
    
  );
}


export const styles = StyleSheet.create({
  inputName: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  label: {
    fontSize: 18,
  },
  buttonText: {
    fontSize: 18,
    color: "#FAFAFA",
    marginTop: 20,
    backgroundColor: "lightgray",
    padding: 10,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: "lightgray",
    opacity: 0.5,
  },
  activeButton: {
    backgroundColor: "blue",
    opacity: 1,
  },
});
