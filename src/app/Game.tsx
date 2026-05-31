import React from "react";
import { StyleSheet, View } from "react-native";
import { useSnakeGame } from "../hooks/useSnakeGame";
import Board from "../components/Game/Board";
import Controls from "../components/Game/Controls";
import ScoreHeader from "../components/Game/ScoreHeader";

export default function Game() {
    const {
        snake,
        fruit,
        superFruit,
        score,
        superFruitTimeLeft,
        changeDirection,
        BOARD_SIZE,
        CELL_SIZE,
        MAP_SIZE
    } = useSnakeGame();

    return (
        <View style={styles.container}>
            <ScoreHeader score={score} superFruitTimeLeft={superFruitTimeLeft} />
            <Board
                snake={snake}
                fruit={fruit}
                superFruit={superFruit}
                boardSize={BOARD_SIZE}
                cellSize={CELL_SIZE}
                mapSize={MAP_SIZE}
            />
            <Controls onDirectionChange={changeDirection} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#131313' }
});