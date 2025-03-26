
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 animate-slide-down">
      <div className="container">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            VoiceFlow
          </h1>
          <p className="text-muted-foreground mt-2">
            Control de velocidad para el habla fluida
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
