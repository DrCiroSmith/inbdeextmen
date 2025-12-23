import React, { useEffect, useState } from 'react';
import { StudyData } from '../types';

interface StudyModeProps {
    data: StudyData;
    onExit: () => void;
    onUpdateData: (data: StudyData) => void;
}

// Extend study modes to support new question types introduced in version 2.0.0
type Mode = 'flashcards' | 'quiz' | 'fillInTheBlank' | 'matching' | 'clinical';

export const StudyMode: React.FC<StudyModeProps> = ({ data, onExit, onUpdateData }) => {
    const [mode, setMode] = useState<Mode>('flashcards');
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
    const [showResults, setShowResults] = useState(false);
    const [fillAnswers, setFillAnswers] = useState<Record<number, string>>({});
    const [fillChecked, setFillChecked] = useState<Record<number, boolean>>({});
    const [showFillHint, setShowFillHint] = useState<Record<number, boolean>>({});
    const [revealedClinical, setRevealedClinical] = useState<Record<number, boolean>>({});
    const [newFlashcard, setNewFlashcard] = useState({ front: '', back: '' });
    const [newQuiz, setNewQuiz] = useState({ question: '', options: '', correctAnswer: '', explanation: '' });
    const [newFill, setNewFill] = useState({ question: '', answer: '', explanation: '' });
    const [newMatching, setNewMatching] = useState({ prompt: '', left: '', right: '', explanation: '' });
    const [newClinical, setNewClinical] = useState({ scenario: '', answer: '', explanation: '' });
    const [matchingStates, setMatchingStates] = useState(() => (
        data.matching?.map((exercise) => ({
            rightOptions: shuffleArray(exercise.pairs.map((pair) => pair.right)),
            matches: {} as Record<number, number>,
            showResults: false
        })) ?? []
    ));

    // Flashcard Logic
    const handleNextCard = () => {
        if (data.flashcards.length === 0) return;
        setIsFlipped(false);
        setCurrentCardIndex((prev) => (prev + 1) % data.flashcards.length);
    };

    const handlePrevCard = () => {
        if (data.flashcards.length === 0) return;
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

    const handleAddFlashcard = () => {
        if (!newFlashcard.front.trim() || !newFlashcard.back.trim()) return;
        onUpdateData({
            ...data,
            flashcards: [...data.flashcards, { front: newFlashcard.front.trim(), back: newFlashcard.back.trim() }]
        });
        setCurrentCardIndex(data.flashcards.length);
        setIsFlipped(false);
        setNewFlashcard({ front: '', back: '' });
    };

    const handleAddQuiz = () => {
        const options = newQuiz.options
            .split(',')
            .map((option) => option.trim())
            .filter(Boolean);
        if (!newQuiz.question.trim() || options.length < 2 || !newQuiz.correctAnswer.trim() || !newQuiz.explanation.trim()) return;
        onUpdateData({
            ...data,
            multipleChoice: [
                ...data.multipleChoice,
                {
                    question: newQuiz.question.trim(),
                    options,
                    correctAnswer: newQuiz.correctAnswer.trim(),
                    explanation: newQuiz.explanation.trim()
                }
            ]
        });
        setNewQuiz({ question: '', options: '', correctAnswer: '', explanation: '' });
    };

    const handleAddFill = () => {
        if (!newFill.question.trim() || !newFill.answer.trim() || !newFill.explanation.trim()) return;
        onUpdateData({
            ...data,
            fillInTheBlank: [
                ...(data.fillInTheBlank ?? []),
                {
                    question: newFill.question.trim(),
                    answer: newFill.answer.trim(),
                    explanation: newFill.explanation.trim()
                }
            ]
        });
        setNewFill({ question: '', answer: '', explanation: '' });
    };

    const handleAddMatching = () => {
        if (!newMatching.prompt.trim() || !newMatching.left.trim() || !newMatching.right.trim() || !newMatching.explanation.trim()) return;
        const updatedMatching = [
            ...(data.matching ?? []),
            {
                prompt: newMatching.prompt.trim(),
                pairs: [{ left: newMatching.left.trim(), right: newMatching.right.trim() }],
                explanation: newMatching.explanation.trim()
            }
        ];
        onUpdateData({
            ...data,
            matching: updatedMatching
        });
        setMatchingStates((prev) => [
            ...prev,
            {
                rightOptions: shuffleArray([newMatching.right.trim()]),
                matches: {},
                showResults: false
            }
        ]);
        setNewMatching({ prompt: '', left: '', right: '', explanation: '' });
    };

    const handleAddClinical = () => {
        if (!newClinical.scenario.trim() || !newClinical.answer.trim() || !newClinical.explanation.trim()) return;
        onUpdateData({
            ...data,
            clinical: [
                ...(data.clinical ?? []),
                {
                    scenario: newClinical.scenario.trim(),
                    answer: newClinical.answer.trim(),
                    explanation: newClinical.explanation.trim()
                }
            ]
        });
        setNewClinical({ scenario: '', answer: '', explanation: '' });
    };

    // Fill-in-the-blank handlers
    const handleFillAnswerChange = (index: number, value: string) => {
        setFillAnswers(prev => ({ ...prev, [index]: value }));
        // Reset checked state when user types
        if (fillChecked[index]) {
            setFillChecked(prev => ({ ...prev, [index]: false }));
        }
    };

    const handleCheckFillAnswer = (index: number) => {
        setFillChecked(prev => ({ ...prev, [index]: true }));
    };

    const isFillAnswerCorrect = (index: number, correctAnswer: string): boolean => {
        const userAnswer = (fillAnswers[index] || '').toLowerCase().trim();
        const correct = correctAnswer.toLowerCase().trim();
        return userAnswer === correct;
    };

    const handleResetFillQuestion = (index: number) => {
        setFillAnswers(prev => ({ ...prev, [index]: '' }));
        setFillChecked(prev => ({ ...prev, [index]: false }));
        setShowFillHint(prev => ({ ...prev, [index]: false }));
    };

    const handleDropMatch = (exerciseIndex: number, rightIndex: number, leftIndex: number) => {
        setMatchingStates((prev) => prev.map((state, idx) => {
            if (idx !== exerciseIndex) return state;
            const matches = { ...state.matches };
            Object.keys(matches).forEach((key) => {
                if (matches[Number(key)] === leftIndex) {
                    delete matches[Number(key)];
                }
            });
            matches[rightIndex] = leftIndex;
            return { ...state, matches };
        }));
    };

    const resetMatching = (exerciseIndex: number) => {
        setMatchingStates((prev) => prev.map((state, idx) => (
            idx === exerciseIndex ? { ...state, matches: {}, showResults: false } : state
        )));
    };

    useEffect(() => {
        setMatchingStates(
            data.matching?.map((exercise) => ({
                rightOptions: shuffleArray(exercise.pairs.map((pair) => pair.right)),
                matches: {},
                showResults: false
            })) ?? []
        );
    }, [data.matching]);

    const hasFlashcards = data.flashcards.length > 0;
    const hasMatching = (data.matching?.length ?? 0) > 0;

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{data.videoTitle}</h2>
                    <p className="text-gray-500 text-sm">{data.playlistTitle}</p>
                </div>
                <button
                    onClick={onExit}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                    Exit Study Mode
                </button>
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
                    {hasFlashcards ? (
                        <>
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
                        </>
                    ) : (
                        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-dashed border-gray-300 p-10 text-center text-gray-500">
                            No flashcards yet. Add your first card below to start studying.
                        </div>
                    )}

                    <div className="w-full max-w-2xl mt-10 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add a flashcard</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={newFlashcard.front}
                                onChange={(event) => setNewFlashcard((prev) => ({ ...prev, front: event.target.value }))}
                                placeholder="Front (question)"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <textarea
                                value={newFlashcard.back}
                                onChange={(event) => setNewFlashcard((prev) => ({ ...prev, back: event.target.value }))}
                                placeholder="Back (answer)"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                            />
                            <button
                                onClick={handleAddFlashcard}
                                disabled={!newFlashcard.front.trim() || !newFlashcard.back.trim()}
                                className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add Flashcard
                            </button>
                        </div>
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

                    <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add a quiz question</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={newQuiz.question}
                                onChange={(event) => setNewQuiz((prev) => ({ ...prev, question: event.target.value }))}
                                placeholder="Question"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                value={newQuiz.options}
                                onChange={(event) => setNewQuiz((prev) => ({ ...prev, options: event.target.value }))}
                                placeholder="Options (comma separated)"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                value={newQuiz.correctAnswer}
                                onChange={(event) => setNewQuiz((prev) => ({ ...prev, correctAnswer: event.target.value }))}
                                placeholder="Correct answer"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <textarea
                                value={newQuiz.explanation}
                                onChange={(event) => setNewQuiz((prev) => ({ ...prev, explanation: event.target.value }))}
                                placeholder="Explanation"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                            />
                            <button
                                onClick={handleAddQuiz}
                                disabled={
                                    !newQuiz.question.trim() ||
                                    !newQuiz.correctAnswer.trim() ||
                                    !newQuiz.explanation.trim() ||
                                    newQuiz.options.split(',').map((option) => option.trim()).filter(Boolean).length < 2
                                }
                                className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add Quiz Question
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Fill-in-the-Blank View */}
            {mode === 'fillInTheBlank' && (
                <div className="max-w-3xl mx-auto space-y-8">
                    {data.fillInTheBlank?.map((item, index) => {
                        const isChecked = fillChecked[index];
                        const isCorrect = isChecked && isFillAnswerCorrect(index, item.answer);
                        const showHint = showFillHint[index];
                        
                        return (
                            <div key={index} className={`bg-white rounded-xl shadow-sm border-2 p-6 transition-colors ${
                                isChecked 
                                    ? (isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50')
                                    : 'border-gray-200'
                            }`}>
                                <div className="mb-4">
                                    <span className="font-bold text-gray-700">{index + 1}.</span>{' '}
                                    <span className="text-gray-900 font-medium">{item.question}</span>
                                </div>
                                
                                {/* Input field for answer */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                        Your Answer:
                                    </label>
                                    <input
                                        type="text"
                                        value={fillAnswers[index] || ''}
                                        onChange={(e) => handleFillAnswerChange(index, e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && !isChecked && handleCheckFillAnswer(index)}
                                        placeholder="Type your answer here..."
                                        disabled={isChecked && isCorrect}
                                        className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 transition-colors ${
                                            isChecked
                                                ? (isCorrect 
                                                    ? 'border-green-400 bg-green-100 text-green-800' 
                                                    : 'border-red-400 bg-red-100 text-red-800')
                                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                    />
                                </div>

                                {/* Action buttons */}
                                <div className="flex flex-wrap gap-3 mb-4">
                                    {!isChecked ? (
                                        <>
                                            <button
                                                onClick={() => handleCheckFillAnswer(index)}
                                                disabled={!(fillAnswers[index] || '').trim()}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Check Answer
                                            </button>
                                            <button
                                                onClick={() => setShowFillHint(prev => ({ ...prev, [index]: !prev[index] }))}
                                                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                {showHint ? 'Hide Hint' : 'Show Hint'}
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleResetFillQuestion(index)}
                                            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Try Again
                                        </button>
                                    )}
                                </div>

                                {/* Hint */}
                                {showHint && !isChecked && (
                                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <p className="text-sm text-yellow-800">
                                            <span className="font-bold">💡 Hint:</span> The answer has {item.answer?.length || 0} characters
                                            {item.answer && item.answer.length > 0 && ` and starts with "${item.answer[0].toUpperCase()}"`}
                                        </p>
                                    </div>
                                )}

                                {/* Result feedback */}
                                {isChecked && (
                                    <div className="space-y-3">
                                        {isCorrect ? (
                                            <div className="flex items-center gap-2 text-green-700 font-semibold">
                                                <span className="text-xl">✓</span> Correct! Well done!
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-red-700 font-semibold">
                                                    <span className="text-xl">✗</span> Not quite right
                                                </div>
                                                <p className="text-gray-700">
                                                    <span className="font-bold">Correct Answer:</span>{' '}
                                                    <span className="text-green-700 font-semibold">{item.answer}</span>
                                                </p>
                                            </div>
                                        )}
                                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                            <p className="text-gray-700">
                                                <span className="font-bold text-blue-700">📖 Explanation:</span> {item.explanation}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add a fill-in-the-blank</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={newFill.question}
                                onChange={(event) => setNewFill((prev) => ({ ...prev, question: event.target.value }))}
                                placeholder="Prompt or question"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                value={newFill.answer}
                                onChange={(event) => setNewFill((prev) => ({ ...prev, answer: event.target.value }))}
                                placeholder="Answer"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <textarea
                                value={newFill.explanation}
                                onChange={(event) => setNewFill((prev) => ({ ...prev, explanation: event.target.value }))}
                                placeholder="Explanation"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                            />
                            <button
                                onClick={handleAddFill}
                                disabled={!newFill.question.trim() || !newFill.answer.trim() || !newFill.explanation.trim()}
                                className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add Fill-in-the-Blank
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Matching View */}
            {mode === 'matching' && (
                <div className="max-w-3xl mx-auto space-y-8">
                    {hasMatching ? (
                        data.matching?.map((exercise, index) => {
                            const matchingState = matchingStates[index];
                            const rightOptions = matchingState?.rightOptions ?? [];
                            const matches = matchingState?.matches ?? {};
                            return (
                                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <div className="mb-4">
                                        <span className="font-bold text-gray-700">{index + 1}.</span>{' '}
                                        <span className="text-gray-900 font-medium">{exercise.prompt}</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <p className="text-xs uppercase tracking-wide text-gray-400">Drag these terms</p>
                                            {exercise.pairs.map((pair, leftIndex) => (
                                                <div
                                                    key={pair.left}
                                                    draggable
                                                    onDragStart={(event) => {
                                                        event.dataTransfer.setData('text/plain', String(leftIndex));
                                                        event.dataTransfer.effectAllowed = 'move';
                                                    }}
                                                    className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-blue-900 font-medium shadow-sm cursor-grab active:cursor-grabbing"
                                                >
                                                    {pair.left}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-xs uppercase tracking-wide text-gray-400">Drop onto the matches</p>
                                            {rightOptions.map((rightOption, rightIndex) => {
                                                const matchedLeftIndex = matches[rightIndex];
                                                const matchedLeft = matchedLeftIndex !== undefined
                                                    ? exercise.pairs[matchedLeftIndex]?.left
                                                    : null;
                                                const isCorrect = matchedLeftIndex !== undefined && exercise.pairs[matchedLeftIndex]?.right === rightOption;
                                                const showResults = matchingState?.showResults;
                                                return (
                                                    <div
                                                        key={`${rightOption}-${rightIndex}`}
                                                        onDragOver={(event) => event.preventDefault()}
                                                        onDrop={(event) => {
                                                            event.preventDefault();
                                                            const leftIndex = Number(event.dataTransfer.getData('text/plain'));
                                                            if (Number.isNaN(leftIndex)) return;
                                                            handleDropMatch(index, rightIndex, leftIndex);
                                                        }}
                                                        className={`p-3 rounded-lg border-2 border-dashed flex items-center justify-between gap-3 min-h-[56px] ${matchedLeft
                                                            ? 'border-blue-300 bg-blue-50'
                                                            : 'border-gray-200 bg-gray-50'
                                                            }`}
                                                    >
                                                        <span className="text-gray-800 font-medium">{rightOption}</span>
                                                        <span className="text-sm text-gray-500">←</span>
                                                        <span className={`text-sm font-semibold ${matchedLeft ? 'text-blue-700' : 'text-gray-400'}`}>
                                                            {matchedLeft || 'Drop here'}
                                                        </span>
                                                        {showResults && matchedLeft && (
                                                            <span className={`text-xs font-bold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                                                                {isCorrect ? 'Correct' : 'Try again'}
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-wrap items-center gap-3">
                                        <button
                                            onClick={() => setMatchingStates((prev) => prev.map((state, idx) => (
                                                idx === index ? { ...state, showResults: !state.showResults } : state
                                            )))}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                        >
                                            {matchingState?.showResults ? 'Hide Results' : 'Check Answers'}
                                        </button>
                                        <button
                                            onClick={() => resetMatching(index)}
                                            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                                        >
                                            Reset Matches
                                        </button>
                                    </div>
                                    <p className="mt-4 text-sm text-gray-600"><span className="font-bold">Explanation:</span> {exercise.explanation}</p>
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-dashed border-gray-300 p-10 text-center text-gray-500">
                            No matching exercises yet. Add one below to start practicing.
                        </div>
                    )}

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add a matching exercise</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={newMatching.prompt}
                                onChange={(event) => setNewMatching((prev) => ({ ...prev, prompt: event.target.value }))}
                                placeholder="Prompt (e.g., Match the terms)"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    value={newMatching.left}
                                    onChange={(event) => setNewMatching((prev) => ({ ...prev, left: event.target.value }))}
                                    placeholder="Left item"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    value={newMatching.right}
                                    onChange={(event) => setNewMatching((prev) => ({ ...prev, right: event.target.value }))}
                                    placeholder="Right item"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <textarea
                                value={newMatching.explanation}
                                onChange={(event) => setNewMatching((prev) => ({ ...prev, explanation: event.target.value }))}
                                placeholder="Explanation"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                            />
                            <button
                                onClick={handleAddMatching}
                                disabled={!newMatching.prompt.trim() || !newMatching.left.trim() || !newMatching.right.trim() || !newMatching.explanation.trim()}
                                className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add Matching Exercise
                            </button>
                        </div>
                    </div>
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

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add a clinical scenario</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={newClinical.scenario}
                                onChange={(event) => setNewClinical((prev) => ({ ...prev, scenario: event.target.value }))}
                                placeholder="Scenario"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                value={newClinical.answer}
                                onChange={(event) => setNewClinical((prev) => ({ ...prev, answer: event.target.value }))}
                                placeholder="Answer"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <textarea
                                value={newClinical.explanation}
                                onChange={(event) => setNewClinical((prev) => ({ ...prev, explanation: event.target.value }))}
                                placeholder="Explanation"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                            />
                            <button
                                onClick={handleAddClinical}
                                disabled={!newClinical.scenario.trim() || !newClinical.answer.trim() || !newClinical.explanation.trim()}
                                className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add Clinical Scenario
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const shuffleArray = <T,>(values: T[]) => {
    const copy = [...values];
    for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};
