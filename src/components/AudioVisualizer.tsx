
import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  audioData?: Uint8Array;
  isRecording: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ 
  audioData,
  isRecording
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Draw visualization on canvas
  useEffect(() => {
    if (!canvasRef.current || !audioData) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const width = canvas.width;
    const height = canvas.height;
    const barWidth = width / audioData.length;
    
    // Draw baseline when not recording
    if (!isRecording) {
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.strokeStyle = 'rgba(107, 114, 128, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
      return;
    }
    
    // Draw waveform
    ctx.beginPath();
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.2)');
    
    ctx.strokeStyle = 'rgb(59, 130, 246)';
    ctx.lineWidth = 2;

    // Draw waveform
    for (let i = 0; i < audioData.length; i++) {
      const x = i * barWidth;
      const percent = audioData[i] / 255;
      const barHeight = percent * height;
      
      const y = (height - barHeight) / 2;
      
      if (i === 0) {
        ctx.moveTo(x, y + barHeight / 2);
      } else {
        ctx.lineTo(x, y + barHeight / 2);
      }
    }
    
    ctx.stroke();
    
    // Add gradient fill
    ctx.lineTo(width, height / 2);
    ctx.lineTo(0, height / 2);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    
  }, [audioData, isRecording]);
  
  return (
    <div className="w-full rounded-xl overflow-hidden glass shadow-sm p-1">
      <canvas 
        ref={canvasRef} 
        className="w-full h-24"
        width={1000}
        height={200}
      />
    </div>
  );
};

export default AudioVisualizer;
