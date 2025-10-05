"use client";

import { useState, useEffect } from "react";
import { Video, Heart, MessageCircle, Share2, Plus, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import "./video-player.css";

interface VideoData {
  _id: string;
  userId: string;
  displayName: string;
  profileIcon?: string;
  title: string;
  description?: string;
  category: string;
  tags: string[];
  visibility: string;
  fileName: string;
  originalFileName: string;
  fileSize: number;
  mimeType: string;
  gcsUrl: string;
  metadata: {
    uploadedAt: string;
    viewCount: number;
    downloadCount: number;
  };
  createdAt: string;
}

const categories = [
  { id: "all", name: "All" },
  { id: "tutorial", name: "Tutorial" },
  { id: "presentation", name: "Presentation" },
  { id: "demo", name: "Demo" },
  { id: "meeting", name: "Meeting" },
  { id: "other", name: "Other" },
];

export default function NexusClient() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    fetchVideos();
  }, [selectedCategory]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: "1",
        limit: "20",
        category: selectedCategory,
        sortBy: "createdAt",
        sortOrder: "desc"
      });

      const response = await fetch(`/api/videos?${params}`);
      const result = await response.json();

      console.log('API Response:', result); // Debug log

      if (result.success) {
        setVideos(result.data.videos); // Fixed: access videos from nested data structure
        console.log('Videos loaded:', result.data.videos.length); // Debug log
      } else {
        setError(result.error || 'Failed to fetch videos');
      }
    } catch (err) {
      setError('Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const nextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const prevVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading videos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nexus</h1>
            <p className="text-gray-600">Your video collection</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              Create Video
            </button>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full max-w-full max-h-full pt-16">
        {error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Videos</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchVideos}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : videos.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Videos Yet</h3>
              <p className="text-gray-600 mb-4">Start creating videos to see them here</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Create Your First Video
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full w-full py-16 pb-20 mt-8 relative">
            {/* Navigation Arrows */}
            <button
              onClick={prevVideo}
              disabled={currentVideoIndex === 0}
              className="absolute left-4 z-10 p-3 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>

            <button
              onClick={nextVideo}
              disabled={currentVideoIndex === videos.length - 1}
              className="absolute right-4 z-10 p-3 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>

            {/* Single Video in Center */}
            {videos.length > 0 && (
              <div className="max-w-4xl w-full mx-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  {/* Video Player */}
                  <div className="relative w-full aspect-video bg-black">
                    <video
                      src={videos[currentVideoIndex]?.gcsUrl || ''}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      autoPlay
                      controls
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => e.currentTarget.pause()}
                    />
                  </div>

                  {/* Video Info */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium overflow-hidden">
                        {videos[currentVideoIndex]?.profileIcon ? (
                          <img 
                            src={videos[currentVideoIndex].profileIcon} 
                            alt={videos[currentVideoIndex]?.displayName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          videos[currentVideoIndex]?.displayName?.charAt(0) || 'U'
                        )}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {videos[currentVideoIndex]?.title}
                        </h2>
                        <p className="text-sm text-gray-600">
                          Created by <span className="font-medium text-blue-600">{videos[currentVideoIndex]?.displayName}</span>
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">
                      {videos[currentVideoIndex]?.description || 'No description available'}
                    </p>
                    
                    {/* Tags */}
                    {videos[currentVideoIndex]?.tags && videos[currentVideoIndex].tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {videos[currentVideoIndex].tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Video Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span>{formatDate(videos[currentVideoIndex]?.createdAt || '')}</span>
                        <span>{formatFileSize(videos[currentVideoIndex]?.fileSize || 0)}</span>
                        <span>{videos[currentVideoIndex]?.metadata.viewCount || 0} views</span>
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                          {currentVideoIndex + 1} / {videos.length}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                          <Heart className="w-4 h-4" />
                          <span>Like</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span>Comment</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                          <Share2 className="w-4 h-4" />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
