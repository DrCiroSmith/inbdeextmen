import React, { useState } from 'react';
import { PLAYLISTS, INBDE_INFO } from './constants';
import { Playlist, AppState, StudyData, VideoInfo } from './types';
import { PlaylistCard } from './components/PlaylistCard';
import { VideoSelector } from './components/VideoSelector';
import { JsonViewer } from './components/JsonViewer';
import { StudyMode } from './components/StudyMode';
import { ExamInfo } from './components/ExamInfo';
import { generateVideoStudyData, getVideosForPlaylist } from './services/geminiService';

const App: React.FC = () => {
  // Load API key from localStorage or environment
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('gemini_api_key') || process.env.API_KEY || '';
    }
    return process.env.API_KEY || '';
  });
  const [showApiKeyInput, setShowApiKeyInput] = useState(!apiKey);
  const [showExamInfo, setShowExamInfo] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoInfo | null>(null);
  const [generatedData, setGeneratedData] = useState<StudyData | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                M
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Mental Dental Study Platform
              </span>
            </div>
            <div className="flex items-center gap-3">
              {apiKey && (
                <span className="text-xs font-mono bg-green-100 px-3 py-1 rounded-full text-green-700">
                  API Key Set ✓
                </span>
              )}
              <button
                onClick={() => setShowExamInfo(true)}
                className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-1"
              >
                📋 INBDE Info
              </button>
              <button
                onClick={() => setShowApiKeyInput(true)}
                className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                ⚙️ Settings
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Exam Info Modal */}
      {showExamInfo && (
        <ExamInfo onClose={() => setShowExamInfo(false)} />
      )}

      {/* API Key Modal */}
      {showApiKeyInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">API Key Required</h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter your Google Gemini API key to generate study materials.
              <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                Get one here →
              </a>
            </p>
            <input
              type="password"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSaveApiKey()}
              placeholder="AIza..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleSaveApiKey}
                disabled={!tempApiKey.trim()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Save API Key
              </button>
              {apiKey && (
                <button
                  onClick={() => setShowApiKeyInput(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              🔒 Your API key is stored locally in your browser and never sent to our servers.
            </p>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ERROR STATE */}
        {appState === AppState.ERROR && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mt-0.5 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800">Generation Failed</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
              <button onClick={handleBackToVideoSelection} className="mt-2 text-sm font-semibold text-red-700 underline">Try Again</button>
            </div>
          </div>
        )}

        {/* LOADING STATE */}
        {appState === AppState.GENERATING && selectedVideo && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Analyzing Video...</h2>
            <p className="text-gray-500 mb-2 max-w-md text-center">
              The AI is analyzing "{selectedVideo.title}"
            </p>
            <p className="text-sm text-gray-400 text-center">
              Generating flashcards, MCQs, and study materials
            </p>
            <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5 overflow-hidden mt-8">
              <div className="bg-blue-600 h-2.5 rounded-full w-2/3 animate-pulse"></div>
            </div>
            <p className="text-xs text-gray-400 mt-4">This usually takes about 10-20 seconds.</p>
          </div>
        )}

        {/* VIDEO SELECTION STATE */}
        {appState === AppState.VIDEO_SELECTION && selectedPlaylist && (
          <VideoSelector
            playlist={selectedPlaylist}
            videos={getVideosForPlaylist(selectedPlaylist)}
            onSelectVideo={handleSelectVideo}
            onBack={handleBack}
          />
        )}

        {/* STUDY MODE */}
        {appState === AppState.STUDY && generatedData && (
          <StudyMode
            data={generatedData}
            onExit={handleExitStudy}
            onUpdateData={(nextData) => setGeneratedData(nextData)}
          />
        )}

        {/* COMPLETION STATE */}
        {appState === AppState.COMPLETE && generatedData && (
          <div className="space-y-8">
            <div className="flex justify-center gap-4">
              <button
                onClick={handleStartStudy}
                className="bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-green-700 transition-all transform hover:scale-105 flex items-center gap-3"
              >
                <span>🎓</span> Start Studying Now
              </button>
              <button
                onClick={handleBackToVideoSelection}
                className="bg-gray-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-gray-700 transition-all transform hover:scale-105 flex items-center gap-3"
              >
                <span>←</span> Select Another Video
              </button>
              <button
                onClick={handleReanalyze}
                className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center gap-3"
              >
                <span>🔄</span> Re-analyze
              </button>
            </div>
            <JsonViewer data={generatedData} onReset={handleBack} />
          </div>
        )}

        {/* SELECTION STATE */}
        {appState === AppState.IDLE && (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
                Prepare for the INBDE
              </h1>
              <p className="max-w-3xl mx-auto text-lg text-gray-500 mb-6">
                Master the Integrated National Board Dental Examination with comprehensive AI-powered study materials. 
                Generate flashcards, practice questions, and clinical scenarios from Mental Dental videos.
              </p>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="bg-white px-6 py-3 rounded-full shadow-sm border border-gray-200 flex items-center gap-2">
                  <span className="text-2xl">📝</span>
                  <span className="text-gray-700"><strong>{INBDE_INFO.format.totalQuestions}</strong> Questions</span>
                </div>
                <div className="bg-white px-6 py-3 rounded-full shadow-sm border border-gray-200 flex items-center gap-2">
                  <span className="text-2xl">📅</span>
                  <span className="text-gray-700"><strong>{INBDE_INFO.format.days}</strong> Test Days</span>
                </div>
                <div className="bg-white px-6 py-3 rounded-full shadow-sm border border-gray-200 flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  <span className="text-gray-700">Pass Score: <strong>{INBDE_INFO.scoring.passingScore}</strong></span>
                </div>
                <button
                  onClick={() => setShowExamInfo(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-sm flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                  <span>📋</span>
                  <span className="font-semibold">View Full Exam Details</span>
                </button>
              </div>
            </div>

            {/* Study Materials Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">📚 Study Playlists</h2>
              <p className="text-gray-600 mb-6">
                Select a playlist to begin studying. Choose individual videos to generate comprehensive study materials including flashcards, MCQs, and clinical scenarios.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PLAYLISTS.map((playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  onSelect={handleSelectPlaylist}
                  disabled={false}
                />
              ))}
            </div>

            {/* Footer Info */}
            <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl mb-2">🎯</div>
                  <h3 className="font-bold text-gray-900 mb-1">AI-Powered Learning</h3>
                  <p className="text-sm text-gray-600">Generate study materials using Google Gemini AI from Mental Dental videos</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">📖</div>
                  <h3 className="font-bold text-gray-900 mb-1">Comprehensive Coverage</h3>
                  <p className="text-sm text-gray-600">15 playlists covering all INBDE content domains and high-yield topics</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">🏆</div>
                  <h3 className="font-bold text-gray-900 mb-1">Active Learning</h3>
                  <p className="text-sm text-gray-600">Flashcards, MCQs, clinical scenarios, matching exercises, and more</p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;
