import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ControlsProps = {
    onDirectionChange: (newDir: string) => void;
};

export default function Controls({ onDirectionChange }: ControlsProps) {
    return (
        <View style={styles.controls}>
            <View style={styles.controlRow}>
                <Pressable style={styles.btn} onPress={() => onDirectionChange("up")}>
                    <Text style={styles.btnText}>UP</Text>
                </Pressable>
            </View>
            <View style={styles.controlRow}>
                <Pressable style={styles.btn} onPress={() => onDirectionChange("left")}>
                    <Text style={styles.btnText}>LEFT</Text>
                </Pressable>
                <Pressable style={styles.btn} onPress={() => onDirectionChange("down")}>
                    <Text style={styles.btnText}>DOWN</Text>
                </Pressable>
                <Pressable style={styles.btn} onPress={() => onDirectionChange("right")}>
                    <Text style={styles.btnText}>RIGHT</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    controls: { marginTop: 40 },
    controlRow: { flexDirection: 'row', justifyContent: 'center' },
    btn: { width: 70, height: 70, backgroundColor: '#222', margin: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 15, borderWidth: 1, borderColor: '#333' },
    btnText: { color: 'white', fontWeight: 'bold' }
});
