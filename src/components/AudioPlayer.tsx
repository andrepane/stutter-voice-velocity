
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  audioUrl: string | null;
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, className }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Create audio element when URL changes
  useEffect(() => {
    if (!audioUrl) {
      return;
    }
    
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    // Set up event listeners
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
    
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });
    
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });
    
    return () => {
      // Clean up
      audio.pause();
      audio.src = '';
      audio.remove();
      audioRef.current = null;
    };
  }, [audioUrl]);
  
  // Handle play/pause
  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Handle restart
  const restartPlayback = () => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    
    if (!isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };
  
  // Format time as mm:ss
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  if (!audioUrl) {
    return null;
  }
  
  return (
    <div className={cn("glass rounded-xl p-4 animate-fade-in", className)}>
      <div className="flex items-center space-x-3">
        <button
          onClick={togglePlayback}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            "transition-all-gpu transform hover:scale-105 active:scale-95",
            isPlaying ? "bg-primary/10 text-primary" : "bg-primary text-white"
          )}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
        
        <button
          onClick={restartPlayback}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <RotateCcw size={16} />
        </button>
        
        <div className="flex-1 space-y-1">
          <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-100"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
