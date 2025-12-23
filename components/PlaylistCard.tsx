import React from 'react';
import { Playlist } from '../types';

interface PlaylistCardProps {
  playlist: Playlist;
  onSelect: (playlist: Playlist) => void;
  disabled: boolean;
  darkMode?: boolean;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onSelect, disabled, darkMode = false }) => {
  return (
    <button
      onClick={() => onSelect(playlist)}
      disabled={disabled}
      className={`
        text-left group relative flex flex-col p-6 rounded-2xl border transition-all duration-300
        ${disabled 
          ? `opacity-50 cursor-not-allowed ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}` 
          : darkMode 
            ? 'bg-gray-800 border-gray-700 hover:border-blue-400 hover:shadow-lg hover:-translate-y-1 cursor-pointer'
            : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-lg hover:-translate-y-1 cursor-pointer'
        }
      `}
    >
      <div className="flex items-center justify-between w-full mb-4">
        <div className={`p-3 ${darkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-50 text-blue-600'} rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
        <span className={`text-xs font-semibold ${darkMode ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>Series {playlist.id}</span>
      </div>
      
      <h3 className={`text-lg font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>{playlist.title}</h3>
      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} line-clamp-2`}>{playlist.description}</p>
      
      <div className="mt-4 flex items-center text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
        Generate JSON
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </div>
    </button>
  );
};