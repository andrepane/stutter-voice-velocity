
// Speech processing utilities

// Calculate speech rate (syllables per minute)
export const calculateSpeechRate = (
  syllables: number, 
  durationInSeconds: number
): number => {
  // Convert to minutes
  const durationInMinutes = durationInSeconds / 60;
  // Calculate syllables per minute
  return syllables / durationInMinutes;
};

// Estimate syllables from audio chunks
export const estimateSyllables = (
  audioChunks: Float32Array[], 
  threshold: number = 0.05,
  minSilenceDuration: number = 0.2
): number => {
  // Simple energy-based syllable estimation
  // In a real implementation, this would use more sophisticated algorithms
  let syllableCount = 0;
  let isSilence = true;
  let silenceFrames = 0;
  const sampleRate = 48000; // Assumed sample rate
  const framesPerSilenceDuration = minSilenceDuration * sampleRate;
  
  for (const chunk of audioChunks) {
    for (let i = 0; i < chunk.length; i++) {
      const energy = Math.abs(chunk[i]);
      
      if (energy > threshold) {
        if (isSilence && silenceFrames > framesPerSilenceDuration) {
          syllableCount++;
        }
        isSilence = false;
        silenceFrames = 0;
      } else {
        isSilence = true;
        silenceFrames++;
      }
    }
  }
  
  return syllableCount;
};

// Get speech rate feedback based on syllables per minute (spm)
export const getSpeechRateFeedback = (spm: number): {
  status: 'slow' | 'good' | 'fast',
  message: string
} => {
  // These ranges are approximate and should be adjusted based on
  // research for people with stuttering
  if (spm < 180) {
    return {
      status: 'slow',
      message: 'Habla un poco más rápido'
    };
  } else if (spm > 250) {
    return {
      status: 'fast',
      message: 'Disminuye la velocidad'
    };
  } else {
    return {
      status: 'good',
      message: 'Velocidad adecuada'
    };
  }
};

// Generate mock audio analysis data for visualization
export const generateAudioVisualizationData = (
  bufferLength: number, 
  maxAmplitude: number = 128
): Uint8Array => {
  const dataArray = new Uint8Array(bufferLength);
  for (let i = 0; i < bufferLength; i++) {
    const t = i / bufferLength;
    // Generate a waveform-like pattern
    dataArray[i] = maxAmplitude * (0.5 + 0.5 * Math.sin(t * 10) * Math.cos(t * 4));
  }
  return dataArray;
};

// Convert audio blob to base64 for storage/playback
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
