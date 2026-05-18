import Slider from '@react-native-community/slider';
import { Text, View } from 'react-native';
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
        <View style={{ padding: 20 }}>
            <View>
                <Text>Wielkość mapy: {settings.mapSize}</Text>
                <Slider minimumValue={15} step={1} maximumValue={30} thumbSize={32} value={settings.mapSize} onValueChange={handleMapSize}/>
            </View>
            <View>
                <Text>Długość węża: {settings.snakeStartLength}</Text>
                <Slider minimumValue={3} step={1} maximumValue={10} thumbSize={32} value={settings.snakeStartLength} onValueChange={handleSnakeStartLength}/>
            </View>
            <View>
                <Text>Czas dostępności owocu: {settings.fruitAvailabilityTime / 1000} s</Text>
                <Slider minimumValue={3000} step={1000} maximumValue={15000} thumbSize={32} value={settings.fruitAvailabilityTime} onValueChange={handleFruitAvailabilityTime}/>
            </View>
            <View>
                <Text>Prędkość gry: {settings.speed}</Text>
                <Slider minimumValue={1} step={1} maximumValue={10} thumbSize={32} value={settings.speed} onValueChange={handleSpeed}/>
            </View>
        </View>
    )
}