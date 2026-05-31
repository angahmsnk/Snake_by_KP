import { router } from 'expo-router';
import { Alert, FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useGameContext } from './context/GameContext';

export default function HighScores() {
    const { highScores, clearHighScores } = useGameContext();

    return (
        <View style={styles.outerContainer}>
            <View style={styles.cardContainer}>
                <Text style={styles.title}>TOP 10 Wyników</Text>
                
                <FlatList
                    data={highScores}
                    keyExtractor={(_, index) => index.toString()}
                    style={styles.list}
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

                <View style={styles.btnGroup}>
                    <Pressable style={styles.backBtn} onPress={() => router.back()}>
                        <Text style={styles.backText}>POWRÓT</Text>
                    </Pressable>
                    <Pressable style={styles.warnBtn} onPress={() => {
                        if (highScores.length === 0) return;
                        
                        if (Platform.OS === "web") {
                            const confirmed = window.confirm("Czy na pewno chcesz usunąć wszystkie wyniki?");
                            if (confirmed) {
                                clearHighScores().then(() => router.back());
                            }
                        } else {
                            Alert.alert("Wyczyść wyniki", "Czy na pewno chcesz usunąć wszystkie wyniki?", [
                                { text: "Anuluj", style: "cancel" },
                                { text: "Wyczyść", style: "destructive", onPress: async () => {
                                    await clearHighScores();
                                    router.back();
                                }}
                            ]);
                        }
                    }}>
                        <Text style={styles.warnText}>Wyczyść wyniki</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: { 
        flex: 1, 
        backgroundColor: '#131313', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 20 
    },
    cardContainer: {
        width: '100%',
        maxWidth: 520,
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#333',
        padding: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 10,
        maxHeight: '90%',
    },
    title: { color: '#4CAF50', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, textTransform: 'uppercase', letterSpacing: 1 },
    list: {
        maxHeight: 320,
    },
    scoreRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingVertical: 12, 
        borderBottomWidth: 1, 
        borderBottomColor: '#2a2a2a' 
    },
    playerInfo: { flexDirection: 'row', alignItems: 'center' },
    rank: { color: '#888', fontWeight: 'bold', width: 35, fontSize: 16 },
    gold: { color: '#FFD700' }, // Złoty kolor dla numeru 1!
    nickText: { color: '#4CAF50', fontSize: 18, fontWeight: 'bold' },
    scoreDetails: { alignItems: 'flex-end' },
    points: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    date: { color: '#666', fontSize: 11 },
    empty: { color: '#888', textAlign: 'center', marginTop: 30, paddingBottom: 20 },
    btnGroup: {
        marginTop: 20,
        width: '100%',
    },
    backBtn: { backgroundColor: '#2196F3', padding: 12, borderRadius: 8, marginVertical: 6 },
    backText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
    warnBtn: { backgroundColor: '#FF5252', padding: 12, borderRadius: 8, marginVertical: 6 },
    warnText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
});