import React, { useState } from 'react';
import { PLAYLISTS } from './constants';
import { Playlist, AppState, StudyData } from './types';
import { PlaylistCard } from './components/PlaylistCard';
import { JsonViewer } from './components/JsonViewer';
import { generatePlaylistData } from './services/geminiService';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState(process.env.API_KEY || '');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [generatedData, setGeneratedData] = useState<StudyData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelectPlaylist = async (playlist: Playlist) => {
    if (!apiKey) {
      alert("Please ensure your API Key is configured in the environment.");
      return;
    }

    setSelectedPlaylist(playlist);
    setAppState(AppState.GENERATING);
    setError(null);

    try {
      const data = await generatePlaylistData(apiKey, playlist);
      setGeneratedData(data);
      setAppState(AppState.COMPLETE);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setGeneratedData(null);
    setSelectedPlaylist(null);
    setError(null);
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
                Mental Dental Extractor
              </span>
            </div>
            <div className="flex items-center">
               <span className="text-xs font-mono bg-gray-100 px-3 py-1 rounded-full text-gray-500">
                 INBDE Builder Ready
               </span>
            </div>
          </div>
        </div>
      </nav>

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
               <button onClick={handleReset} className="mt-2 text-sm font-semibold text-red-700 underline">Try Again</button>
             </div>
           </div>
        )}

        {/* LOADING STATE */}
        {appState === AppState.GENERATING && selectedPlaylist && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Analyzing Playlist...</h2>
            <p className="text-gray-500 mb-8 max-w-md text-center">
              The AI is currently watching "{selectedPlaylist.title}" and extracting flashcards, MCQs, and True/False questions.
            </p>
            <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5 overflow-hidden">
               <div className="bg-blue-600 h-2.5 rounded-full w-2/3 animate-pulse"></div>
            </div>
            <p className="text-xs text-gray-400 mt-4">This usually takes about 10-20 seconds.</p>
          </div>
        )}

        {/* COMPLETION STATE */}
        {appState === AppState.COMPLETE && generatedData && (
          <JsonViewer data={generatedData} onReset={handleReset} />
        )}

        {/* SELECTION STATE */}
        {appState === AppState.IDLE && (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
                Prepare for the INBDE
              </h1>
              <p className="max-w-2xl mx-auto text-lg text-gray-500">
                Select a Mental Dental playlist below to generate a comprehensive JSON study package for your Antigravity builder project.
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
          </>
        )}
      </main>
    </div>
  );
};

export default App;