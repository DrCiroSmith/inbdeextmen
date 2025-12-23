import React, { useEffect, useState } from 'react';
import { StudyData } from '../types';

interface StudyModeProps {
    data: StudyData;
    onExit: () => void;
    onUpdateData: (data: StudyData) => void;
    darkMode?: boolean;
}

// Constants for keyword extraction
const MIN_WORD_LENGTH = 3;
const MAX_IMAGE_KEYWORDS = 5;
const MAX_RADIOPAEDIA_KEYWORDS = 4;

// Common dental/medical terms to prioritize for image search (tags)
const DENTAL_MEDICAL_TAGS = new Set([
    // Anatomical locations
    'tooth', 'teeth', 'molar', 'premolar', 'incisor', 'canine', 'bicuspid',
    'mandible', 'mandibular', 'maxilla', 'maxillary', 'palate', 'palatal',
    'gingiva', 'gingival', 'tongue', 'lip', 'lips', 'cheek', 'buccal',
    'periodontal', 'periapical', 'alveolar', 'pulp', 'pulpal', 'enamel',
    'dentin', 'cementum', 'root', 'crown', 'apex', 'apical', 'furcation',
    'anterior', 'posterior', 'mesial', 'distal', 'lingual', 'labial',
    'occlusal', 'interproximal', 'proximal', 'cervical', 'sublingual',
    'submandibular', 'parotid', 'salivary', 'tmj', 'condyle', 'ramus',
    // Conditions and pathology
    'caries', 'cavity', 'decay', 'abscess', 'infection', 'lesion',
    'tumor', 'cyst', 'neoplasm', 'cancer', 'carcinoma', 'malignant',
    'benign', 'ulcer', 'ulceration', 'erosion', 'attrition', 'abrasion',
    'resorption', 'fracture', 'trauma', 'impaction', 'impacted',
    'inflammation', 'swelling', 'edema', 'necrosis', 'necrotic',
    'periodontitis', 'gingivitis', 'recession', 'mobility', 'bone loss',
    'radiolucent', 'radiopaque', 'calcification', 'calculus', 'tartar',
    'plaque', 'biofilm', 'fistula', 'sinus tract', 'granuloma',
    'ameloblastoma', 'odontoma', 'keratocyst', 'dentigerous', 'radicular',
    'mucocele', 'ranula', 'fibroma', 'papilloma', 'leukoplakia',
    'erythroplakia', 'lichen planus', 'candidiasis', 'thrush', 'herpes',
    'cleft', 'palate', 'lip', 'malocclusion', 'crossbite', 'overbite',
    'overjet', 'spacing', 'crowding', 'diastema', 'supernumerary',
    'hypodontia', 'hyperdontia', 'fusion', 'gemination', 'dilaceration',
    // Procedures and treatments
    'extraction', 'filling', 'restoration', 'crown', 'bridge', 'implant',
    'denture', 'prosthesis', 'endodontic', 'root canal', 'pulpectomy',
    'pulpotomy', 'apicoectomy', 'orthodontic', 'scaling', 'prophylaxis',
    'biopsy', 'surgery', 'surgical', 'grafting', 'bone graft',
    // Radiograph types
    'radiograph', 'xray', 'x-ray', 'panoramic', 'bitewing', 'periapical',
    'cbct', 'ct', 'mri', 'imaging', 'scan',
    // Descriptive terms
    'right', 'left', 'bilateral', 'unilateral', 'upper', 'lower',
    'primary', 'permanent', 'deciduous', 'mixed', 'erupted', 'unerupted'
]);

// Stopwords to filter out
const STOPWORDS = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need',
    'this', 'that', 'these', 'those', 'there', 'here', 'where', 'when',
    'why', 'how', 'what', 'which', 'who', 'whom', 'whose', 'all', 'each',
    'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such',
    'only', 'own', 'same', 'than', 'too', 'very', 'just', 'also', 'now',
    'patient', 'year', 'old', 'presents', 'presenting', 'history',
    'reports', 'complains', 'noted', 'shows', 'reveals', 'indicates',
    'appears', 'examination', 'clinical', 'finding', 'findings',
    'following', 'recent', 'past', 'days', 'weeks', 'months', 'years'
]);

// Extract meaningful medical/dental tags from a clinical scenario
const extractMedicalTags = (scenario: string): string[] => {
    const words = scenario
        .toLowerCase()
        .replace(/[^\w\s-]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length >= MIN_WORD_LENGTH && !STOPWORDS.has(word));
    
    // Prioritize known medical/dental terms
    const priorityTags: string[] = [];
    const otherWords: string[] = [];
    
    words.forEach(word => {
        if (DENTAL_MEDICAL_TAGS.has(word)) {
            if (!priorityTags.includes(word)) {
                priorityTags.push(word);
            }
        } else if (!otherWords.includes(word)) {
            otherWords.push(word);
        }
    });
    
    // Also check for compound terms (e.g., "root canal", "bone loss")
    const scenarioLower = scenario.toLowerCase();
    const compoundTerms = [
        'root canal', 'bone loss', 'bone graft', 'sinus tract', 'cleft palate',
        'cleft lip', 'lichen planus', 'dry socket', 'wisdom tooth'
    ];
    
    compoundTerms.forEach(term => {
        if (scenarioLower.includes(term) && !priorityTags.includes(term)) {
            priorityTags.push(term);
        }
    });
    
    // Return priority tags first, then fill with other relevant words
    return [...priorityTags, ...otherWords];
};

// Helper function to generate search URL for clinical images
const getImageSearchUrl = (scenario: string): string => {
    // Extract meaningful medical/dental tags from the scenario
    const tags = extractMedicalTags(scenario).slice(0, MAX_IMAGE_KEYWORDS);
    const keywords = tags.join(' ');
    
    // Add dental context for better image results
    const searchTerms = `${keywords} dental radiograph`;
    return `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(searchTerms)}`;
};

// Helper function to get Radiopaedia search URL for radiograph references
const getRadiopaediaUrl = (scenario: string): string => {
    // Extract meaningful medical/dental tags for Radiopaedia search
    const tags = extractMedicalTags(scenario).slice(0, MAX_RADIOPAEDIA_KEYWORDS);
    const keywords = tags.join('+');
    return `https://radiopaedia.org/search?q=${keywords}&scope=all`;
};

// Extend study modes to support new question types introduced in version 2.0.0
type Mode = 'flashcards' | 'quiz' | 'fillInTheBlank' | 'matching' | 'clinical';

export const StudyMode: React.FC<StudyModeProps> = ({ data, onExit, onUpdateData, darkMode = false }) => {
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

    // Completion tracking for progress pills
    const isQuizComplete = (): boolean => {
        if (data.multipleChoice.length === 0) return false;
        if (!showResults) return false;
        return calculateScore() === data.multipleChoice.length;
    };

    const isFillComplete = (): boolean => {
        const fillItems = data.fillInTheBlank || [];
        if (fillItems.length === 0) return false;
        return fillItems.every((item, index) => {
            const isChecked = fillChecked[index];
            if (!isChecked) return false;
            const userAnswer = (fillAnswers[index] || '').toLowerCase().trim();
            const correct = item.answer.toLowerCase().trim();
            return userAnswer === correct;
        });
    };

    const isMatchingComplete = (): boolean => {
        const matchingItems = data.matching || [];
        if (matchingItems.length === 0) return false;
        return matchingItems.every((exercise, exerciseIndex) => {
            const matchingState = matchingStates[exerciseIndex];
            if (!matchingState?.showResults) return false;
            // Check if all pairs are correctly matched
            const rightOptions = matchingState.rightOptions;
            const matches = matchingState.matches;
            return exercise.pairs.every((pair, pairIndex) => {
                // Find which rightIndex has this pair's right value
                const rightIndex = rightOptions.findIndex(r => r === pair.right);
                if (rightIndex === -1) return false;
                const matchedLeftIndex = matches[rightIndex];
                return matchedLeftIndex === pairIndex;
            });
        });
    };

    // Get the pill style based on completion status
    const getProgressPillClass = (isComplete: boolean, isActive: boolean): string => {
        if (isActive) {
            return 'bg-blue-600 text-white';
        }
        if (isComplete) {
            return darkMode ? 'bg-green-700 text-green-100' : 'bg-green-500 text-white';
        }
        return darkMode ? 'bg-red-800 text-red-200' : 'bg-red-500 text-white';
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
        <div className={`max-w-4xl mx-auto p-6 ${darkMode ? 'text-gray-100' : ''}`}>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{data.videoTitle}</h2>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>{data.playlistTitle}</p>
                </div>
                <button
                    onClick={onExit}
                    className={`px-4 py-2 ${darkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'} font-medium`}
                >
                    Exit Study Mode
                </button>
            </div>

            {/* Tabs with Progress Pills */}
            <div className={`flex flex-wrap gap-3 mb-8 border-b pb-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} role="tablist">
                {/* Flashcards - no completion tracking needed */}
                <button
                    onClick={() => setMode('flashcards')}
                    role="tab"
                    aria-selected={mode === 'flashcards'}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${mode === 'flashcards'
                        ? 'bg-blue-600 text-white shadow-md'
                        : darkMode 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    📚 Flashcards ({data.flashcards.length})
                </button>
                
                {/* Quiz - with completion tracking */}
                <button
                    onClick={() => setMode('quiz')}
                    role="tab"
                    aria-selected={mode === 'quiz'}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${mode === 'quiz'
                        ? 'bg-blue-600 text-white shadow-md'
                        : data.multipleChoice.length > 0 
                            ? getProgressPillClass(isQuizComplete(), false)
                            : darkMode 
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    {data.multipleChoice.length > 0 && (isQuizComplete() ? '✓ ' : '○ ')}
                    Quiz ({data.multipleChoice.length})
                </button>
                
                {/* Fill-in-the-Blank - with completion tracking */}
                <button
                    onClick={() => setMode('fillInTheBlank')}
                    role="tab"
                    aria-selected={mode === 'fillInTheBlank'}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${mode === 'fillInTheBlank'
                        ? 'bg-blue-600 text-white shadow-md'
                        : (data.fillInTheBlank?.length || 0) > 0 
                            ? getProgressPillClass(isFillComplete(), false)
                            : darkMode 
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    {(data.fillInTheBlank?.length || 0) > 0 && (isFillComplete() ? '✓ ' : '○ ')}
                    Fill-in-the-Blank ({data.fillInTheBlank?.length || 0})
                </button>
                
                {/* Matching - with completion tracking */}
                <button
                    onClick={() => setMode('matching')}
                    role="tab"
                    aria-selected={mode === 'matching'}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${mode === 'matching'
                        ? 'bg-blue-600 text-white shadow-md'
                        : (data.matching?.length || 0) > 0 
                            ? getProgressPillClass(isMatchingComplete(), false)
                            : darkMode 
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    {(data.matching?.length || 0) > 0 && (isMatchingComplete() ? '✓ ' : '○ ')}
                    Matching ({data.matching?.length || 0})
                </button>
                
                {/* Clinical - no completion tracking needed */}
                <button
                    onClick={() => setMode('clinical')}
                    role="tab"
                    aria-selected={mode === 'clinical'}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${mode === 'clinical'
                        ? 'bg-blue-600 text-white shadow-md'
                        : darkMode 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    🏥 Clinical ({data.clinical?.length || 0})
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
                                        className={`absolute inset-0 w-full h-full ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center border-2 border-transparent group-hover:border-blue-100 transition-colors`}
                                        style={{ backfaceVisibility: 'hidden' }}
                                    >
                                        <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider mb-4`}>Question</span>
                                        <p className={`text-2xl text-center font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                                            {data.flashcards[currentCardIndex]?.front}
                                        </p>
                                        <p className={`absolute bottom-6 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Click to flip</p>
                                    </div>

                                    {/* Back */}
                                    <div
                                        className={`absolute inset-0 w-full h-full ${darkMode ? 'bg-blue-900' : 'bg-blue-50'} rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center border-2 border-blue-100`}
                                        style={{
                                            backfaceVisibility: 'hidden',
                                            transform: 'rotateY(180deg)'
                                        }}
                                    >
                                        <span className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-400'} uppercase tracking-wider mb-4`}>Answer</span>
                                        <p className={`text-xl text-center ${darkMode ? 'text-gray-100' : 'text-gray-800'} leading-relaxed`}>
                                            {data.flashcards[currentCardIndex]?.back}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 mt-8">
                                <button
                                    onClick={handlePrevCard}
                                    className={`p-3 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
                                >
                                    ← Previous
                                </button>
                                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} font-medium`}>
                                    {currentCardIndex + 1} / {data.flashcards.length}
                                </span>
                                <button
                                    onClick={handleNextCard}
                                    className={`p-3 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
                                >
                                    Next →
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className={`w-full max-w-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} rounded-2xl shadow-sm border border-dashed p-10 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            No flashcards yet. Add your first card below to start studying.
                        </div>
                    )}

                    <div className={`w-full max-w-2xl mt-10 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-sm border p-6`}>
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-4`}>Add a flashcard</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={newFlashcard.front}
                                onChange={(event) => setNewFlashcard((prev) => ({ ...prev, front: event.target.value }))}
                                placeholder="Front (question)"
                                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300'}`}
                            />
                            <textarea
                                value={newFlashcard.back}
                                onChange={(event) => setNewFlashcard((prev) => ({ ...prev, back: event.target.value }))}
                                placeholder="Back (answer)"
                                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300'}`}
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
                                <div key={index} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
                                    <div className="flex items-start gap-4">
                                        <span className={`flex-shrink-0 w-8 h-8 ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'} rounded-full flex items-center justify-center font-bold text-sm`}>
                                            {index + 1}
                                        </span>
                                        <div className="flex-1">
                                            <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-4`}>{quiz.question}</h3>
                                            <div className="space-y-3">
                                                {quiz.options.map((option, optIndex) => (
                                                    <button
                                                        key={optIndex}
                                                        onClick={() => handleAnswerSelect(index, option)}
                                                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${quizAnswers[index] === option
                                                            ? darkMode 
                                                                ? 'border-blue-500 bg-blue-900/50 text-blue-300'
                                                                : 'border-blue-500 bg-blue-50 text-blue-700'
                                                            : darkMode
                                                                ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700 text-gray-200'
                                                                : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-800'
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
                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-8 text-center mb-8`}>
                                <h3 className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>Quiz Complete!</h3>
                                <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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
                                    ? darkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200'
                                    : darkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200'
                                    }`}>
                                    <div className="flex gap-3 mb-4">
                                        <span className={`font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{index + 1}.</span>
                                        <h4 className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{quiz.question}</h4>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className={`p-3 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded border`}>
                                            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} uppercase`}>Your Answer</span>
                                            <p className={`font-medium ${quizAnswers[index] === quiz.correctAnswer 
                                                ? darkMode ? 'text-green-400' : 'text-green-600' 
                                                : darkMode ? 'text-red-400' : 'text-red-600'
                                                }`}>
                                                {quizAnswers[index]}
                                            </p>
                                        </div>
                                        <div className={`p-3 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded border`}>
                                            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} uppercase`}>Correct Answer</span>
                                            <p className={`font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{quiz.correctAnswer}</p>
                                        </div>
                                    </div>

                                    <div className={`text-sm ${darkMode ? 'text-gray-300 bg-gray-800/50' : 'text-gray-600 bg-white/50'} p-4 rounded-lg`}>
                                        <span className="font-bold">Explanation:</span> {quiz.explanation}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={`mt-10 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-sm border p-6`}>
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-4`}>Add a quiz question</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={newQuiz.question}
                                onChange={(event) => setNewQuiz((prev) => ({ ...prev, question: event.target.value }))}
                                placeholder="Question"
                                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300'}`}
                            />
                            <input
                                type="text"
                                value={newQuiz.options}
                                onChange={(event) => setNewQuiz((prev) => ({ ...prev, options: event.target.value }))}
                                placeholder="Options (comma separated)"
                                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300'}`}
                            />
                            <input
                                type="text"
                                value={newQuiz.correctAnswer}
                                onChange={(event) => setNewQuiz((prev) => ({ ...prev, correctAnswer: event.target.value }))}
                                placeholder="Correct answer"
                                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300'}`}
                            />
                            <textarea
                                value={newQuiz.explanation}
                                onChange={(event) => setNewQuiz((prev) => ({ ...prev, explanation: event.target.value }))}
                                placeholder="Explanation"
                                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300'}`}
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
                            <div key={index} className={`rounded-xl shadow-sm border-2 p-6 transition-colors ${
                                isChecked 
                                    ? (isCorrect 
                                        ? darkMode ? 'border-green-600 bg-green-900/30' : 'border-green-300 bg-green-50' 
                                        : darkMode ? 'border-red-600 bg-red-900/30' : 'border-red-300 bg-red-50')
                                    : darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                            }`}>
                                <div className="mb-4">
                                    <span className={`font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{index + 1}.</span>{' '}
                                    <span className={`${darkMode ? 'text-gray-100' : 'text-gray-900'} font-medium`}>{item.question}</span>
                                </div>
                                
                                {/* Input field for answer */}
                                <div className="mb-4">
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
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
                                                    ? darkMode ? 'border-green-500 bg-green-900/50 text-green-300' : 'border-green-400 bg-green-100 text-green-800' 
                                                    : darkMode ? 'border-red-500 bg-red-900/50 text-red-300' : 'border-red-400 bg-red-100 text-red-800')
                                                : darkMode 
                                                    ? 'border-gray-600 bg-gray-700 text-gray-100 focus:ring-blue-500 focus:border-blue-500' 
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
                                                className={`px-4 py-2 font-medium border rounded-lg transition-colors ${
                                                    darkMode 
                                                        ? 'text-gray-300 hover:text-gray-100 border-gray-600 hover:bg-gray-700' 
                                                        : 'text-gray-600 hover:text-gray-800 border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {showHint ? 'Hide Hint' : 'Show Hint'}
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleResetFillQuestion(index)}
                                            className={`px-4 py-2 font-medium border rounded-lg transition-colors ${
                                                darkMode 
                                                    ? 'text-gray-300 hover:text-gray-100 border-gray-600 hover:bg-gray-700' 
                                                    : 'text-gray-600 hover:text-gray-800 border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            Try Again
                                        </button>
                                    )}
                                </div>

                                {/* Hint */}
                                {showHint && !isChecked && (
                                    <div className={`mb-4 p-3 rounded-lg border ${darkMode ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 border-yellow-200'}`}>
                                        <p className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                                            <span className="font-bold">💡 Hint:</span> The answer has {item.answer?.length || 0} characters
                                            {item.answer && item.answer.length > 0 && ` and starts with "${item.answer[0].toUpperCase()}"`}
                                        </p>
                                    </div>
                                )}

                                {/* Result feedback */}
                                {isChecked && (
                                    <div className="space-y-3">
                                        {isCorrect ? (
                                            <div className={`flex items-center gap-2 font-semibold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                                                <span className="text-xl">✓</span> Correct! Well done!
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <div className={`flex items-center gap-2 font-semibold ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                                                    <span className="text-xl">✗</span> Not quite right
                                                </div>
                                                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                                    <span className="font-bold">Correct Answer:</span>{' '}
                                                    <span className={`font-semibold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>{item.answer}</span>
                                                </p>
                                            </div>
                                        )}
                                        <div className={`p-3 rounded-lg border ${darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
                                            <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                                <span className={`font-bold ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>📖 Explanation:</span> {item.explanation}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-sm border p-6`}>
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-4`}>Add a fill-in-the-blank</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={newFill.question}
                                onChange={(event) => setNewFill((prev) => ({ ...prev, question: event.target.value }))}
                                placeholder="Prompt or question"
                                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300'}`}
                            />
                            <input
                                type="text"
                                value={newFill.answer}
                                onChange={(event) => setNewFill((prev) => ({ ...prev, answer: event.target.value }))}
                                placeholder="Answer"
                                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300'}`}
                            />
                            <textarea
                                value={newFill.explanation}
                                onChange={(event) => setNewFill((prev) => ({ ...prev, explanation: event.target.value }))}
                                placeholder="Explanation"
                                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300'}`}
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
                                <div key={index} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
                                    <div className="mb-4">
                                        <span className={`font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{index + 1}.</span>{' '}
                                        <span className={`${darkMode ? 'text-gray-100' : 'text-gray-900'} font-medium`}>{exercise.prompt}</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <p className={`text-xs uppercase tracking-wide ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Drag these terms</p>
                                            {exercise.pairs.map((pair, leftIndex) => (
                                                <div
                                                    key={pair.left}
                                                    draggable
                                                    onDragStart={(event) => {
                                                        event.dataTransfer.setData('text/plain', String(leftIndex));
                                                        event.dataTransfer.effectAllowed = 'move';
                                                    }}
                                                    className={`p-3 rounded-lg border font-medium shadow-sm cursor-grab active:cursor-grabbing ${
                                                        darkMode 
                                                            ? 'bg-blue-900/50 border-blue-700 text-blue-300' 
                                                            : 'bg-blue-50 border-blue-100 text-blue-900'
                                                    }`}
                                                >
                                                    {pair.left}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-3">
                                            <p className={`text-xs uppercase tracking-wide ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Drop onto the matches</p>
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
                                                            ? darkMode ? 'border-blue-600 bg-blue-900/30' : 'border-blue-300 bg-blue-50'
                                                            : darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                                                            }`}
                                                    >
                                                        <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{rightOption}</span>
                                                        <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>←</span>
                                                        <span className={`text-sm font-semibold ${matchedLeft 
                                                            ? darkMode ? 'text-blue-400' : 'text-blue-700' 
                                                            : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                            {matchedLeft || 'Drop here'}
                                                        </span>
                                                        {showResults && matchedLeft && (
                                                            <span className={`text-xs font-bold ${isCorrect 
                                                                ? darkMode ? 'text-green-400' : 'text-green-600' 
                                                                : darkMode ? 'text-red-400' : 'text-red-500'}`}>
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
                                            className={`px-4 py-2 font-medium ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`}
                                        >
                                            Reset Matches
                                        </button>
                                    </div>
                                    <p className={`mt-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}><span className="font-bold">Explanation:</span> {exercise.explanation}</p>
                                </div>
                            );
                        })
                    ) : (
                        <div className={`${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} rounded-2xl shadow-sm border border-dashed p-10 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            No matching exercises yet. Add one below to start practicing.
                        </div>
                    )}

                    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-sm border p-6`}>
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-4`}>Add a matching exercise</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={newMatching.prompt}
                                onChange={(event) => setNewMatching((prev) => ({ ...prev, prompt: event.target.value }))}
                                placeholder="Prompt (e.g., Match the terms)"
                                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300'}`}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    value={newMatching.left}
                                    onChange={(event) => setNewMatching((prev) => ({ ...prev, left: event.target.value }))}
                                    placeholder="Left item"
                                    className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300'}`}
                                />
                                <input
                                    type="text"
                                    value={newMatching.right}
                                    onChange={(event) => setNewMatching((prev) => ({ ...prev, right: event.target.value }))}
                                    placeholder="Right item"
                                    className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300'}`}
                                />
                            </div>
                            <textarea
                                value={newMatching.explanation}
                                onChange={(event) => setNewMatching((prev) => ({ ...prev, explanation: event.target.value }))}
                                placeholder="Explanation"
                                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300'}`}
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
                    {/* Info Banner about Images */}
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'} border`}>
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">🔬</span>
                            <div>
                                <h4 className={`font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-800'} mb-1`}>Clinical Images & Radiographs</h4>
                                <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                                    Each clinical scenario includes links to search for relevant radiographs, X-rays, and clinical images to help you visualize the condition and arrive at a diagnosis.
                                </p>
                            </div>
                        </div>
                    </div>

                    {data.clinical?.map((item, index) => (
                        <div key={index} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
                            <div className="mb-4">
                                <span className={`font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{index + 1}.</span>{' '}
                                <span className={`${darkMode ? 'text-gray-100' : 'text-gray-900'} font-medium`}>{item.scenario}</span>
                            </div>
                            
                            {/* Image Search Links */}
                            <div className={`mb-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                                <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-3 flex items-center gap-2`}>
                                    <span>📷</span> Related Images & Radiographs:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <a
                                        href={getImageSearchUrl(item.scenario)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'bg-purple-900 text-purple-300 hover:bg-purple-800' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
                                    >
                                        🔍 Search Clinical Images
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                    <a
                                        href={getRadiopaediaUrl(item.scenario)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'bg-green-900 text-green-300 hover:bg-green-800' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                                    >
                                        📚 Radiopaedia Reference
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            <button
                                onClick={() => setRevealedClinical(prev => ({ ...prev, [index]: !prev[index] }))}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                {revealedClinical[index] ? 'Hide Answer' : 'Reveal Answer'}
                            </button>
                            {revealedClinical[index] && (
                                <div className={`mt-4 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    <p><span className="font-bold">Answer:</span> {item.answer}</p>
                                    <p><span className="font-bold">Explanation:</span> {item.explanation}</p>
                                </div>
                            )}
                        </div>
                    ))}

                    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-sm border p-6`}>
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-4`}>Add a clinical scenario</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={newClinical.scenario}
                                onChange={(event) => setNewClinical((prev) => ({ ...prev, scenario: event.target.value }))}
                                placeholder="Scenario"
                                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300'}`}
                            />
                            <input
                                type="text"
                                value={newClinical.answer}
                                onChange={(event) => setNewClinical((prev) => ({ ...prev, answer: event.target.value }))}
                                placeholder="Answer"
                                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300'}`}
                            />
                            <textarea
                                value={newClinical.explanation}
                                onChange={(event) => setNewClinical((prev) => ({ ...prev, explanation: event.target.value }))}
                                placeholder="Explanation"
                                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300'}`}
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
