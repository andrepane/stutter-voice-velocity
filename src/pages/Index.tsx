
import React, { useState, useEffect, useRef } from 'react';
import RecordingButton from '@/components/RecordingButton';
import SpeechRateDisplay from '@/components/SpeechRateDisplay';
import AudioVisualizer from '@/components/AudioVisualizer';
import AudioPlayer from '@/components/AudioPlayer';
import Header from '@/components/Header';
import Instructions from '@/components/Instructions';
import { 
  calculateSpeechRate, 
  getSpeechRateFeedback,
  generateAudioVisualizationData,
  blobToBase64 
} from '@/utils/speechUtils';

type FeedbackStatus = 'inactive' | 'slow' | 'good' | 'fast';

type FeedbackState = {
  status: FeedbackStatus;
  message: string;
};

const Index: React.FC = () => {
  // State for recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  // State for speech rate
  const [speechRate, setSpeechRate] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState>({ 
    status: 'inactive', 
    message: 'Esperando...' 
  });
  
  // State for visualization
  const [visualizationData, setVisualizationData] = useState<Uint8Array | undefined>(undefined);
  
  // Refs for recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  
  // Setup audio context and analyzer
  useEffect(() => {
    // Visualization setup for mock data
    const bufferLength = 128;
    const dataArray = new Uint8Array(bufferLength);
    dataArrayRef.current = dataArray;
    
    // Set up visualization update interval
    const visualizationInterval = setInterval(() => {
      if (isRecording) {
        // In a real app, this would come from the actual audio analysis
        // For now, we'll generate mock data
        const mockData = generateAudioVisualizationData(bufferLength);
        setVisualizationData(mockData);
        
        // Update speech rate with simulated data
        // In a real app, this would use actual speech recognition API
        const randomVariation = Math.random() * 30 - 15; // +/- 15
        let newRate = 220 + randomVariation; // Centered around 220 spm
        setSpeechRate(newRate);
        
        // Update feedback based on speech rate
        const newFeedback = getSpeechRateFeedback(newRate);
        setFeedback(newFeedback as FeedbackState);
      }
    }, 200);
    
    return () => {
      clearInterval(visualizationInterval);
    };
  }, [isRecording]);
  
  // Handle timer for recording duration
  useEffect(() => {
    if (isRecording) {
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);
  
  // Format recording time as mm:ss
  const formatRecordingTime = () => {
    const minutes = Math.floor(recordingTime / 60);
    const seconds = recordingTime % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Toggle recording
  const handleToggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      setFeedback({ status: 'inactive', message: 'Esperando...' });
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // In a real app, set up audio analysis here
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        
        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        
        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
          
          // Clean up stream tracks
          stream.getTracks().forEach(track => track.stop());
        };
        
        mediaRecorder.start();
        setRecordingTime(0);
        setIsRecording(true);
        setAudioUrl(null);
      } catch (error) {
        console.error('Error accessing microphone:', error);
        // Here you would show an error message to the user
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="container flex-1 py-6 px-4 sm:px-6 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            <Instructions />
            
            <div className="glass rounded-xl p-6 shadow-sm animate-fade-in">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Grabación</h2>
                {isRecording && (
                  <p className="text-primary mt-1 text-sm font-medium">{formatRecordingTime()}</p>
                )}
              </div>
              
              <div className="flex justify-center mb-6">
                <RecordingButton 
                  isRecording={isRecording}
                  onToggleRecording={handleToggleRecording}
                />
              </div>
              
              <AudioVisualizer 
                audioData={visualizationData}
                isRecording={isRecording}
              />
            </div>
            
            {audioUrl && (
              <AudioPlayer 
                audioUrl={audioUrl}
                className="animate-slide-up"
              />
            )}
          </div>
          
          {/* Right column */}
          <div>
            <SpeechRateDisplay 
              rate={speechRate}
              status={feedback.status}
              message={feedback.message}
            />
            
            <div className="mt-6 glass rounded-xl p-6 shadow-sm animate-fade-in space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Estadísticas</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Tiempo</p>
                  <p className="text-xl font-semibold">{formatRecordingTime()}</p>
                </div>
                
                <div className="bg-white/50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Velocidad Promedio</p>
                  <p className="text-xl font-semibold">{Math.round(speechRate || 0)}</p>
                </div>
                
                <div className="bg-white/50 rounded-lg p-4 text-center col-span-2">
                  <p className="text-sm text-gray-500">Estado</p>
                  <p className={`text-lg font-medium ${
                    feedback.status === 'good' ? 'text-green-500' :
                    feedback.status === 'slow' ? 'text-blue-500' :
                    feedback.status === 'fast' ? 'text-amber-500' : 'text-gray-500'
                  }`}>
                    {feedback.status === 'inactive' ? 'Sin actividad' : feedback.message}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 text-center text-sm text-gray-500">
                <p>Usa esta herramienta regularmente para mejorar el control de la velocidad del habla.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-gray-500">
        <p>VoiceFlow &copy; {new Date().getFullYear()} - Herramienta para terapia del habla</p>
      </footer>
    </div>
  );
};

export default Index;
