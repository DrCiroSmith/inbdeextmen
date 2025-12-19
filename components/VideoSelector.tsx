import React from 'react';
import { Playlist, VideoInfo } from '../types';

interface VideoSelectorProps {
    playlist: Playlist;
    videos: VideoInfo[];
    onSelectVideo: (video: VideoInfo) => void;
    onBack: () => void;
}

export const VideoSelector: React.FC<VideoSelectorProps> = ({
    playlist,
    videos,
    onSelectVideo,
    onBack
}) => {
    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={onBack}
                    className="mb-4 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                >
                    ← Back to Playlists
                </button>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{playlist.title}</h2>
                <p className="text-gray-600">{playlist.description}</p>
                <p className="text-sm text-gray-500 mt-2">Select a video to generate study materials</p>
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map((video, index) => (
                    <button
                        key={index}
                        onClick={() => onSelectVideo(video)}
                        className="group bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 p-5 text-left transition-all hover:shadow-lg"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                                    {video.title}
                                </h3>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                    </svg>
                                    Click to study
                                </p>
                            </div>
                            <svg
                                className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </button>
                ))}
            </div>

            {videos.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <p>No videos found for this playlist.</p>
                </div>
            )}
        </div>
    );
};
