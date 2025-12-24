import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PLAYLISTS, INBDE_INFO } from './constants';
import { Playlist, AppState, StudyData, VideoInfo } from './types';
import { PlaylistCard } from './components/PlaylistCard';
import { VideoSelector } from './components/VideoSelector';
import { JsonViewer } from './components/JsonViewer';
import { StudyMode } from './components/StudyMode';
import { ExamInfo } from './components/ExamInfo';
import { MockExam } from './components/MockExam';
import { LearningGames } from './components/LearningGames';
import { generateVideoStudyData, getVideosForPlaylist } from './services/geminiService';
import { getAllCachedVideoUrls } from './services/cacheService';

// Calculate total videos count once at module load (playlists are static)
const TOTAL_VIDEOS = (() => {
  return PLAYLISTS.reduce((acc, playlist) => {
    const videos = getVideosForPlaylist(playlist);
    return acc + videos.length;
  }, 0);
})();

const App: React.FC = () => {
  // Dark mode state with localStorage persistence
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dark_mode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [studyProgress, setStudyProgress] = useState<{ videosStudied: number; totalVideos: number }>({ videosStudied: 0, totalVideos: TOTAL_VIDEOS });

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('dark_mode', String(darkMode));
  }, [darkMode]);

  // Function to update study progress from cache
  const updateStudyProgress = useCallback(() => {
    const cachedUrls = getAllCachedVideoUrls();
    setStudyProgress({
      videosStudied: cachedUrls.size,
      totalVideos: TOTAL_VIDEOS
    });
  }, []);

  // Calculate study progress from cached videos on mount
  useEffect(() => {
    updateStudyProgress();
  }, [updateStudyProgress]);

  // Load API key from localStorage or environment
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('gemini_api_key') || process.env.API_KEY || '';
    }
    return process.env.API_KEY || '';
  });
  const [showApiKeyInput, setShowApiKeyInput] = useState(!apiKey);
  const [showExamInfo, setShowExamInfo] = useState(false);
  const [showMockExam, setShowMockExam] = useState(false);
  const [showLearningGames, setShowLearningGames] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoInfo | null>(null);
  const [generatedData, setGeneratedData] = useState<StudyData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Filter playlists based on search query
  const filteredPlaylists = useMemo(() => {
    if (!searchQuery.trim()) return PLAYLISTS;
    const query = searchQuery.toLowerCase();
    return PLAYLISTS.filter(playlist => 
      playlist.title.toLowerCase().includes(query) || 
      playlist.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('gemini_api_key', tempApiKey.trim());
      }
      setApiKey(tempApiKey.trim());
      setShowApiKeyInput(false);
      setTempApiKey('');
    }
  };

  const handleSelectPlaylist = (playlist: Playlist) => {
    if (!apiKey) {
      setShowApiKeyInput(true);
      return;
    }

    setSelectedPlaylist(playlist);
    setAppState(AppState.VIDEO_SELECTION);
  };

  const handleSelectVideo = async (video: VideoInfo) => {
    if (!selectedPlaylist) return;

    setSelectedVideo(video);
    setAppState(AppState.GENERATING);
    setError(null);

    try {
      const data = await generateVideoStudyData(apiKey, selectedPlaylist, video);
      setGeneratedData(data);
      setAppState(AppState.COMPLETE);
      // Update progress after successful generation
      updateStudyProgress();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setAppState(AppState.ERROR);
    }
  };

  const handleBack = () => {
    setAppState(AppState.IDLE);
    setGeneratedData(null);
    setSelectedPlaylist(null);
    setSelectedVideo(null);
    setError(null);
  };

  const handleBackToVideoSelection = () => {
    setAppState(AppState.VIDEO_SELECTION);
    setGeneratedData(null);
    setSelectedVideo(null);
    setError(null);
  };

  const handleStartStudy = () => {
    setAppState(AppState.STUDY);
  };

  // Trigger a fresh generation for the currently selected video, bypassing any cached data
  const handleReanalyze = async () => {
    if (!apiKey || !selectedPlaylist || !selectedVideo) return;
    setAppState(AppState.GENERATING);
    setError(null);

    try {
      const data = await generateVideoStudyData(apiKey, selectedPlaylist, selectedVideo, true);
      setGeneratedData(data);
      setAppState(AppState.COMPLETE);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setAppState(AppState.ERROR);
    }
  };

  const handleExitStudy = () => {
    setAppState(AppState.COMPLETE);
  };

  const progressPercentage = Math.round((studyProgress.videosStudied / studyProgress.totalVideos) * 100);

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'} font-sans`}>
      {/* Navbar - Enhanced with glassmorphism - Only shown on main page */}
      {appState === AppState.IDLE && (
      <nav className={`${darkMode ? 'bg-gray-900/80 border-gray-700/50' : 'bg-white/80 border-gray-200/50'} border-b sticky top-0 z-50 backdrop-blur-xl shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow cursor-pointer group">
                <span className="text-xl group-hover:animate-bounce">🦷</span>
              </div>
              <span className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                INBDE Study Platform
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {apiKey && (
                <span className={`hidden sm:flex text-xs font-mono ${darkMode ? 'bg-green-900/50 text-green-300 border-green-700/50' : 'bg-green-100 text-green-700 border-green-200'} px-3 py-1.5 rounded-full items-center gap-1.5 border`}>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  API Ready
                </span>
              )}
              {/* Dark Mode Toggle - Enhanced */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2.5 rounded-xl transition-all duration-300 ${darkMode ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700 hover:text-yellow-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'} hover:scale-105`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setShowMockExam(true)}
                className="text-sm bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-green-500 hover:to-emerald-500 transition-all shadow-md hover:shadow-lg hover:shadow-green-500/25 flex items-center gap-1.5 hover:scale-105"
              >
                <span className="text-base">🏆</span> 
                <span className="hidden sm:inline">Mock Exam</span>
              </button>
              <button
                onClick={() => setShowLearningGames(true)}
                className="text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 transition-all shadow-md hover:shadow-lg hover:shadow-purple-500/25 flex items-center gap-1.5 hover:scale-105"
              >
                <span className="text-base">🎮</span> 
                <span className="hidden sm:inline">Games</span>
              </button>
              <button
                onClick={() => setShowExamInfo(true)}
                className={`hidden sm:flex text-sm ${darkMode ? 'text-gray-300 hover:text-blue-400 bg-gray-800 hover:bg-gray-700' : 'text-gray-600 hover:text-blue-600 bg-gray-100 hover:bg-gray-200'} font-medium transition-all items-center gap-1.5 px-3 py-2 rounded-xl hover:scale-105`}
              >
                📋 Info
              </button>
              <button
                onClick={() => setShowApiKeyInput(true)}
                className={`p-2.5 rounded-xl ${darkMode ? 'text-gray-300 hover:text-blue-400 bg-gray-800 hover:bg-gray-700' : 'text-gray-600 hover:text-blue-600 bg-gray-100 hover:bg-gray-200'} transition-all hover:scale-105`}
                aria-label="Settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
      )}

      {/* Mock Exam Mode */}
      {showMockExam && (
        <div className={`fixed inset-0 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} z-40 overflow-auto animate-fade-in`}>
          <MockExam onExit={() => setShowMockExam(false)} darkMode={darkMode} />
        </div>
      )}

      {/* Learning Games Mode */}
      {showLearningGames && (
        <div className={`fixed inset-0 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} z-40 overflow-auto animate-fade-in`}>
          <LearningGames onExit={() => setShowLearningGames(false)} darkMode={darkMode} />
        </div>
      )}

      {/* Exam Info Modal */}
      {showExamInfo && (
        <ExamInfo onClose={() => setShowExamInfo(false)} darkMode={darkMode} />
      )}

      {/* API Key Modal */}
      {showApiKeyInput && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>API Key Required</h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Power up your study materials</p>
              </div>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              Enter your Google Gemini API key to generate AI-powered study materials.
              <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1 font-medium">
                Get one free →
              </a>
            </p>
            <input
              type="password"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSaveApiKey()}
              placeholder="AIza..."
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-200 bg-gray-50'}`}
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={handleSaveApiKey}
                disabled={!tempApiKey.trim()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-md"
              >
                Save API Key
              </button>
              {apiKey && (
                <button
                  onClick={() => setShowApiKeyInput(false)}
                  className={`px-6 py-3 rounded-xl ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} font-semibold transition-colors`}
                >
                  Cancel
                </button>
              )}
            </div>
            <div className={`flex items-center gap-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-4`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Stored locally in your browser. Never sent to our servers.
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full">

        {/* ERROR STATE */}
        {appState === AppState.ERROR && (
          <div className={`mb-8 p-4 ${darkMode ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200'} border rounded-xl flex items-start animate-slide-up`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className={`text-sm font-medium ${darkMode ? 'text-red-300' : 'text-red-800'}`}>Generation Failed</h3>
              <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'} mt-1`}>{error}</p>
              <button onClick={handleBackToVideoSelection} className={`mt-2 text-sm font-semibold ${darkMode ? 'text-red-300' : 'text-red-700'} underline hover:no-underline`}>Try Again</button>
            </div>
          </div>
        )}

        {/* LOADING STATE */}
        {appState === AppState.GENERATING && selectedVideo && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="relative w-24 h-24 mb-8">
              <div className={`absolute inset-0 border-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-full`}></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">🦷</span>
              </div>
            </div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-2`}>Analyzing Video...</h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2 max-w-md text-center px-4`}>
              The AI is analyzing "<span className="font-medium">{selectedVideo.title}</span>"
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'} text-center`}>
              Generating flashcards, MCQs, and study materials
            </p>
            <div className={`w-full max-w-md ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 overflow-hidden mt-8`}>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full animate-pulse" style={{ width: '66%' }}></div>
            </div>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-4`}>This usually takes about 10-20 seconds.</p>
          </div>
        )}

        {/* VIDEO SELECTION STATE */}
        {appState === AppState.VIDEO_SELECTION && selectedPlaylist && (
          <div className="animate-slide-up">
            <VideoSelector
              playlist={selectedPlaylist}
              videos={getVideosForPlaylist(selectedPlaylist)}
              onSelectVideo={handleSelectVideo}
              onBack={handleBack}
              darkMode={darkMode}
            />
          </div>
        )}

        {/* STUDY MODE */}
        {appState === AppState.STUDY && generatedData && (
          <div className="animate-fade-in">
            <StudyMode
              data={generatedData}
              onExit={handleExitStudy}
              onUpdateData={(nextData) => setGeneratedData(nextData)}
              darkMode={darkMode}
            />
          </div>
        )}

        {/* COMPLETION STATE */}
        {appState === AppState.COMPLETE && generatedData && (
          <div className="space-y-8 animate-slide-up">
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <button
                onClick={handleStartStudy}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 flex items-center gap-2 sm:gap-3"
              >
                <span>🎓</span> Start Studying
              </button>
              <button
                onClick={handleBackToVideoSelection}
                className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-600 hover:bg-gray-700'} text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 sm:gap-3`}
              >
                <span>←</span> <span className="hidden sm:inline">Select Another</span><span className="sm:hidden">Back</span>
              </button>
              <button
                onClick={handleReanalyze}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center gap-2 sm:gap-3"
              >
                <span>🔄</span> <span className="hidden sm:inline">Re-analyze</span><span className="sm:hidden">Refresh</span>
              </button>
            </div>
            <JsonViewer data={generatedData} onReset={handleBack} darkMode={darkMode} />
          </div>
        )}

        {/* SELECTION STATE */}
        {appState === AppState.IDLE && (
          <>
            {/* Hero Section - Enhanced with gradient background */}
            <div className="text-center mb-10 sm:mb-12 animate-fade-in relative">
              {/* Background decorative elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute -top-20 -left-20 w-72 h-72 ${darkMode ? 'bg-blue-600/10' : 'bg-blue-400/20'} rounded-full blur-3xl`}></div>
                <div className={`absolute -top-10 -right-10 w-64 h-64 ${darkMode ? 'bg-purple-600/10' : 'bg-purple-400/20'} rounded-full blur-3xl`}></div>
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 ${darkMode ? 'bg-indigo-600/5' : 'bg-indigo-400/10'} rounded-full blur-3xl`}></div>
              </div>
              
              {/* Floating decorative elements with enhanced animations */}
              <div className="relative">
                <div className="absolute -top-8 left-1/4 text-5xl opacity-20 animate-float hidden md:block select-none">🦷</div>
                <div className="absolute -top-4 right-1/4 text-4xl opacity-20 animate-float-delayed hidden md:block select-none">📚</div>
                <div className="absolute top-12 left-1/6 text-3xl opacity-10 animate-float hidden lg:block select-none">✨</div>
                <div className="absolute top-8 right-1/6 text-3xl opacity-10 animate-float-delayed hidden lg:block select-none">💡</div>
              </div>
              
              {/* Main heading with animated gradient */}
              <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold ${darkMode ? 'text-gray-100' : 'text-gray-900'} tracking-tight mb-4 relative`}>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-[length:200%_auto] animate-gradient">
                  Ace the INBDE
                </span>
              </h1>
              
              {/* Animated underline */}
              <div className="flex justify-center mb-6">
                <div className={`h-1 w-24 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-pulse`}></div>
              </div>
              
              <p className={`max-w-2xl mx-auto text-base sm:text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-8 px-4 relative`}>
                Master the Integrated National Board Dental Examination with AI-powered study materials. 
                Flashcards, practice questions, and clinical scenarios at your fingertips.
              </p>
              
              {/* Quick Stats - Enhanced with hover effects */}
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6 px-2">
                <div className={`${darkMode ? 'bg-gray-800/80 border-gray-700 hover:border-blue-500' : 'bg-white/80 border-gray-200 hover:border-blue-400'} backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-sm border-2 flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg group cursor-default`}>
                  <span className="text-xl sm:text-2xl group-hover:animate-bounce">📝</span>
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm sm:text-base`}><strong className="text-blue-600">{INBDE_INFO.format.totalQuestions}</strong> Questions</span>
                </div>
                <div className={`${darkMode ? 'bg-gray-800/80 border-gray-700 hover:border-green-500' : 'bg-white/80 border-gray-200 hover:border-green-400'} backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-sm border-2 flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg group cursor-default`}>
                  <span className="text-xl sm:text-2xl group-hover:animate-bounce">📅</span>
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm sm:text-base`}><strong className="text-green-600">{INBDE_INFO.format.days}</strong> Test Days</span>
                </div>
                <div className={`${darkMode ? 'bg-gray-800/80 border-gray-700 hover:border-purple-500' : 'bg-white/80 border-gray-200 hover:border-purple-400'} backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-sm border-2 flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg group cursor-default`}>
                  <span className="text-xl sm:text-2xl group-hover:animate-bounce">🎯</span>
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm sm:text-base`}>Pass: <strong className="text-purple-600">{INBDE_INFO.scoring.passingScore}</strong></span>
                </div>
                <button
                  onClick={() => setShowExamInfo(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg flex items-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all text-sm sm:text-base hover:scale-105 hover:shadow-xl group"
                >
                  <span className="group-hover:rotate-12 transition-transform">📋</span>
                  <span className="font-semibold">Exam Details</span>
                </button>
              </div>

              {/* Study Progress Bar - Enhanced */}
              {studyProgress.videosStudied > 0 && (
                <div className={`max-w-md mx-auto mb-6 ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm rounded-2xl p-5 shadow-lg border-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-all hover:shadow-xl`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
                      <span className="animate-pulse">📊</span> Your Progress
                    </span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{studyProgress.videosStudied}/{studyProgress.totalVideos} videos</span>
                  </div>
                  <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3 overflow-hidden`}>
                    <div 
                      className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                      style={{ width: `${progressPercentage}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent shimmer"></div>
                    </div>
                  </div>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-2 flex items-center justify-center gap-1`}>
                    <span className="font-semibold text-green-600">{progressPercentage}%</span> complete - Keep going! 
                    <span className="animate-bounce inline-block">💪</span>
                  </p>
                </div>
              )}

              {/* Mock Exam CTA - Enhanced with glow effect */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 px-4">
                <button
                  onClick={() => setShowMockExam(true)}
                  className="w-full sm:w-auto bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white px-8 sm:px-10 py-5 rounded-2xl shadow-xl flex items-center justify-center sm:justify-start gap-4 hover:from-green-500 hover:via-emerald-500 hover:to-teal-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 group relative overflow-hidden"
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  
                  <span className="text-3xl sm:text-4xl group-hover:animate-bounce relative z-10">🏆</span>
                  <div className="text-left relative z-10">
                    <span className="font-bold text-lg sm:text-xl block">Take Mock Exam</span>
                    <span className="text-sm opacity-90">Timed practice with real-world questions</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 group-hover:translate-x-2 transition-transform relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>

                {/* Learning Games CTA */}
                <button
                  onClick={() => setShowLearningGames(true)}
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white px-8 sm:px-10 py-5 rounded-2xl shadow-xl flex items-center justify-center sm:justify-start gap-4 hover:from-purple-500 hover:via-pink-500 hover:to-rose-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 group relative overflow-hidden"
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  
                  <span className="text-3xl sm:text-4xl group-hover:animate-bounce relative z-10">🎮</span>
                  <div className="text-left relative z-10">
                    <span className="font-bold text-lg sm:text-xl block">Play Learning Games</span>
                    <span className="text-sm opacity-90">Fun quizzes with achievements & streaks</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 group-hover:translate-x-2 transition-transform relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Study Materials Section Header with Search - Enhanced */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h2 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} flex items-center gap-2`}>
                    <span className="animate-bounce">📚</span> Study Playlists
                  </h2>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm sm:text-base mt-1`}>
                    <span className="font-semibold text-blue-600">{PLAYLISTS.length}</span> playlists • <span className="font-semibold text-green-600">{TOTAL_VIDEOS}</span> videos
                  </p>
                </div>
                
                {/* Search Input - Enhanced */}
                <div className="relative w-full sm:w-80 group">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search playlists..."
                    className={`w-full pl-11 pr-10 py-3 rounded-2xl border-2 focus:outline-none focus:ring-4 transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-800/80 border-gray-700 text-gray-100 placeholder-gray-500 focus:ring-blue-500/20 focus:border-blue-500' 
                        : 'bg-white/80 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-blue-500/20 focus:border-blue-500'
                    } backdrop-blur-sm shadow-sm hover:shadow-md`}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${searchQuery ? 'text-blue-500' : darkMode ? 'text-gray-500' : 'text-gray-400'}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all hover:scale-110 ${darkMode ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Search Results Info */}
              {searchQuery && (
                <div className={`text-sm ${darkMode ? 'text-gray-400 bg-gray-800/50' : 'text-gray-500 bg-gray-100/50'} px-4 py-2 rounded-lg inline-block`}>
                  {filteredPlaylists.length === 0 
                    ? <span>No playlists found for "<span className="font-semibold text-red-500">{searchQuery}</span>"</span>
                    : <span>Showing <span className="font-semibold text-blue-600">{filteredPlaylists.length}</span> playlist{filteredPlaylists.length !== 1 ? 's' : ''} matching "<span className="font-semibold">{searchQuery}</span>"</span>
                  }
                </div>
              )}
            </div>

            {/* Playlist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredPlaylists.map((playlist, index) => (
                <div 
                  key={playlist.id} 
                  style={{ 
                    animationDelay: `${index * 75}ms`,
                    animationFillMode: 'forwards'
                  }} 
                  className="animate-slide-up"
                >
                  <PlaylistCard
                    playlist={playlist}
                    onSelect={handleSelectPlaylist}
                    disabled={false}
                    darkMode={darkMode}
                  />
                </div>
              ))}
            </div>

            {/* No Results Message */}
            {filteredPlaylists.length === 0 && (
              <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <span className="text-4xl mb-4 block">🔍</span>
                <p className="text-lg font-medium">No playlists found</p>
                <p className="text-sm">Try a different search term</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-blue-600 hover:underline font-medium"
                >
                  Clear search
                </button>
              </div>
            )}

            {/* Features Section - Enhanced with staggered animations */}
            <div className={`mt-12 sm:mt-16 ${darkMode ? 'bg-gradient-to-br from-gray-800/80 via-gray-800/60 to-gray-900/80' : 'bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50'} rounded-3xl p-6 sm:p-10 border ${darkMode ? 'border-gray-700/50' : 'border-blue-100'} backdrop-blur-sm relative overflow-hidden`}>
              {/* Background pattern */}
              <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none"></div>
              
              <div className="relative">
                <h3 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} text-center mb-2`}>
                  Why Choose Our Platform?
                </h3>
                <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-8 text-sm`}>
                  Everything you need to ace the INBDE in one place
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className={`${darkMode ? 'bg-gray-800/70 hover:bg-gray-800 border-gray-700/50 hover:border-blue-500/50' : 'bg-white/80 hover:bg-white border-white/50 hover:border-blue-300'} backdrop-blur-sm rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl group border card-shine`}>
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-shadow">
                      <span className="text-3xl group-hover:animate-bounce">🤖</span>
                    </div>
                    <h4 className={`font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-2 text-lg`}>AI-Powered</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Google Gemini AI generates personalized study materials</p>
                  </div>
                  <div className={`${darkMode ? 'bg-gray-800/70 hover:bg-gray-800 border-gray-700/50 hover:border-green-500/50' : 'bg-white/80 hover:bg-white border-white/50 hover:border-green-300'} backdrop-blur-sm rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl group border card-shine`}>
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-green-500/25 transition-shadow">
                      <span className="text-3xl group-hover:animate-bounce">📖</span>
                    </div>
                    <h4 className={`font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-2 text-lg`}>Comprehensive</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>15 playlists covering all INBDE domains</p>
                  </div>
                  <div className={`${darkMode ? 'bg-gray-800/70 hover:bg-gray-800 border-gray-700/50 hover:border-purple-500/50' : 'bg-white/80 hover:bg-white border-white/50 hover:border-purple-300'} backdrop-blur-sm rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl group border card-shine`}>
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-shadow">
                      <span className="text-3xl group-hover:animate-bounce">🎯</span>
                    </div>
                    <h4 className={`font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-2 text-lg`}>Active Learning</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Flashcards, MCQs, clinical scenarios & more</p>
                  </div>
                  <div className={`${darkMode ? 'bg-gray-800/70 hover:bg-gray-800 border-gray-700/50 hover:border-orange-500/50' : 'bg-white/80 hover:bg-white border-white/50 hover:border-orange-300'} backdrop-blur-sm rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl group border card-shine`}>
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-orange-500/25 transition-shadow">
                      <span className="text-3xl group-hover:animate-bounce">💾</span>
                    </div>
                    <h4 className={`font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-2 text-lg`}>Offline Ready</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Download & cache materials for offline study</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className={`mt-auto ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center text-white text-sm">
                  🦷
                </div>
                <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  INBDE Study Platform
                </span>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                AI-powered study materials for dental students preparing for the INBDE.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-3`}>Quick Links</h4>
              <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <li>
                  <button onClick={() => setShowExamInfo(true)} className="hover:text-blue-600 transition-colors">
                    📋 Exam Information
                  </button>
                </li>
                <li>
                  <button onClick={() => setShowMockExam(true)} className="hover:text-blue-600 transition-colors">
                    🏆 Mock Exam
                  </button>
                </li>
                <li>
                  <button onClick={() => setShowLearningGames(true)} className="hover:text-blue-600 transition-colors">
                    🎮 Learning Games
                  </button>
                </li>
                <li>
                  <button onClick={() => setShowApiKeyInput(true)} className="hover:text-blue-600 transition-colors">
                    ⚙️ Settings
                  </button>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-3`}>Resources</h4>
              <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <li>
                  <a href="https://www.ada.org/education/testing/inbde" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                    ADA Official INBDE
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com/@MentalDental" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                    Mental Dental YouTube
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                    Get Gemini API Key
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>

            {/* Study Stats */}
            <div>
              <h4 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-3`}>Platform Stats</h4>
              <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">📚</span> {PLAYLISTS.length} Study Playlists
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">🎬</span> {TOTAL_VIDEOS} Video Lessons
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">🤖</span> Powered by Gemini AI
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className={`mt-8 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'} text-center sm:text-left`}>
                Made with ❤️ for dental students • Content based on Mental Dental by Dr. Ryan
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                © {new Date().getFullYear()} INBDE Study Platform
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
