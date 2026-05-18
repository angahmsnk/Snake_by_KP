import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Settings = {
    mapSize: number;
    snakeStartLength: number;
    fruitAvailabilityTime: number;
    nickname: string;
    speed: number;
};

type Score = {
    points: number;
    date: string;
    nickname: string;
};

type GameContextType = {
    settings: Settings;
    updateSettings: (newSettings: Partial<Settings>) => void;
    highScores: Score[];
    saveScore: (points: number) => void;
};

export const GameContext = createContext<GameContextType | null>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
    const [settings, setSettings] = useState<Settings>({
        mapSize: 20,
        snakeStartLength: 4,
        fruitAvailabilityTime: 5000,
        nickname: '',
        speed: 5,
    });
    const [highScores, setHighScores] = useState<Score[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const savedSettings = await AsyncStorage.getItem('@snake_settings');
            const savedScores = await AsyncStorage.getItem('@snake_scores');
            if (savedSettings) setSettings(JSON.parse(savedSettings));
            if (savedScores) setHighScores(JSON.parse(savedScores));
        };
        loadData();
    }, []);

    const updateSettings = async (newSettings: Partial<Settings>) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        await AsyncStorage.setItem('@snake_settings', JSON.stringify(updated));
    };

    const saveScore = async (points: number) => {
        const newScore: Score = { 
            points, 
            date: new Date().toLocaleDateString(),
            nickname: settings.nickname
        };
        
        const updatedScores = [...highScores, newScore]
            .sort((a, b) => b.points - a.points)
            .slice(0, 10);

        setHighScores(updatedScores);
        await AsyncStorage.setItem('@snake_scores', JSON.stringify(updatedScores));
    };

    return (
        <GameContext.Provider value={{ settings, updateSettings, highScores, saveScore }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGameContext = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error('useGameContext must be used within GameProvider');
    return context;
};