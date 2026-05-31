import Slider from '@react-native-community/slider';
import { StyleSheet, Text, View } from 'react-native';
import { useGameContext } from './context/GameContext';

export default function Settings() {

    const { settings, updateSettings } = useGameContext();

    const handleMapSize = (value: number) => {
        updateSettings({ mapSize: value });
    }

    const handleSnakeStartLength = (value: number) => {
        updateSettings({ snakeStartLength: value });
    }

    const handleFruitAvailabilityTime = (value: number) => {
        updateSettings({ fruitAvailabilityTime: value });
    }

    const handleSpeed = (value: number) => {
        updateSettings({ speed: value });
    }

    return (
        <View style={styles.outerContainer}>
            <View style={styles.cardContainer}>
                <Text style={styles.title}>Ustawienia Gry</Text>
                
                <View style={styles.settingRow}>
                    <Text style={styles.label}>Wielkość mapy: {settings.mapSize}</Text>
                    <Slider 
                        minimumValue={15} 
                        step={1} 
                        maximumValue={30} 
                        minimumTrackTintColor="#4CAF50"
                        maximumTrackTintColor="#333"
                        thumbTintColor="#4CAF50"
                        value={settings.mapSize} 
                        onValueChange={handleMapSize}
                    />
                </View>
                
                <View style={styles.settingRow}>
                    <Text style={styles.label}>Długość węża: {settings.snakeStartLength}</Text>
                    <Slider 
                        minimumValue={3} 
                        step={1} 
                        maximumValue={10} 
                        minimumTrackTintColor="#4CAF50"
                        maximumTrackTintColor="#333"
                        thumbTintColor="#4CAF50"
                        value={settings.snakeStartLength} 
                        onValueChange={handleSnakeStartLength}
                    />
                </View>
                
                <View style={styles.settingRow}>
                    <Text style={styles.label}>Czas dostępności owocu: {settings.fruitAvailabilityTime / 1000} s</Text>
                    <Slider 
                        minimumValue={3000} 
                        step={1000} 
                        maximumValue={15000} 
                        minimumTrackTintColor="#4CAF50"
                        maximumTrackTintColor="#333"
                        thumbTintColor="#4CAF50"
                        value={settings.fruitAvailabilityTime} 
                        onValueChange={handleFruitAvailabilityTime}
                    />
                </View>
                
                <View style={styles.settingRow}>
                    <Text style={styles.label}>Prędkość gry: {settings.speed}</Text>
                    <Slider 
                        minimumValue={1} 
                        step={1} 
                        maximumValue={10} 
                        minimumTrackTintColor="#4CAF50"
                        maximumTrackTintColor="#333"
                        thumbTintColor="#4CAF50"
                        value={settings.speed} 
                        onValueChange={handleSpeed}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: '#131313',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    cardContainer: {
        width: '100%',
        maxWidth: 480,
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
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 25,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    settingRow: {
        marginVertical: 15,
    },
    label: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 8,
        fontWeight: '500',
    },
});