import React, { useEffect, useState } from 'react';
import { StudyData } from '../types';

interface StudyModeProps {
    data: StudyData;
    onExit: () => void;
    onAddMore: () => void;
}

// Extend study modes to support new question types introduced in version 2.0.0
type Mode = 'flashcards' | 'quiz' | 'fillInTheBlank' | 'matching' | 'clinical';

export const StudyMode: React.FC<StudyModeProps> = ({ data, onExit, onAddMore }) => {
    const [mode, setMode] = useState<Mode>('flashcards');
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
    const [showResults, setShowResults] = useState(false);
    const [revealedFill, setRevealedFill] = useState<Record<number, boolean>>({});
    const [revealedClinical, setRevealedClinical] = useState<Record<number, boolean>>({});
    const [matchingSelections, setMatchingSelections] = useState<Record<string, string>>({});
    const [matchingChecked, setMatchingChecked] = useState<Record<number, boolean>>({});
    const [matchingOptions, setMatchingOptions] = useState<Record<number, string[]>>({});
    const [activeMatchingChoice, setActiveMatchingChoice] = useState<Record<number, string | null>>({});

    useEffect(() => {
        if (!data.matching) return;
        const options: Record<number, string[]> = {};
        data.matching.forEach((exercise, index) => {
            const rights = exercise.pairs.map(pair => pair.right);
            for (let i = rights.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [rights[i], rights[j]] = [rights[j], rights[i]];
            }
            options[index] = rights;
        });
        setMatchingOptions(options);
        setMatchingSelections({});
        setMatchingChecked({});
        setActiveMatchingChoice({});
    }, [data.matching]);

    const handleMatchAssign = (exerciseIndex: number, leftIndex: number, rightValue: string) => {
        if (!rightValue) return;
        setMatchingSelections(prev => ({
            ...prev,
            [`${exerciseIndex}-${leftIndex}`]: rightValue
        }));
        setActiveMatchingChoice(prev => ({
            ...prev,
            [exerciseIndex]: null
        }));
    };

    const handleMatchClear = (exerciseIndex: number, leftIndex: number) => {
        setMatchingSelections(prev => {
            const next = { ...prev };
            delete next[`${exerciseIndex}-${leftIndex}`];
            return next;
        });
    };

    const handleMatchReset = (exerciseIndex: number) => {
        setMatchingSelections(prev => {
            const next = { ...prev };
            Object.keys(next).forEach(key => {
                if (key.startsWith(`${exerciseIndex}-`)) {
                    delete next[key];
                }
            });
            return next;
        });
        setMatchingChecked(prev => ({ ...prev, [exerciseIndex]: false }));
        setActiveMatchingChoice(prev => ({ ...prev, [exerciseIndex]: null }));
    };

    // Flashcard Logic
    const handleNextCard = () => {
        setIsFlipped(false);
        setCurrentCardIndex((prev) => (prev + 1) % data.flashcards.length);
    };

    const handlePrevCard = () => {
        setIsFlipped(false);
        setCurrentCardIndex((prev) => (prev - 1 + data.flashcards.length) % data.flashcards.length);
    };

    // Quiz Logic
    const handleAnswerSelect = (questionIndex: number, option: string) => {
        if (showResults) return;
        setQuizAnswers(prev => ({ ...prev, [questionIndex]: option }));
    };

    const calculateScore = () => {
        let correct = 0;
        data.multipleChoice.forEach((q, i) => {
            if (quizAnswers[i] === q.correctAnswer) correct++;
        });
        return correct;
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{data.videoTitle}</h2>
                    <p className="text-gray-500 text-sm">{data.playlistTitle}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onAddMore}
                        className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Add More Study Items
                    </button>
                    <button
                        onClick={onExit}
                        className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                    >
                        Exit Study Mode
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-4 mb-8 border-b border-gray-200" role="tablist">
                <button
                    onClick={() => setMode('flashcards')}
                    role="tab"
                    aria-selected={mode === 'flashcards'}
                    className={`pb-4 px-4 font-medium transition-colors ${mode === 'flashcards'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Flashcards ({data.flashcards.length})
                </button>
                <button
                    onClick={() => setMode('quiz')}
                    role="tab"
                    aria-selected={mode === 'quiz'}
                    className={`pb-4 px-4 font-medium transition-colors ${mode === 'quiz'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Quiz ({data.multipleChoice.length})
                </button>
                <button
                    onClick={() => setMode('fillInTheBlank')}
                    role="tab"
                    aria-selected={mode === 'fillInTheBlank'}
                    className={`pb-4 px-4 font-medium transition-colors ${mode === 'fillInTheBlank'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Fill-in-the-Blank ({data.fillInTheBlank?.length || 0})
                </button>
                <button
                    onClick={() => setMode('matching')}
                    role="tab"
                    aria-selected={mode === 'matching'}
                    className={`pb-4 px-4 font-medium transition-colors ${mode === 'matching'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Matching ({data.matching?.length || 0})
                </button>
                <button
                    onClick={() => setMode('clinical')}
                    role="tab"
                    aria-selected={mode === 'clinical'}
                    className={`pb-4 px-4 font-medium transition-colors ${mode === 'clinical'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Clinical ({data.clinical?.length || 0})
                </button>
            </div>

            {/* Flashcard View */}
            {mode === 'flashcards' && (
                <div className="flex flex-col items-center">
                    <div
                        onClick={() => setIsFlipped(!isFlipped)}
                        className="w-full max-w-2xl h-96 cursor-pointer group"
                        style={{ perspective: '1000px' }}
                    >
                        <div
                            className="relative w-full h-full transition-all duration-500"
                            style={{
                                transformStyle: 'preserve-3d',
                                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                            }}
                        >
                            {/* Front */}
                            <div
                                className="absolute inset-0 w-full h-full bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center border-2 border-transparent group-hover:border-blue-100 transition-colors"
                                style={{ backfaceVisibility: 'hidden' }}
                            >
                                <span className="text-sm text-gray-400 uppercase tracking-wider mb-4">Question</span>
                                <p className="text-2xl text-center font-medium text-gray-800">
                                    {data.flashcards[currentCardIndex]?.front}
                                </p>
                                <p className="absolute bottom-6 text-sm text-gray-400">Click to flip</p>
                            </div>

                            {/* Back */}
                            <div
                                className="absolute inset-0 w-full h-full bg-blue-50 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center border-2 border-blue-100"
                                style={{
                                    backfaceVisibility: 'hidden',
                                    transform: 'rotateY(180deg)'
                                }}
                            >
                                <span className="text-sm text-blue-400 uppercase tracking-wider mb-4">Answer</span>
                                <p className="text-xl text-center text-gray-800 leading-relaxed">
                                    {data.flashcards[currentCardIndex]?.back}
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
                            {currentCardIndex + 1} / {data.flashcards.length}
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
                            {data.multipleChoice.map((quiz, index) => (
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
                                    disabled={Object.keys(quizAnswers).length < data.multipleChoice.length}
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
                                    You scored <span className="text-blue-600 font-bold">{calculateScore()}</span> out of {data.multipleChoice.length}
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

                            {data.multipleChoice.map((quiz, index) => (
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

            {/* Fill-in-the-Blank View */}
            {mode === 'fillInTheBlank' && (
                <div className="max-w-3xl mx-auto space-y-8">
                    {data.fillInTheBlank?.map((item, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="mb-4">
                                <span className="font-bold text-gray-700">{index + 1}.</span>{' '}
                                <span className="text-gray-900 font-medium">{item.question}</span>
                            </div>
                            <button
                                onClick={() => setRevealedFill(prev => ({ ...prev, [index]: !prev[index] }))}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                {revealedFill[index] ? 'Hide Answer' : 'Reveal Answer'}
                            </button>
                            {revealedFill[index] && (
                                <div className="mt-4 space-y-2 text-gray-700">
                                    <p><span className="font-bold">Answer:</span> {item.answer}</p>
                                    <p><span className="font-bold">Explanation:</span> {item.explanation}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Matching View */}
            {mode === 'matching' && (
                <div className="max-w-3xl mx-auto space-y-8">
                    {data.matching?.map((exercise, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="mb-4">
                                <span className="font-bold text-gray-700">{index + 1}.</span>{' '}
                                <span className="text-gray-900 font-medium">{exercise.prompt}</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">
                                Drag the matching options onto the left column, or click an option then click a target.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    {exercise.pairs.map((pair, leftIndex) => {
                                        const selectionKey = `${index}-${leftIndex}`;
                                        const selectedRight = matchingSelections[selectionKey];
                                        const isChecked = matchingChecked[index];
                                        const isCorrect = selectedRight === pair.right;
                                        return (
                                            <div key={selectionKey} className="p-3 bg-gray-50 rounded border border-gray-200">
                                                <div className="flex items-center justify-between gap-3">
                                                    <span className="font-medium text-gray-800">{pair.left}</span>
                                                    {isChecked && (
                                                        <span className={`text-sm font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                                            {isCorrect ? '✓ Correct' : '✕ Try again'}
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onDragOver={(event) => event.preventDefault()}
                                                    onDrop={(event) => {
                                                        event.preventDefault();
                                                        const rightValue = event.dataTransfer.getData('text/plain');
                                                        handleMatchAssign(index, leftIndex, rightValue);
                                                    }}
                                                    onClick={() => {
                                                        const activeChoice = activeMatchingChoice[index];
                                                        if (activeChoice) {
                                                            handleMatchAssign(index, leftIndex, activeChoice);
                                                        }
                                                    }}
                                                    className={`mt-3 w-full flex items-center justify-between gap-3 rounded-lg border-2 px-3 py-2 transition-colors ${selectedRight
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                        : 'border-dashed border-gray-300 text-gray-400 hover:border-blue-300 hover:text-blue-500'
                                                        }`}
                                                >
                                                    <span>
                                                        {selectedRight || 'Drop answer here'}
                                                    </span>
                                                    {selectedRight && (
                                                        <span className="text-xs text-blue-600">Assigned</span>
                                                    )}
                                                </button>
                                                {selectedRight && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleMatchClear(index, leftIndex)}
                                                        className="mt-2 text-xs text-gray-500 hover:text-gray-700"
                                                    >
                                                        Clear selection
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="space-y-3">
                                    <div className="text-sm font-semibold text-gray-700">Matching Options</div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {(matchingOptions[index] || [])
                                            .filter(option => {
                                                const assigned = Object.keys(matchingSelections)
                                                    .filter(key => key.startsWith(`${index}-`))
                                                    .map(key => matchingSelections[key]);
                                                return !assigned.includes(option);
                                            })
                                            .map((option, optionIndex) => (
                                                <button
                                                    key={`${option}-${optionIndex}`}
                                                    type="button"
                                                    draggable
                                                    onDragStart={(event) => {
                                                        event.dataTransfer.setData('text/plain', option);
                                                    }}
                                                    onClick={() => setActiveMatchingChoice(prev => ({ ...prev, [index]: option }))}
                                                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${activeMatchingChoice[index] === option
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                                                        }`}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                    </div>
                                    <div className="flex flex-wrap gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setMatchingChecked(prev => ({ ...prev, [index]: true }))}
                                            disabled={exercise.pairs.some((_, leftIndex) => !matchingSelections[`${index}-${leftIndex}`])}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Check Answers
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleMatchReset(index)}
                                            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {matchingChecked[index] && (
                                <p className="mt-4 text-sm text-gray-600"><span className="font-bold">Explanation:</span> {exercise.explanation}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Clinical Scenario View */}
            {mode === 'clinical' && (
                <div className="max-w-3xl mx-auto space-y-8">
                    {data.clinical?.map((item, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="mb-4">
                                <span className="font-bold text-gray-700">{index + 1}.</span>{' '}
                                <span className="text-gray-900 font-medium">{item.scenario}</span>
                            </div>
                            <button
                                onClick={() => setRevealedClinical(prev => ({ ...prev, [index]: !prev[index] }))}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                {revealedClinical[index] ? 'Hide Answer' : 'Reveal Answer'}
                            </button>
                            {revealedClinical[index] && (
                                <div className="mt-4 space-y-2 text-gray-700">
                                    <p><span className="font-bold">Answer:</span> {item.answer}</p>
                                    <p><span className="font-bold">Explanation:</span> {item.explanation}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
