
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const Instructions: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className={cn(
      "w-full glass rounded-xl shadow-sm overflow-hidden transition-all duration-500 ease-in-out",
      isExpanded ? "max-h-[500px]" : "max-h-[60px]"
    )}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center">
          <Info className="w-5 h-5 text-primary mr-2" />
          <h3 className="font-medium">Instrucciones</h3>
        </div>
        {isExpanded ? 
          <ChevronUp className="w-5 h-5 text-gray-500" /> : 
          <ChevronDown className="w-5 h-5 text-gray-500" />
        }
      </button>
      
      <div className="px-4 pb-4 text-sm text-gray-600 space-y-3">
        <p>
          Esta herramienta te ayuda a monitorear y mejorar la velocidad de tu habla para
          una comunicación más fluida.
        </p>
        
        <ol className="list-decimal ml-5 space-y-2">
          <li>Pulsa el botón del micrófono para comenzar a grabar.</li>
          <li>Habla de manera continua y natural.</li>
          <li>Observa la retroalimentación en tiempo real sobre tu velocidad.</li>
          <li>Ajusta tu ritmo según las indicaciones.</li>
          <li>Detén la grabación cuando hayas terminado.</li>
          <li>Escucha la grabación para evaluar tu progreso.</li>
        </ol>
        
        <div className="bg-blue-50 p-3 rounded-md text-blue-700">
          <strong>Consejo:</strong> Intenta mantener un ritmo constante y respira cómodamente entre frases.
        </div>
      </div>
    </div>
  );
};

export default Instructions;
