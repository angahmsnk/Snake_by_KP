import React from "react";
import { StyleSheet, Text, View } from "react-native";

type ScoreHeaderProps = {
    score: number;
    superFruitTimeLeft: number | null;
};

export default function ScoreHeader({ score, superFruitTimeLeft }: ScoreHeaderProps) {
    return (
        <View style={styles.header}>
            <Text style={styles.scoreText}>Wynik: {score}</Text>
            {superFruitTimeLeft !== null && (
                <Text style={styles.timerText}>
                    ⏱️ Złoty owoc: {(superFruitTimeLeft / 1000).toFixed(1)}s
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    header: { position: 'absolute', top: 40, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    scoreText: { color: 'white', fontSize: 18 },
    timerText: { color: '#FFD700', fontSize: 18, fontWeight: 'bold' }
});
