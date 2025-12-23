import React from 'react';
import { Playlist } from '../types';

// Average video duration in minutes (based on Mental Dental video lengths)
const AVERAGE_VIDEO_DURATION_MINUTES = 15;

// Video counts for each playlist
const VIDEO_COUNTS: Record<string, number> = {
  'Head and Neck Anatomy': 20,
  'Pharmacology': 10,
  'Oral Medicine': 25,
  'Oral Radiology': 7,
  'Oral Pathology': 20,
  'Biostatistics': 5,
  'Orthodontics': 12,
  'Periodontics': 14,
  'Endodontics': 9,
  'Prosthodontics': 25,
  'Pediatric Dentistry': 10,
  'Oral Surgery': 11,
  'Operative Dentistry': 7,
  'Ethics': 8,
  'Patient Management': 11,
};

// Subject icons mapping
const SUBJECT_ICONS: Record<string, string> = {
  'Head and Neck Anatomy': '🧠',
  'Pharmacology': '💊',
  'Oral Medicine': '🏥',
  'Oral Radiology': '📡',
  'Oral Pathology': '🔬',
  'Biostatistics': '📊',
  'Orthodontics': '😁',
  'Periodontics': '🦷',
  'Endodontics': '🔧',
  'Prosthodontics': '🦿',
  'Pediatric Dentistry': '👶',
  'Oral Surgery': '⚔️',
  'Operative Dentistry': '🛠️',
  'Ethics': '⚖️',
  'Patient Management': '🤝',
};

// Subject color mapping for variety
const SUBJECT_COLORS: Record<string, { bg: string; darkBg: string; text: string; darkText: string; border: string; darkBorder: string }> = {
  'Head and Neck Anatomy': { bg: 'bg-purple-50', darkBg: 'bg-purple-900/30', text: 'text-purple-600', darkText: 'text-purple-400', border: 'border-purple-200', darkBorder: 'border-purple-800' },
  'Pharmacology': { bg: 'bg-blue-50', darkBg: 'bg-blue-900/30', text: 'text-blue-600', darkText: 'text-blue-400', border: 'border-blue-200', darkBorder: 'border-blue-800' },
  'Oral Medicine': { bg: 'bg-red-50', darkBg: 'bg-red-900/30', text: 'text-red-600', darkText: 'text-red-400', border: 'border-red-200', darkBorder: 'border-red-800' },
  'Oral Radiology': { bg: 'bg-cyan-50', darkBg: 'bg-cyan-900/30', text: 'text-cyan-600', darkText: 'text-cyan-400', border: 'border-cyan-200', darkBorder: 'border-cyan-800' },
  'Oral Pathology': { bg: 'bg-pink-50', darkBg: 'bg-pink-900/30', text: 'text-pink-600', darkText: 'text-pink-400', border: 'border-pink-200', darkBorder: 'border-pink-800' },
  'Biostatistics': { bg: 'bg-green-50', darkBg: 'bg-green-900/30', text: 'text-green-600', darkText: 'text-green-400', border: 'border-green-200', darkBorder: 'border-green-800' },
  'Orthodontics': { bg: 'bg-indigo-50', darkBg: 'bg-indigo-900/30', text: 'text-indigo-600', darkText: 'text-indigo-400', border: 'border-indigo-200', darkBorder: 'border-indigo-800' },
  'Periodontics': { bg: 'bg-teal-50', darkBg: 'bg-teal-900/30', text: 'text-teal-600', darkText: 'text-teal-400', border: 'border-teal-200', darkBorder: 'border-teal-800' },
  'Endodontics': { bg: 'bg-orange-50', darkBg: 'bg-orange-900/30', text: 'text-orange-600', darkText: 'text-orange-400', border: 'border-orange-200', darkBorder: 'border-orange-800' },
  'Prosthodontics': { bg: 'bg-violet-50', darkBg: 'bg-violet-900/30', text: 'text-violet-600', darkText: 'text-violet-400', border: 'border-violet-200', darkBorder: 'border-violet-800' },
  'Pediatric Dentistry': { bg: 'bg-yellow-50', darkBg: 'bg-yellow-900/30', text: 'text-yellow-600', darkText: 'text-yellow-400', border: 'border-yellow-200', darkBorder: 'border-yellow-800' },
  'Oral Surgery': { bg: 'bg-rose-50', darkBg: 'bg-rose-900/30', text: 'text-rose-600', darkText: 'text-rose-400', border: 'border-rose-200', darkBorder: 'border-rose-800' },
  'Operative Dentistry': { bg: 'bg-amber-50', darkBg: 'bg-amber-900/30', text: 'text-amber-600', darkText: 'text-amber-400', border: 'border-amber-200', darkBorder: 'border-amber-800' },
  'Ethics': { bg: 'bg-slate-50', darkBg: 'bg-slate-900/30', text: 'text-slate-600', darkText: 'text-slate-400', border: 'border-slate-200', darkBorder: 'border-slate-700' },
  'Patient Management': { bg: 'bg-emerald-50', darkBg: 'bg-emerald-900/30', text: 'text-emerald-600', darkText: 'text-emerald-400', border: 'border-emerald-200', darkBorder: 'border-emerald-800' },
};

interface PlaylistCardProps {
  playlist: Playlist;
  onSelect: (playlist: Playlist) => void;
  disabled: boolean;
  darkMode?: boolean;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onSelect, disabled, darkMode = false }) => {
  const videoCount = VIDEO_COUNTS[playlist.title] || 0;
  const icon = SUBJECT_ICONS[playlist.title] || '📚';
  const colors = SUBJECT_COLORS[playlist.title] || SUBJECT_COLORS['Ethics'];

  return (
    <button
      onClick={() => onSelect(playlist)}
      disabled={disabled}
      className={`
        text-left group relative flex flex-col p-6 rounded-2xl border-2 transition-all duration-300 animate-fade-in
        ${disabled 
          ? `opacity-50 cursor-not-allowed ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}` 
          : darkMode 
            ? `bg-gray-800 ${colors.darkBorder} hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 cursor-pointer`
            : `bg-white ${colors.border} hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 cursor-pointer`
        }
      `}
    >
      {/* Icon and Series Badge */}
      <div className="flex items-center justify-between w-full mb-4">
        <div className={`p-3 ${darkMode ? colors.darkBg : colors.bg} ${darkMode ? colors.darkText : colors.text} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} px-2 py-1 rounded-full`}>
            {videoCount} videos
          </span>
          <span className={`text-xs font-semibold ${darkMode ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
            #{playlist.id}
          </span>
        </div>
      </div>
      
      {/* Title */}
      <h3 className={`text-lg font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-2 group-hover:text-blue-600 transition-colors`}>
        {playlist.title}
      </h3>
      
      {/* Description */}
      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} line-clamp-3 flex-grow`}>
        {playlist.description}
      </p>
      
      {/* Bottom Action Indicator */}
      <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'} flex items-center justify-between`}>
        <div className="flex items-center gap-2 text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span>Start Learning</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </div>
        <div className={`flex items-center gap-1 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span>~{Math.round(videoCount * AVERAGE_VIDEO_DURATION_MINUTES)} min</span>
        </div>
      </div>
    </button>
  );
};