import React, { useState } from 'react';
import { StudyData } from '../types';

interface JsonViewerProps {
  data: StudyData;
  onReset: () => void;
  darkMode?: boolean;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ data, onReset, darkMode = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleDownloadJson = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const fileName = data.videoTitle.toLowerCase().replace(/[^a-z0-9]/g, '-');
    a.href = url;
    a.download = `${fileName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Summary */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-sm border p-6 flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div className="flex-1">
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{data.videoTitle}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{data.playlistTitle}</span>
          </div>
          <div className="flex flex-wrap gap-3 mt-3">
            <span className={`text-xs font-medium ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'} px-2 py-1 rounded`}>
              {data.flashcards.length} Flashcards
            </span>
            <span className={`text-xs font-medium ${darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'} px-2 py-1 rounded`}>
              {data.multipleChoice.length} MCQs
            </span>
            <span className={`text-xs font-medium ${darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700'} px-2 py-1 rounded`}>
              {data.trueFalse.length} True/False
            </span>
            <span className={`text-xs font-medium ${darkMode ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-700'} px-2 py-1 rounded`}>
              {data.fillInTheBlank?.length || 0} Fill-in-the-Blank
            </span>
            <span className={`text-xs font-medium ${darkMode ? 'bg-pink-900 text-pink-300' : 'bg-pink-100 text-pink-700'} px-2 py-1 rounded`}>
              {data.matching?.length || 0} Matching
            </span>
            <span className={`text-xs font-medium ${darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700'} px-2 py-1 rounded`}>
              {data.clinical?.length || 0} Clinical
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className={`px-4 py-2 text-sm font-medium ${darkMode ? 'text-gray-300 bg-gray-700 border-gray-600 hover:bg-gray-600' : 'text-gray-600 bg-white border-gray-300 hover:bg-gray-50'} border rounded-lg transition-colors`}
          >
            Back to Playlists
          </button>
          <button
            onClick={handleCopyJson}
            className={`px-4 py-2 text-sm font-medium ${darkMode ? 'text-gray-300 bg-gray-700 border-gray-600 hover:bg-gray-600' : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'} border rounded-lg transition-colors flex items-center gap-2`}
          >
            {copied ? 'Copied!' : 'Copy JSON'}
          </button>
          <button
            onClick={handleDownloadJson}
            className="px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download JSON
          </button>
        </div>
      </div>

      {/* Video Info Card */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border shadow-sm overflow-hidden`}>
        <div className={`p-5 border-b ${darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-100 bg-gray-50/50'}`}>
          <div className="flex items-start gap-3">
            <div className="mt-1 flex-shrink-0">
              <div className={`w-10 h-10 ${darkMode ? 'bg-red-900' : 'bg-red-100'} rounded-lg flex items-center justify-center text-red-600`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z"/>
                </svg>
              </div>
            </div>
            <div>
              <h3 className={`font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} leading-tight line-clamp-2`}>{data.videoTitle}</h3>
              <a 
                href={data.videoUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 mt-2 ${darkMode ? 'bg-blue-900/50 border-blue-800' : 'bg-blue-50 border-blue-100'} px-2 py-1 rounded border`}
              >
                WATCH VIDEO
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="p-5">
          <h4 className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Summary</h4>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>{data.summary}</p>
          
          <div className="bg-gray-900 rounded-lg p-3 overflow-hidden max-h-64 relative">
            <div className="absolute inset-x-0 top-0 h-5 bg-gray-800 flex items-center px-2">
              <span className="text-[9px] text-gray-400 font-mono">study_data.json</span>
            </div>
            <pre className="text-[9px] text-green-400 font-mono mt-4 opacity-70 overflow-auto max-h-48">
              {JSON.stringify(data, null, 2).substring(0, 2000)}...
            </pre>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* Cache Info */}
      {data.isCached && (
        <div className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <p>
            📦 Loaded from cache • Generated: {data.generatedAt ? new Date(data.generatedAt).toLocaleDateString() : 'Unknown'}
            {data.generationCount && data.generationCount > 1 && ` • Re-analyzed ${data.generationCount - 1} time(s)`}
          </p>
        </div>
      )}
    </div>
  );
};