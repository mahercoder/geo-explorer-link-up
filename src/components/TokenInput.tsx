
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, ExternalLink } from 'lucide-react';

interface TokenInputProps {
  onTokenSubmit: (token: string) => void;
}

const TokenInput: React.FC<TokenInputProps> = ({ onTokenSubmit }) => {
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onTokenSubmit(token.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Geo Explorer</h1>
          <p className="text-muted-foreground">
            Interactive map for location selection and weather data
          </p>
        </div>

        <div className="bg-card rounded-lg p-6 border shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="mapbox-token" className="text-sm font-medium">
                Mapbox Public Token
              </label>
              <div className="relative">
                <input
                  id="mapbox-token"
                  type={showToken ? 'text' : 'password'}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6InlvdXItdG9rZW4ifQ..."
                  className="w-full px-3 py-2 border border-input rounded-md bg-background pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Start Exploring
            </Button>
          </form>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-sm">How to get your Mapbox token:</h3>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Visit mapbox.com and create a free account</li>
            <li>Go to your Account Dashboard</li>
            <li>Find your "Default public token" in the Tokens section</li>
            <li>Copy and paste it above</li>
          </ol>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://account.mapbox.com/access-tokens/', '_blank')}
            className="w-full"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Get Mapbox Token
          </Button>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          Your token is only stored locally and never sent to any server
        </div>
      </div>
    </div>
  );
};

export default TokenInput;
