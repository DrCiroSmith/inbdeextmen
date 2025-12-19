import React, { useState } from 'react';
import { StudyData, VideoModule } from '../types';

interface JsonViewerProps {
  data: StudyData;
  onReset: () => void;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ data, onReset }) => {
  const [copyStates, setCopyStates] = useState<Record<number, boolean>>({});

  const handleCopySingle = (module: VideoModule, index: number) => {
    navigator.clipboard.writeText(JSON.stringify(module, null, 2));
    setCopyStates(prev => ({ ...prev, [index]: true }));
    setTimeout(() => {
      setCopyStates(prev => ({ ...prev, [index]: false }));
    }, 2000);
  };

  const handleDownloadSingle = (module: VideoModule) => {
    const jsonString = JSON.stringify(module, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const fileName = module.videoTitle.toLowerCase().replace(/[^a-z0-9]/g, '-');
    a.href = url;
    a.download = `${fileName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    data.modules.forEach((mod, idx) => {
      setTimeout(() => {
        handleDownloadSingle(mod);
      }, idx * 400);
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{data.playlistTitle}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-gray-500">
              Scraped <span className="font-bold text-blue-600">{data.modules?.length || 0}</span> individual video links & data.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Playlists
          </button>
          <button
            onClick={handleDownloadAll}
            className="px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download All JSONs
          </button>
        </div>
      </div>

      {/* Grid of Video Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {data.modules?.map((mod, index) => (
          <div key={index} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:border-blue-400 transition-all group">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                   <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z"/>
                    </svg>
                   </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 leading-tight group-hover:text-blue-700 transition-colors line-clamp-2">{mod.videoTitle}</h3>
                  <a 
                    href={mod.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 mt-2 bg-blue-50 px-2 py-1 rounded border border-blue-100"
                  >
                    WATCH VIDEO
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="p-5 flex-1">
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">{mod.summary}</p>
              
              <div className="bg-gray-900 rounded-lg p-3 overflow-hidden h-24 relative">
                <div className="absolute inset-x-0 top-0 h-5 bg-gray-800 flex items-center px-2">
                  <span className="text-[9px] text-gray-400 font-mono">module_data.json</span>
                </div>
                <pre className="text-[9px] text-green-400 font-mono mt-4 opacity-70">
                  {JSON.stringify(mod, null, 2).substring(0, 400)}...
                </pre>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent pointer-events-none"></div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 flex gap-2 border-t border-gray-100">
              <button
                onClick={() => handleCopySingle(mod, index)}
                className="flex-1 px-3 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                {copyStates[index] ? 'Copied!' : 'Copy JSON'}
              </button>
              <button
                onClick={() => handleDownloadSingle(mod)}
                className="flex-1 px-3 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                Export JSON
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};