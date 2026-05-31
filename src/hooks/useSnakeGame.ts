import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Platform, useWindowDimensions } from "react-native";
import { useGameContext } from "../app/context/GameContext";

export function useSnakeGame() {
    const { width, height } = useWindowDimensions();
    const { settings, saveScore } = useGameContext();

    const MAP_SIZE = settings.mapSize;
    const START_LENGTH = settings.snakeStartLength;
    const FRUIT_TIMEOUT = settings.fruitAvailabilityTime;

    const BOARD_SIZE = Platform.OS === "web"
        ? Math.min(width - 40, height - 260, 480)
        : Math.min(width - 40, height * 0.55);
    const CELL_SIZE = BOARD_SIZE / MAP_SIZE;

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
    const [superFruit, setSuperFruit] = useState<{ x: number, y: number } | null>(null);
    const [score, setScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [superFruitTimeLeft, setSuperFruitTimeLeft] = useState<number | null>(null);

    const directionRef = useRef(direction);
    const lastExecutedDirection = useRef(direction);
    const snakeRef = useRef(snake);
    const fruitRef = useRef(fruit);
    const superFruitRef = useRef(superFruit);
    const scoreRef = useRef(score);
    const isGameOverRef = useRef(isGameOver);

    // Czasy owocków
    const lastFruitSpawn = useRef(Date.now());
    const superFruitSpawnTime = useRef(Date.now());
    const superFruitTimeoutVal = 35 * (1000 / settings.speed);
    const normalFruitsEaten = useRef(0);

    useEffect(() => { directionRef.current = direction; }, [direction]);
    useEffect(() => { snakeRef.current = snake; }, [snake]);
    useEffect(() => { fruitRef.current = fruit; }, [fruit]);
    useEffect(() => { superFruitRef.current = superFruit; }, [superFruit]);
    useEffect(() => { scoreRef.current = score; }, [score]);
    useEffect(() => { isGameOverRef.current = isGameOver; }, [isGameOver]);

    // Timer na superowocek
    useEffect(() => {
        if (!superFruit) {
            setSuperFruitTimeLeft(null);
            return;
        }

        const updateTimer = () => {
            const elapsed = Date.now() - superFruitSpawnTime.current;
            const remaining = superFruitTimeoutVal - elapsed;
            if (remaining <= 0) {
                setSuperFruitTimeLeft(null);
            } else {
                setSuperFruitTimeLeft(remaining);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 50);

        return () => clearInterval(interval);
    }, [superFruit, superFruitTimeoutVal]);

    // Generowanie owocka w wolnym miejscu
    const spawnFruit = useCallback(() => {
        let newFruit: { x: number, y: number };
        while (true) {
            newFruit = {
                x: Math.floor(Math.random() * MAP_SIZE),
                y: Math.floor(Math.random() * MAP_SIZE)
            };
            const inSnake = snakeRef.current.some(s => s.x === newFruit.x && s.y === newFruit.y);
            if (!inSnake) break;
        }
        lastFruitSpawn.current = Date.now();
        return newFruit;
    }, [MAP_SIZE]);

    // Generowanie super owocka w wolnym miejscu
    const spawnSuperFruit = useCallback(() => {
        let newFruit: { x: number, y: number };
        while (true) {
            newFruit = {
                x: Math.floor(Math.random() * MAP_SIZE),
                y: Math.floor(Math.random() * MAP_SIZE)
            };
            const inSnake = snakeRef.current.some(s => s.x === newFruit.x && s.y === newFruit.y);
            const isNormalFruit = fruitRef.current.x === newFruit.x && fruitRef.current.y === newFruit.y;
            if (!inSnake && !isNormalFruit) break;
        }
        return newFruit;
    }, [MAP_SIZE]);

    // Inicjalizacja pierwszego owocka
    useEffect(() => {
        setFruit(spawnFruit());
    }, []);

    const changeDirection = useCallback((newDir: string) => {
        const opposites: Record<string, string> = {
            up: "down",
            down: "up",
            left: "right",
            right: "left"
        };
        if (opposites[newDir] !== lastExecutedDirection.current) {
            setDirection(newDir);
        }
    }, []);

    // Obsługa klawiatury na kompie
    useEffect(() => {
        if (Platform.OS !== "web") return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowUp":
                case "w":
                case "W":
                    changeDirection("up");
                    break;
                case "ArrowDown":
                case "s":
                case "S":
                    changeDirection("down");
                    break;
                case "ArrowLeft":
                case "a":
                case "A":
                    changeDirection("left");
                    break;
                case "ArrowRight":
                case "d":
                case "D":
                    changeDirection("right");
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [changeDirection]);

    // --- GŁÓWNA LOGIKA RUCHU ---
    const moveSnake = useCallback(() => {
        if (isGameOverRef.current) return;

        if (superFruitRef.current && Date.now() - superFruitSpawnTime.current > superFruitTimeoutVal) {
            setSuperFruit(null);
            superFruitRef.current = null;
        }

        if (Date.now() - lastFruitSpawn.current > FRUIT_TIMEOUT) {
            const nextFruit = spawnFruit();
            setFruit(nextFruit);
            fruitRef.current = nextFruit;
        }

        const prevSnake = snakeRef.current;
        const head = prevSnake[0];
        const newHead = { ...head };
        const currentDir = directionRef.current;

        lastExecutedDirection.current = currentDir;

        if (currentDir === "up") newHead.y -= 1;
        if (currentDir === "down") newHead.y += 1;
        if (currentDir === "left") newHead.x -= 1;
        if (currentDir === "right") newHead.x += 1;

        if (newHead.x < 0 || newHead.x >= MAP_SIZE || newHead.y < 0 || newHead.y >= MAP_SIZE) {
            setIsGameOver(true);
            isGameOverRef.current = true;
            return;
        }

        const currentFruit = fruitRef.current;
        const currentSuperFruit = superFruitRef.current;
        const eatsNormal = newHead.x === currentFruit.x && newHead.y === currentFruit.y;
        const eatsSuper = currentSuperFruit && newHead.x === currentSuperFruit.x && newHead.y === currentSuperFruit.y;

        const collisionSegments = (eatsNormal || eatsSuper) ? prevSnake : prevSnake.slice(0, -1);
        if (collisionSegments.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
            setIsGameOver(true);
            isGameOverRef.current = true;
            return;
        }

        setSnake(prev => {
            const newSnake = [newHead, ...prev];
            if (!eatsNormal && !eatsSuper) {
                newSnake.pop();
            }
            return newSnake;
        });

        if (eatsNormal) {
            setScore(s => s + 1);
            const nextFruit = spawnFruit();
            setFruit(nextFruit);
            fruitRef.current = nextFruit;

            normalFruitsEaten.current += 1;
            if (!superFruitRef.current && normalFruitsEaten.current % 5 === 0) {
                const nextSuperFruit = spawnSuperFruit();
                setSuperFruit(nextSuperFruit);
                superFruitRef.current = nextSuperFruit;
                superFruitSpawnTime.current = Date.now();
            }
        } else if (eatsSuper) {
            setScore(s => s + 5);
            setSuperFruit(null);
            superFruitRef.current = null;
        }
    }, [MAP_SIZE, spawnFruit, spawnSuperFruit, FRUIT_TIMEOUT, superFruitTimeoutVal]);

    // Silnik gry
    useEffect(() => {
        const interval = setInterval(moveSnake, 1000 / settings.speed);
        return () => clearInterval(interval);
    }, [moveSnake, settings.speed]);

    // GEJM OWER
    useEffect(() => {
        if (isGameOver) {
            saveScore(score);
            if (Platform.OS === "web") {
                window.alert(`Koniec! Twój wynik: ${score}`);
                router.back();
            } else {
                Alert.alert("Koniec!", `Twój wynik: ${score}`, [
                    { text: "Menu", onPress: () => router.back() }
                ]);
            }
        }
    }, [isGameOver, score]);

    return {
        snake,
        fruit,
        superFruit,
        score,
        isGameOver,
        superFruitTimeLeft,
        changeDirection,
        BOARD_SIZE,
        CELL_SIZE,
        MAP_SIZE
    };
}
