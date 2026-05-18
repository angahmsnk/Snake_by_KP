import { router } from 'expo-router';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useGameContext } from './context/GameContext';

export default function HighScores() {
    const { highScores } = useGameContext();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>TOP 10 Wyników</Text>
            
            <FlatList
                data={highScores}
                keyExtractor={(_, index) => index.toString()}
                ListEmptyComponent={<Text style={styles.empty}>Brak wyników.</Text>}
                renderItem={({ item, index }) => (
                    <View style={styles.scoreRow}>
                        <View style={styles.playerInfo}>
                            <Text style={[styles.rank, index === 0 && styles.gold]}>#{index + 1}</Text>
                            <Text style={styles.nickText}>{item.nickname}</Text>
                        </View>

                        {/* Wynik i Data */}
                        <View style={styles.scoreDetails}>
                            <Text style={styles.points}>{item.points} PKT</Text>
                            <Text style={styles.date}>{item.date}</Text>
                        </View>
                    </View>
                )}
            />

            <Pressable style={styles.backBtn} onPress={() => router.back()}>
                <Text style={styles.backText}>POWRÓT</Text>
            </Pressable>
            <Pressable style={styles.warnBtn} onPress={() => highScores.length > 0 && Alert.alert("Wyczyść wyniki", "Czy na pewno chcesz usunąć wszystkie wyniki?", [
                { text: "Anuluj", style: "cancel" },
                { text: "Wyczyść", style: "destructive", onPress: () => {
                    highScores.length = 0;
                    router.back();
                }}
            ])}>
                <Text style={styles.warnText}>Wyczyść wyniki</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1a1a1a', padding: 40 },
    title: { color: '#4CAF50', fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    scoreRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingVertical: 15, 
        borderBottomWidth: 1, 
        borderBottomColor: '#333' 
    },
    playerInfo: { flexDirection: 'row', alignItems: 'center' },
    rank: { color: '#888', fontWeight: 'bold', width: 35, fontSize: 16 },
    gold: { color: '#FFD700' }, // Złoty kolor dla numeru 1!
    nickText: { color: '#4CAF50', fontSize: 20, fontWeight: 'bold' },
    scoreDetails: { alignItems: 'flex-end' },
    points: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    date: { color: '#666', fontSize: 12 },
    empty: { color: '#888', textAlign: 'center', marginTop: 50 },
    backBtn: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, marginTop: 20 },
    backText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
    warnBtn: { backgroundColor: '#FF5252', padding: 15, borderRadius: 10, marginTop: 10 },
    warnText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
});