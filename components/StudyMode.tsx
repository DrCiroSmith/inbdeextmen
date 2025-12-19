import React, { useState } from 'react';
import { StudyData, VideoModule, Flashcard, MultipleChoice } from '../types';

interface StudyModeProps {
    data: StudyData;
    onExit: () => void;
}

type Mode = 'flashcards' | 'quiz';

export const StudyMode: React.FC<StudyModeProps> = ({ data, onExit }) => {
    const [mode, setMode] = useState<Mode>('flashcards');
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
    const [showResults, setShowResults] = useState(false);

    const currentModule = data.modules[currentModuleIndex];
    const allFlashcards = data.modules.flatMap(m => m.flashcards);
    const allQuizzes = data.modules.flatMap(m => m.multipleChoice);

    // Flashcard Logic
    const handleNextCard = () => {
        setIsFlipped(false);
        setCurrentCardIndex((prev) => (prev + 1) % allFlashcards.length);
    };

    const handlePrevCard = () => {
        setIsFlipped(false);
        setCurrentCardIndex((prev) => (prev - 1 + allFlashcards.length) % allFlashcards.length);
    };

    // Quiz Logic
    const handleAnswerSelect = (questionIndex: number, option: string) => {
        if (showResults) return;
        setQuizAnswers(prev => ({ ...prev, [questionIndex]: option }));
    };

    const calculateScore = () => {
        let correct = 0;
        allQuizzes.forEach((q, i) => {
            if (quizAnswers[i] === q.correctAnswer) correct++;
        });
        return correct;
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{data.playlistTitle}</h2>
                    <p className="text-gray-500">Study Mode</p>
                </div>
                <button
                    onClick={onExit}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                    Exit Study Mode
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-gray-200">
                <button
                    onClick={() => setMode('flashcards')}
                    className={`pb-4 px-4 font-medium transition-colors ${mode === 'flashcards'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Flashcards ({allFlashcards.length})
                </button>
                <button
                    onClick={() => setMode('quiz')}
                    className={`pb-4 px-4 font-medium transition-colors ${mode === 'quiz'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Quiz ({allQuizzes.length})
                </button>
            </div>

            {/* Flashcard View */}
            {mode === 'flashcards' && (
                <div className="flex flex-col items-center">
                    <div
                        onClick={() => setIsFlipped(!isFlipped)}
                        className="w-full max-w-2xl h-96 perspective-1000 cursor-pointer group"
                    >
                        <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                            {/* Front */}
                            <div className="absolute inset-0 w-full h-full bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center backface-hidden border-2 border-transparent group-hover:border-blue-100 transition-colors">
                                <span className="text-sm text-gray-400 uppercase tracking-wider mb-4">Front</span>
                                <p className="text-2xl text-center font-medium text-gray-800">
                                    {allFlashcards[currentCardIndex]?.front}
                                </p>
                                <p className="absolute bottom-6 text-sm text-gray-400">Click to flip</p>
                            </div>

                            {/* Back */}
                            <div className="absolute inset-0 w-full h-full bg-blue-50 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center backface-hidden rotate-y-180 border-2 border-blue-100">
                                <span className="text-sm text-blue-400 uppercase tracking-wider mb-4">Back</span>
                                <p className="text-xl text-center text-gray-800 leading-relaxed">
                                    {allFlashcards[currentCardIndex]?.back}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 mt-8">
                        <button
                            onClick={handlePrevCard}
                            className="p-3 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                            ← Previous
                        </button>
                        <span className="text-gray-500 font-medium">
                            {currentCardIndex + 1} / {allFlashcards.length}
                        </span>
                        <button
                            onClick={handleNextCard}
                            className="p-3 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                            Next →
                        </button>
                    </div>
                </div>
            )}

            {/* Quiz View */}
            {mode === 'quiz' && (
                <div className="max-w-3xl mx-auto">
                    {!showResults ? (
                        <div className="space-y-8">
                            {allQuizzes.map((quiz, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-start gap-4">
                                        <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </span>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">{quiz.question}</h3>
                                            <div className="space-y-3">
                                                {quiz.options.map((option, optIndex) => (
                                                    <button
                                                        key={optIndex}
                                                        onClick={() => handleAnswerSelect(index, option)}
                                                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${quizAnswers[index] === option
                                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                                : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="sticky bottom-6 flex justify-center pt-4">
                                <button
                                    onClick={() => setShowResults(true)}
                                    disabled={Object.keys(quizAnswers).length < allQuizzes.length}
                                    className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                                >
                                    Submit Quiz
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="bg-white rounded-2xl shadow-lg p-8 text-center mb-8">
                                <h3 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h3>
                                <p className="text-xl text-gray-600">
                                    You scored <span className="text-blue-600 font-bold">{calculateScore()}</span> out of {allQuizzes.length}
                                </p>
                                <button
                                    onClick={() => {
                                        setShowResults(false);
                                        setQuizAnswers({});
                                    }}
                                    className="mt-6 text-blue-600 font-medium hover:underline"
                                >
                                    Retake Quiz
                                </button>
                            </div>

                            {allQuizzes.map((quiz, index) => (
                                <div key={index} className={`rounded-xl border p-6 ${quizAnswers[index] === quiz.correctAnswer
                                        ? 'bg-green-50 border-green-200'
                                        : 'bg-red-50 border-red-200'
                                    }`}>
                                    <div className="flex gap-3 mb-4">
                                        <span className="font-bold text-gray-700">{index + 1}.</span>
                                        <h4 className="font-medium text-gray-900">{quiz.question}</h4>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className="p-3 bg-white rounded border border-gray-200">
                                            <span className="text-xs text-gray-500 uppercase">Your Answer</span>
                                            <p className={`font-medium ${quizAnswers[index] === quiz.correctAnswer ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {quizAnswers[index]}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-white rounded border border-gray-200">
                                            <span className="text-xs text-gray-500 uppercase">Correct Answer</span>
                                            <p className="font-medium text-green-600">{quiz.correctAnswer}</p>
                                        </div>
                                    </div>

                                    <div className="text-sm text-gray-600 bg-white/50 p-4 rounded-lg">
                                        <span className="font-bold">Explanation:</span> {quiz.explanation}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
