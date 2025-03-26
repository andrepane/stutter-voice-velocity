
import React from 'react';
import { cn } from '@/lib/utils';

interface SpeechRateDisplayProps {
  rate: number;
  status: 'slow' | 'good' | 'fast' | 'inactive';
  message: string;
}

const SpeechRateDisplay: React.FC<SpeechRateDisplayProps> = ({ rate, status, message }) => {
  // Get appropriate styling based on status
  const getStatusStyles = () => {
    switch(status) {
      case 'slow':
        return {
          barColor: 'bg-blue-500',
          textColor: 'text-blue-600',
          percentage: 30
        };
      case 'good':
        return {
          barColor: 'bg-green-500',
          textColor: 'text-green-600',
          percentage: 65
        };
      case 'fast':
        return {
          barColor: 'bg-amber-500',
          textColor: 'text-amber-600',
          percentage: 95
        };
      default:
        return {
          barColor: 'bg-gray-300',
          textColor: 'text-gray-500',
          percentage: 0
        };
    }
  };
  
  const { barColor, textColor, percentage } = getStatusStyles();

  return (
    <div className="w-full animate-fade-in glass rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-700">Velocidad de habla</h3>
        <div className={cn(
          "px-3 py-1 rounded-full text-xs font-medium", 
          status === 'inactive' ? 'bg-gray-200 text-gray-500' : `${barColor}/20 ${textColor}`
        )}>
          {status === 'inactive' ? 'Inactivo' : message}
        </div>
      </div>
      
      {/* Speech rate gauge */}
      <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
        <div 
          className={cn(
            "h-full transition-all duration-700 ease-out rounded-full",
            barColor
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Rate indicators */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>Lento</span>
        <span>Adecuado</span>
        <span>Rápido</span>
      </div>
      
      {/* Actual numeric rate */}
      {status !== 'inactive' && (
        <div className="mt-4 text-center">
          <span className="text-2xl font-bold">{Math.round(rate)}</span>
          <span className="text-sm text-gray-500 ml-1">sílabas/minuto</span>
        </div>
      )}
    </div>
  );
};

export default SpeechRateDisplay;
