
import React, { useState } from 'react';
import { Mic, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecordingButtonProps {
  isRecording: boolean;
  onToggleRecording: () => void;
  disabled?: boolean;
}

const RecordingButton: React.FC<RecordingButtonProps> = ({
  isRecording,
  onToggleRecording,
  disabled = false
}) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="relative flex items-center justify-center">
      {/* Pulse animation ring (visible only when recording) */}
      {isRecording && (
        <div className="absolute rounded-full w-20 h-20 border-4 border-red-500/50 animate-pulse-ring" />
      )}
      
      <button
        onClick={onToggleRecording}
        disabled={disabled}
        className={cn(
          "relative w-16 h-16 rounded-full flex items-center justify-center transition-all-gpu z-10",
          "transform hover:scale-105 active:scale-95",
          isRecording 
            ? "bg-red-500 text-white shadow-lg shadow-red-500/30" 
            : "bg-primary text-white shadow-lg shadow-primary/30",
          isHovering ? "scale-105" : "scale-100",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        aria-label={isRecording ? "Detener grabación" : "Iniciar grabación"}
      >
        {isRecording ? (
          <Square className="w-7 h-7 transition-transform duration-300 ease-in-out" />
        ) : (
          <Mic className="w-7 h-7 transition-transform duration-300 ease-in-out" />
        )}
      </button>

      {/* Status text */}
      <div 
        className={cn(
          "absolute -bottom-10 text-sm font-medium transition-all duration-300",
          isRecording 
            ? "text-red-500 opacity-100" 
            : "text-primary opacity-80"
        )}
      >
        {isRecording ? "Grabando..." : "Grabar"}
      </div>
    </div>
  );
};

export default RecordingButton;
