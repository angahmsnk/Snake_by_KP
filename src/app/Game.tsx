import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Dimensions, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useGameContext } from "./context/GameContext";

export default function Game() {
    const { width } = Dimensions.get("window");
    const { settings } = useGameContext();
    
    const MAP_SIZE = settings.mapSize;
    const START_LENGTH = settings.snakeStartLength;
    const FRUIT_TIMEOUT = settings.fruitAvailabilityTime;
    const CELL_SIZE = (width - 40) / MAP_SIZE;

    // Generowanie początkowego węża
    const createInitialSnake = () => {
        const initial = [];
        for (let i = 0; i < START_LENGTH; i++) {
            initial.push({ x: Math.floor(MAP_SIZE / 2) - i, y: Math.floor(MAP_SIZE / 2) });
        }
        return initial;
    };

    // --- STAN GRY ---
    const [snake, setSnake] = useState(createInitialSnake());
    const [direction, setDirection] = useState("right");
    const [fruit, setFruit] = useState({ x: 0, y: 0 });
    const [isGameOver, setIsGameOver] = useState(false);
    
    // Ref do śledzenia czasu owocu (żeby nie powodować rerenderów samym licznikiem)
    const lastFruitSpawn = useRef(Date.now());

    // Generowanie owocu w wolnym miejscu
    const spawnFruit = useCallback(() => {
        let newFruit: { x: number, y: number };
        while (true) {
            newFruit = {
                x: Math.floor(Math.random() * MAP_SIZE),
                y: Math.floor(Math.random() * MAP_SIZE)
            };
            // Sprawdź czy nie spawnujemy owocu wewnątrz węża
            const inSnake = snake.some(s => s.x === newFruit.x && s.y === newFruit.y);
            if (!inSnake) break;
        }
        lastFruitSpawn.current = Date.now();
        return newFruit;
    }, [MAP_SIZE, snake]);

    // Inicjalizacja pierwszego owocu
    useEffect(() => {
        setFruit(spawnFruit());
    }, []);

    const { saveScore } = useGameContext();

    // --- GŁÓWNA LOGIKA RUCHU ---
    const moveSnake = useCallback(() => {
        if (isGameOver) return;

        if (Date.now() - lastFruitSpawn.current > FRUIT_TIMEOUT) {
            setFruit(spawnFruit());
        }

        setSnake(prevSnake => {
            const head = prevSnake[0];
            const newHead = { ...head };

            if (direction === "up") newHead.y -= 1;
            if (direction === "down") newHead.y += 1;
            if (direction === "left") newHead.x -= 1;
            if (direction === "right") newHead.x += 1;

            // Kolizje ze ścianami
            if (newHead.x < 0 || newHead.x >= MAP_SIZE || newHead.y < 0 || newHead.y >= MAP_SIZE) {
                setIsGameOver(true);
                return prevSnake;
            }

            // Kolizje z samym sobą
            if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
                setIsGameOver(true);
                return prevSnake;
            }

            const newSnake = [newHead, ...prevSnake];

            // Jedzenie owocu
            if (newHead.x === fruit.x && newHead.y === fruit.y) {
                setFruit(spawnFruit());
            } else {
                newSnake.pop();
            }

            return newSnake;
        });
    }, [direction, fruit, isGameOver, MAP_SIZE, spawnFruit, FRUIT_TIMEOUT]);

    // Silnik gry
    useEffect(() => {
        const interval = setInterval(moveSnake, 100 / settings.speed); 
        return () => clearInterval(interval);
    }, [moveSnake]);

    // Skułeś się
    useEffect(() => {
        if (isGameOver) {
            Alert.alert("Koniec!", `Twój wynik: ${snake.length - START_LENGTH}`, [
                { text: "Menu", onPress: () => router.back() }
            ]);
        }
    }, [isGameOver]);

    // Obsługa strzałek klawiatury (tylko dla wersji Web)
    useEffect(() => {
        // Jeśli to nie jest przeglądarka, całkowicie ignorujemy ten kod
        if (Platform.OS !== 'web') return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowUp":
                    setDirection(prev => prev !== "down" ? "up" : prev);
                    break;
                case "ArrowDown":
                    setDirection(prev => prev !== "up" ? "down" : prev);
                    break;
                case "ArrowLeft":
                    setDirection(prev => prev !== "right" ? "left" : prev);
                    break;
                case "ArrowRight":
                    setDirection(prev => prev !== "left" ? "right" : prev);
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <View style={localStyles.container}>
            <View style={{ position: 'absolute', top: 40, left: 20 }}>
                <Text style={{ color: 'white', fontSize: 18 }}>Wynik: {snake.length - START_LENGTH}</Text>
            </View>
            {/* PLANSZA */}
            <View style={[localStyles.board, { width: width - 40, height: width - 40 }]}>
                {Array.from({ length: MAP_SIZE }).map((_, rowIndex) => (
                    <View key={rowIndex} style={localStyles.row}>
                        {Array.from({ length: MAP_SIZE }).map((_, cellIndex) => {
                            const isSnake = snake.some(s => s.x === cellIndex && s.y === rowIndex);
                            const isHead = snake[0].x === cellIndex && snake[0].y === rowIndex;
                            const isFruit = fruit.x === cellIndex && fruit.y === rowIndex;

                            return (
                                <View
                                    key={cellIndex}
                                    style={[
                                        localStyles.cell,
                                        { width: CELL_SIZE, height: CELL_SIZE },
                                        isSnake && localStyles.snakeCell,
                                        isHead && localStyles.snakeHead,
                                        isFruit && localStyles.fruitCell
                                    ]}
                                />
                            );
                        })}
                    </View>
                ))}
            </View>

            {/* STEROWANIE */}
            <View style={localStyles.controls}>
                <View style={localStyles.controlRow}>
                    <Pressable style={localStyles.btn} onPress={() => direction !== "down" && setDirection("up")}>
                        <Text style={localStyles.btnText}>UP</Text>
                    </Pressable>
                </View>
                <View style={localStyles.controlRow}>
                    <Pressable style={localStyles.btn} onPress={() => direction !== "right" && setDirection("left")}>
                        <Text style={localStyles.btnText}>LEFT</Text>
                    </Pressable>
                    <Pressable style={localStyles.btn} onPress={() => direction !== "up" && setDirection("down")}>
                        <Text style={localStyles.btnText}>DOWN</Text>
                    </Pressable>
                    <Pressable style={localStyles.btn} onPress={() => direction !== "left" && setDirection("right")}>
                        <Text style={localStyles.btnText}>RIGHT</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const localStyles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1a1a1a' },
    board: { backgroundColor: '#222', borderWidth: 1, borderColor: '#444' },
    row: { flexDirection: 'row' },
    cell: { borderWidth: 0.1, borderColor: '#333' },
    snakeCell: { backgroundColor: '#4CAF50', borderRadius: 2 },
    snakeHead: { backgroundColor: '#8BC34A', borderWidth: 1 },
    fruitCell: { backgroundColor: '#FF5252', borderRadius: 10 },
    controls: { marginTop: 40 },
    controlRow: { flexDirection: 'row', justifyContent: 'center' },
    btn: { width: 70, height: 70, backgroundColor: '#333', margin: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 15, borderWidth: 1, borderColor: '#555' },
    btnText: { color: 'white', fontWeight: 'bold' }
});