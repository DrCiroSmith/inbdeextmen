import React, { useState, useEffect, useCallback, useRef } from 'react';

// Game question types for dental terminology
interface GameQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
    category: string;
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
    achievements: string[];
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
    { id: 'streak_5', name: 'On Fire!', description: 'Get a 5-answer streak', icon: '🔥', requirement: (s) => s.bestStreak >= 5 },
    { id: 'streak_10', name: 'Unstoppable!', description: 'Get a 10-answer streak', icon: '⚡', requirement: (s) => s.bestStreak >= 10 },
    { id: 'streak_20', name: 'Master Mind', description: 'Get a 20-answer streak', icon: '🧠', requirement: (s) => s.bestStreak >= 20 },
    { id: 'score_100', name: 'Century', description: 'Score 100 points in a game', icon: '💯', requirement: (s) => s.totalScore >= 100 },
    { id: 'score_500', name: 'High Scorer', description: 'Score 500 points in a game', icon: '🏆', requirement: (s) => s.totalScore >= 500 },
    { id: 'score_1000', name: 'Point Master', description: 'Score 1000 points in a game', icon: '👑', requirement: (s) => s.totalScore >= 1000 },
    { id: 'perfect_10', name: 'Perfect 10', description: 'Complete a game with 10+ questions and 100% accuracy', icon: '✨', requirement: (s) => s.totalQuestions >= 10 && s.correctAnswers === s.totalQuestions },
    { id: 'speed_demon', name: 'Speed Demon', description: 'Average under 3 seconds per answer (5+ questions)', icon: '⚡', requirement: (s) => s.averageTime > 0 && s.averageTime < 3 && s.totalQuestions >= 5 },
    { id: 'questions_50', name: 'Dedicated', description: 'Answer 50 questions in a game', icon: '📚', requirement: (s) => s.totalQuestions >= 50 },
    { id: 'questions_100', name: 'Scholar', description: 'Answer 100 questions in a game', icon: '🎓', requirement: (s) => s.totalQuestions >= 100 },
];

// Dental/Medical terminology questions for games
const GAME_QUESTIONS: GameQuestion[] = [
    // Head & Neck Anatomy
    { question: "Which cranial nerve controls the muscles of mastication?", options: ["Facial (VII)", "Trigeminal (V)", "Glossopharyngeal (IX)", "Hypoglossal (XII)"], correctAnswer: "Trigeminal (V)", category: "Anatomy", explanation: "The trigeminal nerve (CN V) has three divisions: ophthalmic, maxillary, and mandibular. The mandibular division controls the muscles of mastication." },
    { question: "The parotid gland duct opens opposite which tooth?", options: ["First molar", "Second premolar", "Second molar", "First premolar"], correctAnswer: "Second molar", category: "Anatomy", explanation: "Stensen's duct (parotid duct) opens into the oral cavity opposite the maxillary second molar." },
    { question: "Which muscle is NOT a muscle of mastication?", options: ["Masseter", "Temporalis", "Buccinator", "Medial pterygoid"], correctAnswer: "Buccinator", category: "Anatomy", explanation: "The buccinator is a muscle of facial expression innervated by CN VII. Muscles of mastication are innervated by CN V3." },
    { question: "The inferior alveolar nerve enters the mandible through which foramen?", options: ["Mental foramen", "Mandibular foramen", "Infraorbital foramen", "Incisive foramen"], correctAnswer: "Mandibular foramen", category: "Anatomy", explanation: "The inferior alveolar nerve enters through the mandibular foramen on the medial aspect of the ramus." },
    { question: "Which nerve provides general sensation to the anterior 2/3 of the tongue?", options: ["Glossopharyngeal nerve", "Hypoglossal nerve", "Lingual nerve", "Chorda tympani"], correctAnswer: "Lingual nerve", category: "Anatomy", explanation: "The lingual nerve (branch of CN V3) provides general sensation. Chorda tympani provides taste to the anterior 2/3." },
    
    // Pharmacology
    { question: "What is the maximum recommended dose of lidocaine with epinephrine for adults?", options: ["3.2 mg/kg", "4.4 mg/kg", "7 mg/kg", "2 mg/kg"], correctAnswer: "7 mg/kg", category: "Pharmacology", explanation: "Lidocaine with epinephrine has an MRD of 7 mg/kg or 500 mg absolute maximum in adults." },
    { question: "Which local anesthetic has the shortest duration of action?", options: ["Lidocaine", "Articaine", "Mepivacaine", "Bupivacaine"], correctAnswer: "Mepivacaine", category: "Pharmacology", explanation: "Mepivacaine without vasoconstrictor has the shortest duration (about 20 minutes for pulpal anesthesia)." },
    { question: "Epinephrine is contraindicated in patients taking which medication?", options: ["Penicillin", "Non-selective beta blockers", "Metformin", "Statins"], correctAnswer: "Non-selective beta blockers", category: "Pharmacology", explanation: "Epinephrine with non-selective beta blockers can cause hypertensive crisis due to unopposed alpha stimulation." },
    { question: "Which antibiotic is the first choice for dental infections?", options: ["Azithromycin", "Clindamycin", "Amoxicillin", "Metronidazole"], correctAnswer: "Amoxicillin", category: "Pharmacology", explanation: "Amoxicillin is the first-line antibiotic for dental infections due to its spectrum and safety profile." },
    { question: "What class of drug is ibuprofen?", options: ["Opioid", "Corticosteroid", "NSAID", "Muscle relaxant"], correctAnswer: "NSAID", category: "Pharmacology", explanation: "Ibuprofen is a non-steroidal anti-inflammatory drug (NSAID) that inhibits COX enzymes." },
    
    // Oral Pathology
    { question: "Which is the most common odontogenic cyst?", options: ["Dentigerous cyst", "Radicular cyst", "Odontogenic keratocyst", "Lateral periodontal cyst"], correctAnswer: "Radicular cyst", category: "Oral Pathology", explanation: "Radicular (periapical) cyst is the most common odontogenic cyst, arising from epithelial rests of Malassez." },
    { question: "What is the most common benign salivary gland tumor?", options: ["Warthin tumor", "Pleomorphic adenoma", "Mucoepidermoid carcinoma", "Adenoid cystic carcinoma"], correctAnswer: "Pleomorphic adenoma", category: "Oral Pathology", explanation: "Pleomorphic adenoma is the most common salivary gland tumor, usually occurring in the parotid gland." },
    { question: "Koplik spots are associated with which condition?", options: ["Chickenpox", "Measles", "Herpes simplex", "Hand-foot-mouth disease"], correctAnswer: "Measles", category: "Oral Pathology", explanation: "Koplik spots are pathognomonic of measles - bluish-white spots on buccal mucosa appearing before the rash." },
    { question: "Which condition presents with Wickham's striae?", options: ["Lichen planus", "Leukoplakia", "Pemphigus", "Pemphigoid"], correctAnswer: "Lichen planus", category: "Oral Pathology", explanation: "Wickham's striae are fine white lines seen on the surface of lichen planus lesions." },
    { question: "Ameloblastoma most commonly occurs in which location?", options: ["Maxillary anterior", "Mandibular posterior", "Maxillary posterior", "Mandibular anterior"], correctAnswer: "Mandibular posterior", category: "Oral Pathology", explanation: "Ameloblastoma most commonly occurs in the posterior mandible, often in the third molar region." },
    
    // Periodontics
    { question: "What is the normal sulcus depth in healthy periodontium?", options: ["0-1 mm", "1-3 mm", "4-5 mm", "5-7 mm"], correctAnswer: "1-3 mm", category: "Periodontics", explanation: "A healthy gingival sulcus measures 1-3mm in depth with no bleeding on probing." },
    { question: "Which bacteria is most associated with chronic periodontitis?", options: ["Streptococcus mutans", "Porphyromonas gingivalis", "Actinomyces", "Lactobacillus"], correctAnswer: "Porphyromonas gingivalis", category: "Periodontics", explanation: "P. gingivalis is a keystone pathogen in chronic periodontitis, part of the 'red complex' bacteria." },
    { question: "What is the width of attached gingiva calculated from?", options: ["Free gingival groove to CEJ", "MGJ to free gingival groove", "MGJ to sulcus base", "Free gingival margin to MGJ"], correctAnswer: "MGJ to free gingival groove", category: "Periodontics", explanation: "Attached gingiva extends from the mucogingival junction (MGJ) to the free gingival groove." },
    { question: "Furcation involvement is classified using which system?", options: ["Miller classification", "Glickman classification", "Kennedy classification", "Angle classification"], correctAnswer: "Glickman classification", category: "Periodontics", explanation: "Glickman classification (I-IV) is used to classify furcation involvement based on horizontal bone loss." },
    
    // Endodontics  
    { question: "What is the gold standard for pulp vitality testing?", options: ["Cold test", "Electric pulp test", "Heat test", "Bite test"], correctAnswer: "Cold test", category: "Endodontics", explanation: "Cold testing (with refrigerant spray or ice) is considered the most reliable sensibility test." },
    { question: "What is the optimal working length from the radiographic apex?", options: ["At the apex", "0.5-1.0 mm short", "1.5-2.0 mm short", "2.0-3.0 mm short"], correctAnswer: "0.5-1.0 mm short", category: "Endodontics", explanation: "The working length should be 0.5-1.0mm short of the radiographic apex to terminate at the apical constriction." },
    { question: "Which irrigant is most commonly used in root canal therapy?", options: ["Chlorhexidine", "Sodium hypochlorite", "EDTA", "Hydrogen peroxide"], correctAnswer: "Sodium hypochlorite", category: "Endodontics", explanation: "Sodium hypochlorite (NaOCl) is the primary irrigant due to its tissue-dissolving and antimicrobial properties." },
    { question: "Phoenix abscess is also known as:", options: ["Periapical abscess", "Acute apical periodontitis", "Acute exacerbation of chronic periapical lesion", "Lateral abscess"], correctAnswer: "Acute exacerbation of chronic periapical lesion", category: "Endodontics", explanation: "Phoenix abscess is an acute flare-up of a previously asymptomatic chronic periapical lesion." },
    
    // Prosthodontics
    { question: "Kennedy Class I refers to:", options: ["Unilateral distal extension", "Bilateral distal extension", "Unilateral bounded saddle", "Anterior edentulous span"], correctAnswer: "Bilateral distal extension", category: "Prosthodontics", explanation: "Kennedy Class I is bilateral distal extension (edentulous areas posterior to remaining teeth on both sides)." },
    { question: "What is the ideal crown-to-root ratio?", options: ["1:1", "1:2", "2:1", "2:3"], correctAnswer: "1:2", category: "Prosthodontics", explanation: "Ideally, the root should be twice as long as the crown (1:2 ratio). Minimum acceptable is 1:1." },
    { question: "Which cement provides the best retention?", options: ["Zinc phosphate", "Resin cement", "Glass ionomer", "Zinc oxide eugenol"], correctAnswer: "Resin cement", category: "Prosthodontics", explanation: "Resin cements provide the highest retention values due to their adhesive properties." },
    { question: "The rest seat should be prepared on which surface of the abutment?", options: ["Buccal", "Lingual", "Mesial or distal marginal ridge", "Occlusal central fossa"], correctAnswer: "Mesial or distal marginal ridge", category: "Prosthodontics", explanation: "Rest seats are typically prepared on the marginal ridge area, directing forces along the long axis of the tooth." },
    
    // Operative Dentistry
    { question: "Class II cavity involves which surfaces?", options: ["Facial/lingual of posteriors", "Proximal of anteriors", "Proximal of posteriors", "Incisal edge of anteriors"], correctAnswer: "Proximal of posteriors", category: "Operative", explanation: "Class II cavities involve the proximal surfaces of posterior teeth (premolars and molars)." },
    { question: "What is the ideal pulpal floor depth for amalgam restoration?", options: ["0.5 mm into dentin", "1.5-2.0 mm into dentin", "At the DEJ", "3.0 mm into dentin"], correctAnswer: "1.5-2.0 mm into dentin", category: "Operative", explanation: "Amalgam requires a minimum depth of 1.5-2.0mm into dentin for adequate bulk and strength." },
    { question: "Which bonding generation uses self-etching primer?", options: ["4th generation", "5th generation", "6th generation", "7th generation"], correctAnswer: "6th generation", category: "Operative", explanation: "6th generation bonding agents combine self-etching primer with adhesive in one bottle." },
    { question: "What is the function of the smear layer?", options: ["Enhances bonding", "Reduces sensitivity", "Must be removed or modified for bonding", "Increases retention"], correctAnswer: "Must be removed or modified for bonding", category: "Operative", explanation: "The smear layer must be removed (total-etch) or modified (self-etch) to achieve proper bonding." },
    
    // Pediatric Dentistry
    { question: "At what age does the first primary tooth typically erupt?", options: ["3 months", "6 months", "9 months", "12 months"], correctAnswer: "6 months", category: "Pediatric", explanation: "The mandibular central incisors typically erupt at around 6 months of age." },
    { question: "What is the most common space maintainer for a lost primary second molar?", options: ["Nance appliance", "Band and loop", "Distal shoe", "Lingual arch"], correctAnswer: "Band and loop", category: "Pediatric", explanation: "Band and loop is the most common unilateral space maintainer used when a primary first or second molar is lost." },
    { question: "Pulpotomy is indicated when pulp exposure is:", options: ["Mechanical, small", "Carious with symptoms", "With periapical pathology", "With internal resorption"], correctAnswer: "Mechanical, small", category: "Pediatric", explanation: "Pulpotomy is indicated for vital pulp exposure that is mechanical (traumatic) and relatively small." },
    { question: "What is the tell-show-do technique?", options: ["Sedation method", "Behavior management technique", "Restorative technique", "Impression technique"], correctAnswer: "Behavior management technique", category: "Pediatric", explanation: "Tell-show-do is a fundamental behavior management technique where the procedure is explained, demonstrated, then performed." },
    
    // Oral Surgery
    { question: "What is the most common complication of third molar extraction?", options: ["Nerve damage", "Dry socket", "Infection", "Fracture"], correctAnswer: "Dry socket", category: "Oral Surgery", explanation: "Dry socket (alveolar osteitis) is the most common complication, occurring in 2-5% of extractions and up to 30% of impacted third molars." },
    { question: "Which class of impaction is most difficult to extract?", options: ["Class I", "Class II", "Class III", "All equally difficult"], correctAnswer: "Class III", category: "Oral Surgery", explanation: "Class III (Pell & Gregory) indicates the tooth is completely within the ramus, making extraction most difficult." },
    { question: "The inferior alveolar nerve block targets which nerve trunk?", options: ["Lingual nerve only", "Inferior alveolar nerve only", "Both inferior alveolar and lingual", "Mental nerve"], correctAnswer: "Both inferior alveolar and lingual", category: "Oral Surgery", explanation: "The standard IANB anesthetizes both the inferior alveolar and lingual nerves due to their proximity." },
    { question: "How long should a patient bite on gauze after extraction?", options: ["5-10 minutes", "30-45 minutes", "1-2 hours", "Until bleeding stops"], correctAnswer: "30-45 minutes", category: "Oral Surgery", explanation: "Pressure with gauze should be maintained for 30-45 minutes to allow initial clot formation." },
    
    // Orthodontics
    { question: "Angle Class II Division 1 malocclusion is characterized by:", options: ["Retruded mandible with upright incisors", "Protruded maxilla with flared incisors", "Normal molar relationship", "Edge-to-edge incisor relationship"], correctAnswer: "Protruded maxilla with flared incisors", category: "Orthodontics", explanation: "Class II Division 1 features a distal molar relationship with proclined (flared) maxillary incisors." },
    { question: "What is the leeway space?", options: ["Space for permanent incisors", "Difference between primary and permanent molars/premolars", "Space in the midpalate", "Interdental spacing"], correctAnswer: "Difference between primary and permanent molars/premolars", category: "Orthodontics", explanation: "Leeway space is the size difference between primary canines/molars and their permanent successors (about 1.5-2.5mm per side)." },
    { question: "Which stage of tooth development is ideal for starting orthodontic treatment?", options: ["Before root formation", "1/3 root formation", "2/3 root formation", "Complete root formation"], correctAnswer: "2/3 root formation", category: "Orthodontics", explanation: "Teeth with 2/3 root formation are ideal for orthodontic movement - they move well and respond to forces." },
    { question: "What does ANB angle measure?", options: ["Mandibular plane angle", "Anteroposterior jaw relationship", "Vertical skeletal pattern", "Incisor inclination"], correctAnswer: "Anteroposterior jaw relationship", category: "Orthodontics", explanation: "ANB angle measures the anteroposterior relationship between the maxilla (A point) and mandible (B point)." },
    
    // Radiology
    { question: "Which radiograph is best for detecting interproximal caries?", options: ["Periapical", "Bitewing", "Panoramic", "Occlusal"], correctAnswer: "Bitewing", category: "Radiology", explanation: "Bitewing radiographs show the crowns of both arches with overlapping contacts, ideal for caries detection." },
    { question: "A radiolucent periapical lesion likely indicates:", options: ["Condensing osteitis", "Hypercementosis", "Periapical abscess/granuloma", "Cementoblastoma"], correctAnswer: "Periapical abscess/granuloma", category: "Radiology", explanation: "Periapical radiolucency typically indicates pulp necrosis with periapical abscess, granuloma, or cyst." },
    { question: "What is the proper vertical angulation for maxillary premolar periapicals?", options: ["+30 degrees", "+40 degrees", "+20 degrees", "+10 degrees"], correctAnswer: "+40 degrees", category: "Radiology", explanation: "Maxillary premolars require approximately +40 degrees vertical angulation using the paralleling technique." },
    { question: "ALARA principle stands for:", options: ["Always Limit Automatic Radiation Application", "As Low As Reasonably Achievable", "Applied Limiting of All Radiation Areas", "Automatic Low-dose Always Recommended Application"], correctAnswer: "As Low As Reasonably Achievable", category: "Radiology", explanation: "ALARA (As Low As Reasonably Achievable) is the guiding principle for radiation safety in dentistry." },
    
    // Ethics
    { question: "Which ethical principle involves 'do no harm'?", options: ["Beneficence", "Nonmaleficence", "Autonomy", "Justice"], correctAnswer: "Nonmaleficence", category: "Ethics", explanation: "Nonmaleficence is the ethical principle of 'do no harm' - avoiding actions that cause harm to patients." },
    { question: "Informed consent requires:", options: ["Patient's signature only", "Disclosure, understanding, voluntariness, and competence", "Witness presence", "Written documentation only"], correctAnswer: "Disclosure, understanding, voluntariness, and competence", category: "Ethics", explanation: "Valid informed consent requires: disclosure of information, patient understanding, voluntariness, and patient competence." },
    { question: "HIPAA primarily protects:", options: ["Dentist liability", "Patient health information", "Insurance companies", "Government access to records"], correctAnswer: "Patient health information", category: "Ethics", explanation: "HIPAA (Health Insurance Portability and Accountability Act) protects patient health information privacy and security." },
];

interface LearningGamesProps {
    onExit: () => void;
    darkMode?: boolean;
}

type GameMode = 'menu' | 'speed-quiz' | 'streak-challenge' | 'category-master' | 'results';

export const LearningGames: React.FC<LearningGamesProps> = ({ onExit, darkMode = false }) => {
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
                const saved = localStorage.getItem('game_achievements');
                return saved ? JSON.parse(saved) : [];
            } catch {
                return [];
            }
        }
        return [];
    });
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [multiplier, setMultiplier] = useState(1);
    const [comboAnimation, setComboAnimation] = useState(false);
    const [wrongAnimation, setWrongAnimation] = useState(false);
    
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Get all unique categories
    const categories = [...new Set(GAME_QUESTIONS.map(q => q.category))];

    // Load best streak from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedBestStreak = localStorage.getItem('game_best_streak');
            if (savedBestStreak) setBestStreak(parseInt(savedBestStreak));
        }
    }, []);

    // Save achievements to localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('game_achievements', JSON.stringify(unlockedAchievements));
        }
    }, [unlockedAchievements]);

    // Check for new achievements
    const checkAchievements = useCallback((stats: GameStats) => {
        for (const achievement of ACHIEVEMENTS) {
            if (!unlockedAchievements.includes(achievement.id) && achievement.requirement(stats)) {
                setUnlockedAchievements(prev => [...prev, achievement.id]);
                setNewAchievement(achievement);
                setTimeout(() => setNewAchievement(null), 3000);
                break; // Only show one achievement at a time
            }
        }
    }, [unlockedAchievements]);

    // Shuffle array helper
    const shuffleArray = <T,>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Start a game mode
    const startGame = (mode: GameMode, category?: string) => {
        let gameQuestions = [...GAME_QUESTIONS];
        
        if (category) {
            gameQuestions = gameQuestions.filter(q => q.category === category);
            setSelectedCategory(category);
        } else {
            setSelectedCategory(null);
        }

        // Shuffle questions and take a subset
        gameQuestions = shuffleArray(gameQuestions);
        
        // Different question counts for different modes
        const questionCount = mode === 'speed-quiz' ? 10 : mode === 'streak-challenge' ? 20 : 15;
        setQuestions(gameQuestions.slice(0, Math.min(questionCount, gameQuestions.length)));
        
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
            setTimeRemaining(15); // 15 seconds per question
        } else if (mode === 'streak-challenge') {
            setTimeRemaining(10); // 10 seconds per question, more pressure
        } else {
            setTimeRemaining(20); // More time for category master
        }
        
        setQuestionStartTime(Date.now());
        setLastPlayedMode(mode); // Save the game mode for "Play Again"
        setGameMode(mode);
    };

    // Timer effect
    useEffect(() => {
        if (gameMode !== 'menu' && gameMode !== 'results' && !showResult && timeRemaining > 0) {
            timerRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        // Time's up - auto submit wrong answer
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
        // Record the full time for this question (max time since timer ran out)
        const maxTime = gameMode === 'speed-quiz' ? 15 : gameMode === 'streak-challenge' ? 10 : 20;
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

        if (isCorrect) {
            // Calculate points with multiplier and time bonus
            const timeBonus = Math.max(0, Math.floor((timeRemaining / 15) * 10));
            const basePoints = 10;
            const earnedPoints = (basePoints + timeBonus) * multiplier;
            
            setScore(prev => prev + earnedPoints);
            setStreak(prev => {
                const newStreak = prev + 1;
                if (newStreak > bestStreak) {
                    setBestStreak(newStreak);
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('game_best_streak', String(newStreak));
                    }
                }
                return newStreak;
            });
            setCorrectAnswers(prev => prev + 1);
            
            // Update multiplier based on streak
            if (streak >= 9) {
                setMultiplier(4);
            } else if (streak >= 6) {
                setMultiplier(3);
            } else if (streak >= 3) {
                setMultiplier(2);
            }
            
            // Trigger combo animation
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
        const timeBonus = isCorrect ? Math.max(0, Math.floor((timeRemaining / 15) * 10)) : 0;
        const earnedPointsForAchievement = isCorrect ? (basePoints + timeBonus) * multiplier : 0;
        const stats: GameStats = {
            totalScore: score + earnedPointsForAchievement,
            currentStreak: isCorrect ? streak + 1 : 0,
            bestStreak: Math.max(bestStreak, isCorrect ? streak + 1 : bestStreak),
            correctAnswers: correctAnswers + (isCorrect ? 1 : 0),
            totalQuestions: totalAnswered + 1,
            averageTime: (totalTime + answerTime) / (totalAnswered + 1),
            achievements: unlockedAchievements
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
            
            // Reset timer based on game mode
            if (gameMode === 'speed-quiz') {
                setTimeRemaining(15);
            } else if (gameMode === 'streak-challenge') {
                setTimeRemaining(10);
            } else {
                setTimeRemaining(20);
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
        const maxTime = gameMode === 'speed-quiz' ? 15 : gameMode === 'streak-challenge' ? 10 : 20;
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
                        <h1 className={`text-4xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-2 flex items-center justify-center gap-3`}>
                            <span className="text-5xl animate-bounce">🎮</span>
                            Learning Games
                        </h1>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-lg`}>
                            Master dental terminology through fun, engaging games!
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                                Race against the clock! Answer 10 questions as fast as you can.
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
                                <span className={`${darkMode ? 'bg-orange-800' : 'bg-orange-200'} px-2 py-1 rounded`}>20 questions</span>
                            </div>
                        </button>

                        {/* Category Master */}
                        <div className={`p-6 rounded-2xl border-2 text-left ${
                            darkMode 
                                ? 'border-green-700 bg-gradient-to-br from-green-900/50 to-emerald-800/30' 
                                : 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50'
                        }`}>
                            <div className="text-4xl mb-3">📚</div>
                            <h3 className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>Category Master</h3>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                                Focus on a specific topic to master it completely.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => startGame('category-master', cat)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 ${
                                            darkMode 
                                                ? 'bg-green-800 hover:bg-green-700 text-green-200' 
                                                : 'bg-green-200 hover:bg-green-300 text-green-800'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Achievements Section */}
                    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                        <h3 className={`text-lg font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                            <span>🏆</span> Achievements
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
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
                            ← Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Results Screen
    if (gameMode === 'results') {
        const percentage = Math.round((correctAnswers / totalAnswered) * 100);
        const avgTime = totalTime / totalAnswered;
        const isPerfect = correctAnswers === totalAnswered;

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
                        {selectedCategory ? `Category: ${selectedCategory}` : 'Mixed Categories'}
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
                            onClick={() => startGame(lastPlayedMode, selectedCategory || undefined)}
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
                            Exit
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
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in">
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
                                {gameMode === 'speed-quiz' ? '⚡ Speed Quiz' : gameMode === 'streak-challenge' ? '🔥 Streak Challenge' : `📚 ${selectedCategory}`}
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

                    {/* Category Badge */}
                    <div className="flex justify-center mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                            {currentQuestion?.category}
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
                                                ? 'border-red-500 bg-red-100 dark:bg-red-900/50 shake'
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
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .shake {
                    animation: shake 0.3s ease-in-out;
                }
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
