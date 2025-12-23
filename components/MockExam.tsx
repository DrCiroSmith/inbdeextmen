import React, { useState, useEffect } from 'react';
import { MOCK_EXAM_QUESTIONS, MockExamQuestion } from '../mockExamQuestions';

interface MockExamProps {
    onExit: () => void;
}

type ExamMode = 'setup' | 'in-progress' | 'review' | 'results';
type ExamType = 'full' | 'partial';

interface ExamSession {
    sessionNumber: number;
    questions: MockExamQuestion[];
    answers: Record<number, string>;
    flagged: Set<number>;
    timeRemaining: number;
    completed: boolean;
}

const SECONDS_PER_SESSION = 65 * 60;
const QUESTIONS_PER_SESSION = 62;

export const MockExam: React.FC<MockExamProps> = ({ onExit }) => {
    const [mode, setMode] = useState<ExamMode>('setup');
    const [examType, setExamType] = useState<ExamType>('partial');
    const [customQuestionCount, setCustomQuestionCount] = useState(50);
    const [sessions, setSessions] = useState<ExamSession[]>([]);
    const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timerActive, setTimerActive] = useState(false);
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

    const allSubjects = [...new Set(MOCK_EXAM_QUESTIONS.map(q => q.subject))];

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (timerActive && mode === 'in-progress') {
            interval = setInterval(() => {
                setSessions(prev => {
                    const updated = [...prev];
                    if (updated[currentSessionIndex]) {
                        const newTime = updated[currentSessionIndex].timeRemaining - 1;
                        if (newTime <= 0) {
                            updated[currentSessionIndex] = {
                                ...updated[currentSessionIndex],
                                timeRemaining: 0,
                                completed: true
                            };
                            setTimerActive(false);
                        } else {
                            updated[currentSessionIndex] = {
                                ...updated[currentSessionIndex],
                                timeRemaining: newTime
                            };
                        }
                    }
                    return updated;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timerActive, mode, currentSessionIndex]);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const shuffleArray = <T,>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const startExam = () => {
        let questionPool = [...MOCK_EXAM_QUESTIONS];
        if (selectedSubjects.length > 0) {
            questionPool = questionPool.filter(q => selectedSubjects.includes(q.subject));
        }
        questionPool = shuffleArray(questionPool);
        
        let totalQuestions: number;
        let sessionsCount: number;
        
        if (examType === 'full') {
            totalQuestions = Math.min(496, questionPool.length);
            sessionsCount = 8;
        } else {
            totalQuestions = Math.min(customQuestionCount, questionPool.length);
            sessionsCount = Math.ceil(totalQuestions / QUESTIONS_PER_SESSION);
        }
        
        const selectedQuestions = questionPool.slice(0, totalQuestions);
        const newSessions: ExamSession[] = [];
        
        for (let i = 0; i < sessionsCount; i++) {
            const start = i * QUESTIONS_PER_SESSION;
            const end = Math.min(start + QUESTIONS_PER_SESSION, selectedQuestions.length);
            const sessionQuestions = selectedQuestions.slice(start, end);
            
            if (sessionQuestions.length > 0) {
                newSessions.push({
                    sessionNumber: i + 1,
                    questions: sessionQuestions,
                    answers: {},
                    flagged: new Set(),
                    timeRemaining: SECONDS_PER_SESSION,
                    completed: false
                });
            }
        }
        
        setSessions(newSessions);
        setCurrentSessionIndex(0);
        setCurrentQuestionIndex(0);
        setMode('in-progress');
        setTimerActive(true);
    };

    const handleAnswerSelect = (answer: string) => {
        setSessions(prev => {
            const updated = [...prev];
            updated[currentSessionIndex] = {
                ...updated[currentSessionIndex],
                answers: {
                    ...updated[currentSessionIndex].answers,
                    [currentQuestionIndex]: answer
                }
            };
            return updated;
        });
    };

    const toggleFlag = () => {
        setSessions(prev => {
            const updated = [...prev];
            const currentFlagged = new Set(updated[currentSessionIndex].flagged);
            if (currentFlagged.has(currentQuestionIndex)) {
                currentFlagged.delete(currentQuestionIndex);
            } else {
                currentFlagged.add(currentQuestionIndex);
            }
            updated[currentSessionIndex] = {
                ...updated[currentSessionIndex],
                flagged: currentFlagged
            };
            return updated;
        });
    };

    const goToQuestion = (index: number) => {
        setCurrentQuestionIndex(index);
    };

    const nextQuestion = () => {
        const currentSession = sessions[currentSessionIndex];
        if (currentQuestionIndex < currentSession.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const endSession = () => {
        setTimerActive(false);
        setSessions(prev => {
            const updated = [...prev];
            updated[currentSessionIndex] = {
                ...updated[currentSessionIndex],
                completed: true
            };
            return updated;
        });
        
        if (currentSessionIndex < sessions.length - 1) {
            setCurrentSessionIndex(prev => prev + 1);
            setCurrentQuestionIndex(0);
            setTimerActive(true);
        } else {
            setMode('results');
        }
    };

    const calculateResults = () => {
        let totalCorrect = 0;
        let totalQuestions = 0;
        const subjectResults: Record<string, { correct: number; total: number }> = {};
        
        sessions.forEach(session => {
            session.questions.forEach((question, index) => {
                totalQuestions++;
                const userAnswer = session.answers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                if (isCorrect) totalCorrect++;
                
                if (!subjectResults[question.subject]) {
                    subjectResults[question.subject] = { correct: 0, total: 0 };
                }
                subjectResults[question.subject].total++;
                if (isCorrect) subjectResults[question.subject].correct++;
            });
        });
        
        return {
            totalCorrect,
            totalQuestions,
            percentage: Math.round((totalCorrect / totalQuestions) * 100),
            subjectResults
        };
    };

    const currentSession = sessions[currentSessionIndex];
    const currentQuestion = currentSession?.questions[currentQuestionIndex];

    if (mode === 'setup') {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">🏆 INBDE Mock Exam</h1>
                        <p className="text-gray-600">Simulate the real INBDE experience with timed sessions and real-world style questions</p>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Exam Type</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={() => setExamType('full')}
                                className={`p-6 rounded-xl border-2 text-left transition-all ${
                                    examType === 'full' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-2xl">📋</span>
                                    <h4 className="font-bold text-gray-900">Full INBDE Simulation</h4>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                    Complete 8 sessions with 62 questions each (496 total), timed at 65 minutes per session.
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <span className="bg-gray-100 px-2 py-1 rounded">8 Sessions</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded">496 Questions</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded">~8.5 hours total</span>
                                </div>
                            </button>
                            
                            <button
                                onClick={() => setExamType('partial')}
                                className={`p-6 rounded-xl border-2 text-left transition-all ${
                                    examType === 'partial' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-2xl">⚡</span>
                                    <h4 className="font-bold text-gray-900">Custom Practice Exam</h4>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                    Choose your own question count and optionally filter by subject areas.
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <span className="bg-gray-100 px-2 py-1 rounded">Flexible Length</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded">Subject Selection</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded">Timed Sessions</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {examType === 'partial' && (
                        <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customize Your Exam</h3>
                            
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Number of Questions: {customQuestionCount}
                                </label>
                                <input
                                    type="range"
                                    min="10"
                                    max={Math.min(MOCK_EXAM_QUESTIONS.length, 200)}
                                    value={customQuestionCount}
                                    onChange={(e) => setCustomQuestionCount(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Filter by Subject (optional)
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {allSubjects.map(subject => (
                                        <button
                                            key={subject}
                                            onClick={() => {
                                                setSelectedSubjects(prev => 
                                                    prev.includes(subject)
                                                        ? prev.filter(s => s !== subject)
                                                        : [...prev, subject]
                                                );
                                            }}
                                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                                selectedSubjects.includes(subject)
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-500'
                                            }`}
                                        >
                                            {subject}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-semibold text-yellow-800 mb-2">📝 Exam Rules</h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• Each session is timed at 65 minutes (like the real INBDE)</li>
                            <li>• You can flag questions to review later within the session</li>
                            <li>• Once a session ends, you cannot go back to previous sessions</li>
                            <li>• Results and explanations are shown after completing all sessions</li>
                        </ul>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={onExit} className="px-6 py-3 text-gray-600 font-semibold hover:text-gray-800">
                            ← Back to Home
                        </button>
                        <button
                            onClick={startExam}
                            className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                        >
                            <span>🚀</span> Start {examType === 'full' ? 'Full' : 'Practice'} Exam
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (mode === 'in-progress' && currentSession && currentQuestion) {
        const answeredCount = Object.keys(currentSession.answers).length;
        const flaggedCount = currentSession.flagged.size;
        const timeWarning = currentSession.timeRemaining < 300;

        return (
            <div className="min-h-screen bg-gray-100">
                <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="font-bold text-gray-900">
                                    Session {currentSession.sessionNumber} of {sessions.length}
                                </span>
                                <span className="text-sm text-gray-500">
                                    Question {currentQuestionIndex + 1} of {currentSession.questions.length}
                                </span>
                            </div>
                            
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-lg ${
                                timeWarning ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                                <span>⏱️</span>
                                <span className="font-bold">{formatTime(currentSession.timeRemaining)}</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-500">{answeredCount}/{currentSession.questions.length} answered</span>
                                {flaggedCount > 0 && <span className="text-sm text-orange-600">🚩 {flaggedCount} flagged</span>}
                                <button
                                    onClick={() => {
                                        if (confirm('End this session? You cannot return to these questions.')) {
                                            endSession();
                                        }
                                    }}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
                                >
                                    End Session
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
                    <div className="w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
                            <h3 className="font-semibold text-gray-900 mb-3">Question Navigator</h3>
                            <div className="grid grid-cols-5 gap-2">
                                {currentSession.questions.map((_, index) => {
                                    const isAnswered = currentSession.answers[index] !== undefined;
                                    const isFlagged = currentSession.flagged.has(index);
                                    const isCurrent = index === currentQuestionIndex;
                                    
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => goToQuestion(index)}
                                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors relative ${
                                                isCurrent ? 'bg-blue-600 text-white'
                                                    : isAnswered ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            {index + 1}
                                            {isFlagged && <span className="absolute -top-1 -right-1 text-orange-500">🚩</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                    {currentQuestion.subject}
                                </span>
                                <button
                                    onClick={toggleFlag}
                                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
                                        currentSession.flagged.has(currentQuestionIndex)
                                            ? 'bg-orange-100 text-orange-700'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    🚩 {currentSession.flagged.has(currentQuestionIndex) ? 'Flagged' : 'Flag'}
                                </button>
                            </div>

                            <div className="mb-6">
                                <h2 className="text-lg font-medium text-gray-900 leading-relaxed">{currentQuestion.question}</h2>
                            </div>

                            <div className="space-y-3">
                                {currentQuestion.options.map((option, index) => {
                                    const letter = String.fromCharCode(65 + index);
                                    const isSelected = currentSession.answers[currentQuestionIndex] === option;
                                    
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleAnswerSelect(option)}
                                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                                isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="font-semibold text-gray-500 mr-3">{letter}.</span>
                                            <span className="text-gray-800">{option}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-8 flex justify-between">
                                <button
                                    onClick={prevQuestion}
                                    disabled={currentQuestionIndex === 0}
                                    className="px-6 py-3 text-gray-600 font-semibold hover:text-gray-800 disabled:opacity-50"
                                >
                                    ← Previous
                                </button>
                                <button
                                    onClick={nextQuestion}
                                    disabled={currentQuestionIndex === currentSession.questions.length - 1}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (mode === 'results') {
        const results = calculateResults();
        const passed = results.percentage >= 75;

        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
                            <span className="text-5xl">{passed ? '🎉' : '📚'}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{passed ? 'Congratulations!' : 'Keep Studying!'}</h1>
                        <p className="text-gray-600">
                            {passed ? 'You achieved a passing score!' : 'You need 75% to pass. Review the questions below.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-gray-50 rounded-xl p-6 text-center">
                            <div className="text-4xl font-bold text-blue-600 mb-1">{results.percentage}%</div>
                            <div className="text-sm text-gray-500">Overall Score</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-6 text-center">
                            <div className="text-4xl font-bold text-green-600 mb-1">{results.totalCorrect}</div>
                            <div className="text-sm text-gray-500">Correct Answers</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-6 text-center">
                            <div className="text-4xl font-bold text-gray-600 mb-1">{results.totalQuestions}</div>
                            <div className="text-sm text-gray-500">Total Questions</div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Subject</h3>
                        <div className="space-y-3">
                            {Object.entries(results.subjectResults)
                                .sort((a, b) => (b[1].correct / b[1].total) - (a[1].correct / a[1].total))
                                .map(([subject, data]) => {
                                    const pct = Math.round((data.correct / data.total) * 100);
                                    return (
                                        <div key={subject} className="flex items-center gap-4">
                                            <div className="w-40 text-sm font-medium text-gray-700 truncate">{subject}</div>
                                            <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full ${pct >= 75 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                            <div className="w-20 text-sm text-gray-600 text-right">{data.correct}/{data.total} ({pct}%)</div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>

                    <div className="mb-8">
                        <button
                            onClick={() => setMode('review')}
                            className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
                        >
                            <span>📖</span> Review All Questions with Explanations
                        </button>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => {
                                setSessions([]);
                                setCurrentSessionIndex(0);
                                setCurrentQuestionIndex(0);
                                setMode('setup');
                            }}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
                        >
                            Take Another Exam
                        </button>
                        <button onClick={onExit} className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900">
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (mode === 'review') {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">📖 Question Review</h1>
                    <button onClick={() => setMode('results')} className="px-4 py-2 text-blue-600 font-semibold hover:underline">
                        ← Back to Results
                    </button>
                </div>

                <div className="space-y-6">
                    {sessions.map((session, sessionIdx) => (
                        <div key={sessionIdx}>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Session {session.sessionNumber}</h2>
                            {session.questions.map((question, qIdx) => {
                                const userAnswer = session.answers[qIdx];
                                const isCorrect = userAnswer === question.correctAnswer;

                                return (
                                    <div key={qIdx} className={`mb-4 p-6 rounded-xl border-2 ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                                        <div className="flex items-start gap-3 mb-3">
                                            <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                                                {isCorrect ? '✓' : '✗'}
                                            </span>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">{question.subject}</span>
                                                </div>
                                                <p className="text-gray-900 font-medium">{question.question}</p>
                                            </div>
                                        </div>

                                        <div className="ml-11 space-y-2 mb-4">
                                            {question.options.map((option, optIdx) => {
                                                const letter = String.fromCharCode(65 + optIdx);
                                                const isUserAnswer = option === userAnswer;
                                                const isCorrectAnswer = option === question.correctAnswer;

                                                return (
                                                    <div key={optIdx} className={`p-3 rounded-lg ${
                                                        isCorrectAnswer ? 'bg-green-100 border-2 border-green-500'
                                                            : isUserAnswer ? 'bg-red-100 border-2 border-red-500'
                                                            : 'bg-white border border-gray-200'
                                                    }`}>
                                                        <span className="font-semibold text-gray-500 mr-2">{letter}.</span>
                                                        <span className={isCorrectAnswer ? 'text-green-800 font-medium' : 'text-gray-700'}>{option}</span>
                                                        {isCorrectAnswer && <span className="ml-2 text-green-600 font-medium">(Correct)</span>}
                                                        {isUserAnswer && !isCorrectAnswer && <span className="ml-2 text-red-600 font-medium">(Your Answer)</span>}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="ml-11 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                            <p className="text-sm font-semibold text-blue-800 mb-1">📖 Explanation:</p>
                                            <p className="text-sm text-blue-700">{question.explanation}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex gap-4">
                    <button onClick={() => setMode('results')} className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700">
                        Back to Results
                    </button>
                    <button onClick={onExit} className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900">
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return null;
};
