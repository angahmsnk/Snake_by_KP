import React from "react";
import { StyleSheet, View } from "react-native";

type BoardProps = {
    snake: { x: number; y: number }[];
    fruit: { x: number; y: number };
    superFruit: { x: number; y: number } | null;
    boardSize: number;
    cellSize: number;
    mapSize: number;
};

export default function Board({ snake, fruit, superFruit, boardSize, cellSize, mapSize }: BoardProps) {
    return (
        <View style={[styles.board, { width: boardSize, height: boardSize }]}>
            {Array.from({ length: mapSize }).map((_, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {Array.from({ length: mapSize }).map((_, cellIndex) => {
                        const isSnake = snake.some(s => s.x === cellIndex && s.y === rowIndex);
                        const isHead = snake.length > 0 && snake[0].x === cellIndex && snake[0].y === rowIndex;
                        const isFruit = fruit.x === cellIndex && fruit.y === rowIndex;
                        const isSuperFruit = superFruit && superFruit.x === cellIndex && superFruit.y === rowIndex;

                        return (
                            <View
                                key={cellIndex}
                                style={[
                                    styles.cell,
                                    { width: cellSize, height: cellSize },
                                    isSnake && styles.snakeCell,
                                    isHead && styles.snakeHead,
                                    isFruit && styles.fruitCell,
                                    isSuperFruit && styles.superFruitCell
                                ]}
                            />
                        );
                    })}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    board: { backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#333' },
    row: { flexDirection: 'row' },
    cell: { borderWidth: 0.1, borderColor: '#222' },
    snakeCell: { backgroundColor: '#7fd581ff', borderRadius: 2 },
    snakeHead: { backgroundColor: '#007016ff', borderWidth: 1 },
    fruitCell: { backgroundColor: '#FF5252', borderRadius: 10 },
    superFruitCell: { backgroundColor: '#FFD700', borderRadius: 10, borderWidth: 1, borderColor: '#FFA500' }
});
