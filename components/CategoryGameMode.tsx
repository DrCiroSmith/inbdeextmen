import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StudyData, MultipleChoice, TrueFalse, FillInTheBlank } from '../types';

// Game question interface that adapts from StudyData content
interface GameQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
    type: 'mcq' | 'trueFalse' | 'fillBlank';
    explanation: string;
}

// Game statistics
interface GameStats {
    totalScore: number;
    currentStreak: number;
    bestStreak: number;
    correctAnswers: number;
    totalQuestions: number;
    averageTime: number;
}

// Achievement definitions
interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    requirement: (stats: GameStats) => boolean;
}

const ACHIEVEMENTS: Achievement[] = [
    { id: 'first_win', name: 'First Steps', description: 'Answer your first question correctly', icon: '🎯', requirement: (s) => s.correctAnswers >= 1 },
    { id: 'streak_3', name: 'Getting Started!', description: 'Get a 3-answer streak', icon: '🌟', requirement: (s) => s.bestStreak >= 3 },
    { id: 'streak_5', name: 'On Fire!', description: 'Get a 5-answer streak', icon: '🔥', requirement: (s) => s.bestStreak >= 5 },
    { id: 'streak_10', name: 'Unstoppable!', description: 'Get a 10-answer streak', icon: '⚡', requirement: (s) => s.bestStreak >= 10 },
    { id: 'score_50', name: 'Half Century', description: 'Score 50 points in a game', icon: '🥉', requirement: (s) => s.totalScore >= 50 },
    { id: 'score_100', name: 'Century', description: 'Score 100 points in a game', icon: '💯', requirement: (s) => s.totalScore >= 100 },
    { id: 'perfect_5', name: 'Perfect Start', description: 'Complete 5+ questions with 100% accuracy', icon: '✨', requirement: (s) => s.totalQuestions >= 5 && s.correctAnswers === s.totalQuestions },
    { id: 'speed_demon', name: 'Speed Demon', description: 'Average under 5 seconds per answer (3+ questions)', icon: '⚡', requirement: (s) => s.averageTime > 0 && s.averageTime < 5 && s.totalQuestions >= 3 },
];

interface CategoryGameModeProps {
    data: StudyData;
    onExit: () => void;
    darkMode?: boolean;
}

type GameMode = 'menu' | 'speed-quiz' | 'streak-challenge' | 'results';

// Shuffle array helper
const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// Convert StudyData to GameQuestions
const convertToGameQuestions = (data: StudyData): GameQuestion[] => {
    const questions: GameQuestion[] = [];

    // Convert multiple choice questions
    data.multipleChoice?.forEach((mcq: MultipleChoice) => {
        questions.push({
            question: mcq.question,
            options: mcq.options,
            correctAnswer: mcq.correctAnswer,
            type: 'mcq',
            explanation: mcq.explanation
        });
    });

    // Convert true/false to MCQ format
    data.trueFalse?.forEach((tf: TrueFalse) => {
        questions.push({
            question: tf.statement,
            options: ['True', 'False'],
            correctAnswer: tf.isTrue ? 'True' : 'False',
            type: 'trueFalse',
            explanation: tf.explanation
        });
    });

    // Convert fill-in-the-blank to MCQ format (generate wrong options)
    data.fillInTheBlank?.forEach((fib: FillInTheBlank) => {
        // For fill-in-the-blank, we'll show it as a direct input question
        // But for game mode, let's show the correct answer among 3 distractors
        const correctAnswer = fib.answer;
        // Generate plausible wrong answers based on the question context
        const wrongAnswers = generateDistractors(correctAnswer, data);
        questions.push({
            question: fib.question,
            options: shuffleArray([correctAnswer, ...wrongAnswers.slice(0, 3)]),
            correctAnswer: correctAnswer,
            type: 'fillBlank',
            explanation: fib.explanation
        });
    });

    return shuffleArray(questions);
};

// Generate distractor answers based on content
const generateDistractors = (correctAnswer: string, data: StudyData): string[] => {
    const allAnswers: string[] = [];
    
    // Collect answers from other fill-in-the-blank questions
    data.fillInTheBlank?.forEach(fib => {
        if (fib.answer !== correctAnswer) {
            allAnswers.push(fib.answer);
        }
    });

    // Collect correct answers from MCQs
    data.multipleChoice?.forEach(mcq => {
        if (mcq.correctAnswer !== correctAnswer) {
            allAnswers.push(mcq.correctAnswer);
        }
        // Also add other options as potential distractors
        mcq.options.forEach(opt => {
            if (opt !== correctAnswer && opt !== mcq.correctAnswer) {
                allAnswers.push(opt);
            }
        });
    });

    // Shuffle and return unique distractors
    const uniqueAnswers = [...new Set(allAnswers)];
    return shuffleArray(uniqueAnswers);
};

export const CategoryGameMode: React.FC<CategoryGameModeProps> = ({ data, onExit, darkMode = false }) => {
    const [gameMode, setGameMode] = useState<GameMode>('menu');
    const [lastPlayedMode, setLastPlayedMode] = useState<GameMode>('speed-quiz');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState<GameQuestion[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [totalAnswered, setTotalAnswered] = useState(0);
    const [questionStartTime, setQuestionStartTime] = useState<number>(0);
    const [totalTime, setTotalTime] = useState<number>(0);
    const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
    const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('category_game_achievements');
                return saved ? JSON.parse(saved) : [];
            } catch {
                return [];
            }
        }
        return [];
    });
    const [showExplanation, setShowExplanation] = useState(false);
    const [multiplier, setMultiplier] = useState(1);
    const [comboAnimation, setComboAnimation] = useState(false);
    const [wrongAnimation, setWrongAnimation] = useState(false);

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Get available questions count
    const availableQuestions = convertToGameQuestions(data);
    const totalAvailable = availableQuestions.length;

    // Load best streak from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedBestStreak = localStorage.getItem('category_game_best_streak');
            if (savedBestStreak) setBestStreak(parseInt(savedBestStreak));
        }
    }, []);

    // Save achievements to localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('category_game_achievements', JSON.stringify(unlockedAchievements));
        }
    }, [unlockedAchievements]);

    // Check for new achievements
    const checkAchievements = useCallback((stats: GameStats) => {
        for (const achievement of ACHIEVEMENTS) {
            if (!unlockedAchievements.includes(achievement.id) && achievement.requirement(stats)) {
                setUnlockedAchievements(prev => [...prev, achievement.id]);
                setNewAchievement(achievement);
                setTimeout(() => setNewAchievement(null), 3000);
                break;
            }
        }
    }, [unlockedAchievements]);

    // Start a game mode
    const startGame = (mode: GameMode) => {
        const gameQuestions = convertToGameQuestions(data);

        if (gameQuestions.length === 0) {
            alert('No questions available for this video. Please generate study materials first.');
            return;
        }

        // Different question counts for different modes
        const questionCount = mode === 'speed-quiz' 
            ? Math.min(10, gameQuestions.length) 
            : Math.min(15, gameQuestions.length);
        
        setQuestions(gameQuestions.slice(0, questionCount));
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setScore(0);
        setStreak(0);
        setCorrectAnswers(0);
        setTotalAnswered(0);
        setTotalTime(0);
        setMultiplier(1);
        setShowExplanation(false);

        // Set timer based on game mode
        if (mode === 'speed-quiz') {
            setTimeRemaining(15);
        } else {
            setTimeRemaining(10);
        }

        setQuestionStartTime(Date.now());
        setLastPlayedMode(mode);
        setGameMode(mode);
    };

    // Timer effect
    useEffect(() => {
        if (gameMode !== 'menu' && gameMode !== 'results' && !showResult && timeRemaining > 0) {
            timerRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        handleTimeUp();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [gameMode, showResult, currentQuestionIndex]);

    // Handle time running out
    const handleTimeUp = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        const maxTime = gameMode === 'speed-quiz' ? 15 : 10;
        setTotalTime(prev => prev + maxTime);
        setShowResult(true);
        setStreak(0);
        setMultiplier(1);
        setTotalAnswered(prev => prev + 1);
        setWrongAnimation(true);
        setTimeout(() => setWrongAnimation(false), 500);
    };

    // Handle answer selection
    const handleAnswerSelect = (answer: string) => {
        if (showResult) return;

        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        const answerTime = (Date.now() - questionStartTime) / 1000;
        setTotalTime(prev => prev + answerTime);

        setSelectedAnswer(answer);
        setShowResult(true);
        setTotalAnswered(prev => prev + 1);

        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = answer === currentQuestion.correctAnswer;
        const maxTime = gameMode === 'speed-quiz' ? 15 : 10;

        if (isCorrect) {
            const timeBonus = Math.max(0, Math.floor((timeRemaining / maxTime) * 10));
            const basePoints = 10;
            const earnedPoints = (basePoints + timeBonus) * multiplier;

            setScore(prev => prev + earnedPoints);
            setStreak(prev => {
                const newStreak = prev + 1;
                if (newStreak > bestStreak) {
                    setBestStreak(newStreak);
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('category_game_best_streak', String(newStreak));
                    }
                }
                return newStreak;
            });
            setCorrectAnswers(prev => prev + 1);

            if (streak >= 9) {
                setMultiplier(4);
            } else if (streak >= 6) {
                setMultiplier(3);
            } else if (streak >= 3) {
                setMultiplier(2);
            }

            setComboAnimation(true);
            setTimeout(() => setComboAnimation(false), 500);
        } else {
            setStreak(0);
            setMultiplier(1);
            setWrongAnimation(true);
            setTimeout(() => setWrongAnimation(false), 500);
        }

        // Check achievements
        const basePoints = 10;
        const timeBonus = isCorrect ? Math.max(0, Math.floor((timeRemaining / maxTime) * 10)) : 0;
        const earnedPointsForAchievement = isCorrect ? (basePoints + timeBonus) * multiplier : 0;
        const stats: GameStats = {
            totalScore: score + earnedPointsForAchievement,
            currentStreak: isCorrect ? streak + 1 : 0,
            bestStreak: Math.max(bestStreak, isCorrect ? streak + 1 : bestStreak),
            correctAnswers: correctAnswers + (isCorrect ? 1 : 0),
            totalQuestions: totalAnswered + 1,
            averageTime: (totalTime + answerTime) / (totalAnswered + 1),
        };
        checkAchievements(stats);
    };

    // Move to next question
    const nextQuestion = () => {
        setShowExplanation(false);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowResult(false);

            if (gameMode === 'speed-quiz') {
                setTimeRemaining(15);
            } else {
                setTimeRemaining(10);
            }

            setQuestionStartTime(Date.now());
        } else {
            setGameMode('results');
        }
    };

    // Get timer color based on remaining time
    const getTimerColor = () => {
        if (timeRemaining > 10) return 'text-green-500';
        if (timeRemaining > 5) return 'text-yellow-500';
        return 'text-red-500 animate-pulse';
    };

    // Get timer progress percentage
    const getTimerProgress = () => {
        const maxTime = gameMode === 'speed-quiz' ? 15 : 10;
        return (timeRemaining / maxTime) * 100;
    };

    const currentQuestion = questions[currentQuestionIndex];

    // Menu Screen
    if (gameMode === 'menu') {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-8`}>
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-2 flex items-center justify-center gap-3`}>
                            <span className="text-4xl animate-bounce">🎮</span>
                            Game Mode
                        </h1>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-lg`}>
                            Test your knowledge of <span className="font-semibold text-blue-600">{data.videoTitle}</span>
                        </p>
                        <p className={`${darkMode ? 'text-gray-500' : 'text-gray-500'} text-sm mt-1`}>
                            {totalAvailable} questions available from this video
                        </p>
                    </div>

                    {/* Stats Banner */}
                    <div className={`mb-8 p-4 rounded-xl ${darkMode ? 'bg-gradient-to-r from-purple-900/50 to-blue-900/50' : 'bg-gradient-to-r from-purple-100 to-blue-100'}`}>
                        <div className="flex flex-wrap justify-center gap-6">
                            <div className="text-center">
                                <div className={`text-3xl font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>🔥 {bestStreak}</div>
                                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Best Streak</div>
                            </div>
                            <div className="text-center">
                                <div className={`text-3xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>🏆 {unlockedAchievements.length}/{ACHIEVEMENTS.length}</div>
                                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Achievements</div>
                            </div>
                        </div>
                    </div>

                    {/* Game Mode Selection */}
                    {totalAvailable > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Speed Quiz */}
                            <button
                                onClick={() => startGame('speed-quiz')}
                                className={`p-6 rounded-2xl border-2 text-left transition-all transform hover:scale-105 hover:shadow-xl group ${
                                    darkMode
                                        ? 'border-blue-700 bg-gradient-to-br from-blue-900/50 to-blue-800/30 hover:border-blue-500'
                                        : 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:border-blue-400'
                                }`}
                            >
                                <div className="text-4xl mb-3 group-hover:animate-bounce">⚡</div>
                                <h3 className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>Speed Quiz</h3>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                                    Race against the clock! Answer up to 10 questions as fast as you can.
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <span className={`${darkMode ? 'bg-blue-800' : 'bg-blue-200'} px-2 py-1 rounded`}>15 sec/question</span>
                                    <span className={`${darkMode ? 'bg-blue-800' : 'bg-blue-200'} px-2 py-1 rounded`}>Time bonus</span>
                                </div>
                            </button>

                            {/* Streak Challenge */}
                            <button
                                onClick={() => startGame('streak-challenge')}
                                className={`p-6 rounded-2xl border-2 text-left transition-all transform hover:scale-105 hover:shadow-xl group ${
                                    darkMode
                                        ? 'border-orange-700 bg-gradient-to-br from-orange-900/50 to-red-800/30 hover:border-orange-500'
                                        : 'border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 hover:border-orange-400'
                                }`}
                            >
                                <div className="text-4xl mb-3 group-hover:animate-bounce">🔥</div>
                                <h3 className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>Streak Challenge</h3>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                                    Build your streak! Correct answers multiply your score.
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <span className={`${darkMode ? 'bg-orange-800' : 'bg-orange-200'} px-2 py-1 rounded`}>Multipliers</span>
                                    <span className={`${darkMode ? 'bg-orange-800' : 'bg-orange-200'} px-2 py-1 rounded`}>Up to 15 questions</span>
                                </div>
                            </button>
                        </div>
                    ) : (
                        <div className={`p-6 rounded-xl text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-8`}>
                            <span className="text-4xl mb-3 block">📚</span>
                            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
                                No questions available yet!
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
                                Generate study materials first to play games with this video's content.
                            </p>
                        </div>
                    )}

                    {/* Achievements Section */}
                    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                        <h3 className={`text-lg font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                            <span>🏆</span> Achievements
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {ACHIEVEMENTS.map(achievement => {
                                const isUnlocked = unlockedAchievements.includes(achievement.id);
                                return (
                                    <div
                                        key={achievement.id}
                                        className={`p-3 rounded-lg text-center transition-all ${
                                            isUnlocked
                                                ? darkMode
                                                    ? 'bg-yellow-900/50 border border-yellow-600'
                                                    : 'bg-yellow-100 border border-yellow-300'
                                                : darkMode
                                                    ? 'bg-gray-800 border border-gray-600 opacity-50'
                                                    : 'bg-gray-200 border border-gray-300 opacity-50'
                                        }`}
                                        title={achievement.description}
                                    >
                                        <div className={`text-2xl mb-1 ${!isUnlocked && 'grayscale'}`}>{achievement.icon}</div>
                                        <div className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} truncate`}>
                                            {isUnlocked ? achievement.name : '???'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Back Button */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={onExit}
                            className={`px-6 py-3 ${darkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-800'} font-semibold`}
                        >
                            ← Back to Study Mode
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Results Screen
    if (gameMode === 'results') {
        const percentage = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;
        const avgTime = totalAnswered > 0 ? totalTime / totalAnswered : 0;
        const isPerfect = correctAnswers === totalAnswered && totalAnswered > 0;

        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-8 text-center`}>
                    {/* Celebration Animation */}
                    {isPerfect && (
                        <div className="text-6xl mb-4 animate-bounce">🎉</div>
                    )}

                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>
                        {isPerfect ? 'Perfect Game!' : percentage >= 80 ? 'Great Job!' : percentage >= 60 ? 'Good Effort!' : 'Keep Practicing!'}
                    </h1>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
                        {data.videoTitle}
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className={`p-4 rounded-xl ${darkMode ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                            <div className={`text-3xl font-bold ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>{score}</div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Score</div>
                        </div>
                        <div className={`p-4 rounded-xl ${darkMode ? 'bg-green-900/50' : 'bg-green-100'}`}>
                            <div className={`text-3xl font-bold ${darkMode ? 'text-green-300' : 'text-green-600'}`}>{percentage}%</div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Accuracy</div>
                        </div>
                        <div className={`p-4 rounded-xl ${darkMode ? 'bg-orange-900/50' : 'bg-orange-100'}`}>
                            <div className={`text-3xl font-bold ${darkMode ? 'text-orange-300' : 'text-orange-600'}`}>{bestStreak}🔥</div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Best Streak</div>
                        </div>
                        <div className={`p-4 rounded-xl ${darkMode ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
                            <div className={`text-3xl font-bold ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>{avgTime.toFixed(1)}s</div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Time</div>
                        </div>
                    </div>

                    {/* Results Breakdown */}
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-8`}>
                        <div className="flex justify-center gap-8">
                            <div>
                                <span className="text-green-500 text-2xl font-bold">{correctAnswers}</span>
                                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} ml-1`}>Correct</span>
                            </div>
                            <div>
                                <span className="text-red-500 text-2xl font-bold">{totalAnswered - correctAnswers}</span>
                                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} ml-1`}>Wrong</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={() => startGame(lastPlayedMode)}
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center gap-2"
                        >
                            <span>🔄</span> Play Again
                        </button>
                        <button
                            onClick={() => setGameMode('menu')}
                            className={`px-8 py-3 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded-xl font-bold transition-all`}
                        >
                            Game Menu
                        </button>
                        <button
                            onClick={onExit}
                            className={`px-8 py-3 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'} font-semibold`}
                        >
                            Exit to Study
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Game Screen
    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} relative overflow-hidden`}>
            {/* Achievement Popup */}
            {newAchievement && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
                    <div className={`px-6 py-4 rounded-2xl shadow-2xl ${darkMode ? 'bg-yellow-900 border-2 border-yellow-500' : 'bg-yellow-100 border-2 border-yellow-400'}`}>
                        <div className="flex items-center gap-3">
                            <span className="text-4xl">{newAchievement.icon}</span>
                            <div>
                                <div className={`font-bold ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>Achievement Unlocked!</div>
                                <div className={`text-sm ${darkMode ? 'text-yellow-200' : 'text-yellow-700'}`}>{newAchievement.name}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Combo Animation */}
            {comboAnimation && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
                    <div className="text-6xl font-bold text-green-500 animate-ping">+{10 * multiplier}</div>
                </div>
            )}

            {/* Wrong Animation */}
            {wrongAnimation && (
                <div className={`fixed inset-0 ${darkMode ? 'bg-red-900/20' : 'bg-red-500/10'} z-30 pointer-events-none animate-pulse`}></div>
            )}

            {/* Game Header */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-20`}>
                <div className="max-w-4xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setGameMode('menu')}
                                className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`}
                            >
                                ← Exit
                            </button>
                            <div className={`font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                {gameMode === 'speed-quiz' ? '⚡ Speed Quiz' : '🔥 Streak Challenge'}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Score */}
                            <div className={`px-3 py-1 rounded-full ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                                <span className={`font-bold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>{score} pts</span>
                            </div>

                            {/* Streak & Multiplier */}
                            {streak > 0 && (
                                <div className={`px-3 py-1 rounded-full ${darkMode ? 'bg-orange-900' : 'bg-orange-100'} flex items-center gap-2`}>
                                    <span className={`font-bold ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}>{streak}🔥</span>
                                    {multiplier > 1 && (
                                        <span className={`text-xs font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>x{multiplier}</span>
                                    )}
                                </div>
                            )}

                            {/* Question Counter */}
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {currentQuestionIndex + 1}/{questions.length}
                            </div>
                        </div>
                    </div>

                    {/* Timer Bar */}
                    <div className={`mt-2 h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <div
                            className={`h-full transition-all duration-1000 ${
                                timeRemaining > 10 ? 'bg-green-500' : timeRemaining > 5 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${getTimerProgress()}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Question Area */}
            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6 md:p-8`}>
                    {/* Timer Display */}
                    <div className="flex justify-center mb-6">
                        <div className={`text-5xl font-bold ${getTimerColor()} font-mono`}>
                            {timeRemaining}
                        </div>
                    </div>

                    {/* Question Type Badge */}
                    <div className="flex justify-center mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                            {currentQuestion?.type === 'mcq' ? 'Multiple Choice' : currentQuestion?.type === 'trueFalse' ? 'True/False' : 'Fill in the Blank'}
                        </span>
                    </div>

                    {/* Question */}
                    <h2 className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} text-center mb-8 leading-relaxed`}>
                        {currentQuestion?.question}
                    </h2>

                    {/* Answer Options */}
                    <div className="space-y-3">
                        {currentQuestion?.options.map((option, index) => {
                            const letter = String.fromCharCode(65 + index);
                            const isSelected = selectedAnswer === option;
                            const isCorrect = option === currentQuestion.correctAnswer;
                            const showCorrect = showResult && isCorrect;
                            const showWrong = showResult && isSelected && !isCorrect;

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerSelect(option)}
                                    disabled={showResult}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all transform ${
                                        showCorrect
                                            ? 'border-green-500 bg-green-100 dark:bg-green-900/50 scale-105'
                                            : showWrong
                                                ? 'border-red-500 bg-red-100 dark:bg-red-900/50'
                                                : isSelected
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 scale-102'
                                                    : darkMode
                                                        ? 'border-gray-700 hover:border-gray-600 hover:bg-gray-700'
                                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    } ${!showResult && 'hover:scale-102 active:scale-98'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                            showCorrect
                                                ? 'bg-green-500 text-white'
                                                : showWrong
                                                    ? 'bg-red-500 text-white'
                                                    : isSelected
                                                        ? 'bg-blue-500 text-white'
                                                        : darkMode
                                                            ? 'bg-gray-700 text-gray-400'
                                                            : 'bg-gray-200 text-gray-600'
                                        }`}>
                                            {showCorrect ? '✓' : showWrong ? '✗' : letter}
                                        </span>
                                        <span className={`flex-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{option}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Result Feedback */}
                    {showResult && (
                        <div className="mt-6 space-y-4">
                            {/* Explanation Toggle */}
                            <button
                                onClick={() => setShowExplanation(!showExplanation)}
                                className={`w-full py-2 text-sm font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                            >
                                {showExplanation ? '▲ Hide Explanation' : '▼ Show Explanation'}
                            </button>

                            {showExplanation && (
                                <div className={`p-4 rounded-xl ${darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'} border`}>
                                    <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                                        <span className="font-bold">📖 Explanation:</span> {currentQuestion?.explanation}
                                    </p>
                                </div>
                            )}

                            {/* Next Button */}
                            <button
                                onClick={nextQuestion}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-102 flex items-center justify-center gap-2"
                            >
                                {currentQuestionIndex < questions.length - 1 ? (
                                    <>Next Question <span>→</span></>
                                ) : (
                                    <>See Results <span>🏆</span></>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Animations */}
            <style>{`
                .scale-102 {
                    transform: scale(1.02);
                }
                .scale-98 {
                    transform: scale(0.98);
                }
            `}</style>
        </div>
    );
};
