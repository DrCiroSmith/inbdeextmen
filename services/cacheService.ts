import { StudyData, Flashcard, MultipleChoice, TrueFalse } from '../types';

const CACHE_PREFIX = 'mental_dental_cache_';
const CACHE_VERSION = 'v1';

// Helper to generate cache key from video URL
const getCacheKey = (videoUrl: string): string => {
    const videoId = videoUrl.split('v=')[1]?.split('&')[0] || videoUrl;
    return `${CACHE_PREFIX}${CACHE_VERSION}_${videoId}`;
};

// Get cached study data for a video
export const getCachedStudyData = (videoUrl: string): StudyData | null => {
    try {
        const key = getCacheKey(videoUrl);
        const cached = localStorage.getItem(key);
        if (!cached) return null;

        const data = JSON.parse(cached) as StudyData;
        return data;
    } catch (error) {
        console.error('Error reading from cache:', error);
        return null;
    }
};

// Save study data to cache
export const saveCachedStudyData = (videoUrl: string, data: StudyData): void => {
    try {
        const key = getCacheKey(videoUrl);
        const dataWithMeta = {
            ...data,
            isCached: true,
            generatedAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(key, JSON.stringify(dataWithMeta));
    } catch (error) {
        console.error('Error saving to cache:', error);
        // If localStorage is full, try to clear old entries
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
            console.warn('LocalStorage quota exceeded. Consider clearing old cache.');
        }
    }
};

// Check if two strings are similar (case-insensitive, trimmed)
const isSimilar = (str1: string, str2: string): boolean => {
    return str1.trim().toLowerCase() === str2.trim().toLowerCase();
};

// Deduplicate flashcards
const deduplicateFlashcards = (existing: Flashcard[], newCards: Flashcard[]): Flashcard[] => {
    const existingFronts = new Set(existing.map(f => f.front.trim().toLowerCase()));
    const unique = newCards.filter(card => !existingFronts.has(card.front.trim().toLowerCase()));
    return [...existing, ...unique];
};

// Deduplicate multiple choice questions
const deduplicateMCQs = (existing: MultipleChoice[], newMCQs: MultipleChoice[]): MultipleChoice[] => {
    const existingQuestions = new Set(existing.map(q => q.question.trim().toLowerCase()));
    const unique = newMCQs.filter(q => !existingQuestions.has(q.question.trim().toLowerCase()));
    return [...existing, ...unique];
};

// Deduplicate true/false questions
const deduplicateTrueFalse = (existing: TrueFalse[], newTF: TrueFalse[]): TrueFalse[] => {
    const existingStatements = new Set(existing.map(t => t.statement.trim().toLowerCase()));
    const unique = newTF.filter(t => !existingStatements.has(t.statement.trim().toLowerCase()));
    return [...existing, ...unique];
};

// Merge new study data with existing cached data (deduplicating)
export const mergeStudyData = (existing: StudyData, newData: StudyData): StudyData => {
    return {
        ...existing,
        summary: newData.summary, // Always use the latest summary
        flashcards: deduplicateFlashcards(existing.flashcards, newData.flashcards),
        multipleChoice: deduplicateMCQs(existing.multipleChoice, newData.multipleChoice),
        trueFalse: deduplicateTrueFalse(existing.trueFalse, newData.trueFalse),
        lastUpdated: new Date().toISOString(),
        generationCount: (existing.generationCount || 1) + 1
    };
};

// Get all cached video URLs (for showing indicators)
export const getAllCachedVideoUrls = (): Set<string> => {
    const cachedUrls = new Set<string>();

    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(CACHE_PREFIX + CACHE_VERSION)) {
                // Extract video ID from key and try to get the full URL from cached data
                const cached = localStorage.getItem(key);
                if (cached) {
                    const data = JSON.parse(cached) as StudyData;
                    if (data.videoUrl) {
                        cachedUrls.add(data.videoUrl);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error scanning cache:', error);
    }

    return cachedUrls;
};

// Clear cache for a specific video
export const clearVideoCache = (videoUrl: string): void => {
    try {
        const key = getCacheKey(videoUrl);
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error clearing cache:', error);
    }
};

// Clear all cached study data
export const clearAllCache = (): void => {
    try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(CACHE_PREFIX)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
        console.error('Error clearing all cache:', error);
    }
};
