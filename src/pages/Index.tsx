
import React, { useState, useEffect } from 'react';
import MapComponent from '@/components/MapComponent';
import TokenInput from '@/components/TokenInput';

const Index = () => {
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);

  // Check if token is stored in localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('mapbox-token');
    if (storedToken) {
      setMapboxToken(storedToken);
    }
  }, []);

  const handleTokenSubmit = (token: string) => {
    // Store token in localStorage for future use
    localStorage.setItem('mapbox-token', token);
    setMapboxToken(token);
  };

  const handleResetToken = () => {
    localStorage.removeItem('mapbox-token');
    setMapboxToken(null);
  };

  // Show token input if no token is available
  if (!mapboxToken) {
    return <TokenInput onTokenSubmit={handleTokenSubmit} />;
  }

  // Show map component with token
  return (
    <div className="relative">
      <MapComponent mapboxToken={mapboxToken} />
      
      {/* Token Reset Button */}
      <button
        onClick={handleResetToken}
        className="absolute bottom-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg p-2 shadow-lg border text-xs text-muted-foreground hover:text-foreground transition-colors"
        title="Reset Mapbox Token"
      >
        Reset Token
      </button>
    </div>
  );
};

export default Index;
