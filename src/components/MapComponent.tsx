
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

// Replace this with your actual Mapbox public token
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string;

// Base URL for weather app
const WEATHER_APP_LINK = import.meta.env.VITE_WEATHER_APP_LINK as string;

interface SelectedLocation {
  lat: number;
  lng: number;
}

const MapComponent: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  
  // Default map center and zoom
  const defaultCenter: [number, number] = [0, 20]; // Center on world
  const defaultZoom = 2;

  useEffect(() => {
    if (!mapContainer.current || !MAPBOX_TOKEN) return;

    // Set Mapbox access token
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: isDarkTheme ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11',
      center: defaultCenter,
      zoom: defaultZoom,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Add click event listener
    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      handleLocationSelect(lat, lng);
    });

    // Cleanup function
    return () => {
      map.current?.remove();
    };
  }, [isDarkTheme]);

  const handleLocationSelect = (lat: number, lng: number) => {
    const location = { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) };
    setSelectedLocation(location);
    
    // Remove existing marker
    if (marker.current) {
      marker.current.remove();
    }
    
    // Add new marker
    marker.current = new mapboxgl.Marker({
      color: '#3B82F6', // Blue color
    })
      .setLngLat([lng, lat])
      .addTo(map.current!);

    // Open weather app in new tab
    const weatherUrl = `${WEATHER_APP_LINK}/weather?lat=${lat.toFixed(6)}&long=${lng.toFixed(6)}`;
    window.open(weatherUrl, '_blank');
  };

  const handleReset = () => {
    setSelectedLocation(null);
    
    // Remove marker
    if (marker.current) {
      marker.current.remove();
      marker.current = null;
    }
    
    // Reset map view
    if (map.current) {
      map.current.easeTo({
        center: defaultCenter,
        zoom: defaultZoom,
        duration: 1000,
      });
    }
  };

  const handleThemeToggle = (checked: boolean) => {
    setIsDarkTheme(checked);
  };

  return (
    <div className="relative w-full h-screen">
      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Controls Panel */}
      <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border">
        <div className="space-y-4">
          {/* Theme Toggle */}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium">Dark Theme</span>
            <Switch
              checked={isDarkTheme}
              onCheckedChange={handleThemeToggle}
            />
          </div>
          
          {/* Reset Button */}
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset View
          </Button>
        </div>
      </div>

      {/* Selected Location Display */}
      {selectedLocation && (
        <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Selected Location</h3>
              <p className="text-sm text-muted-foreground">
                Latitude: {selectedLocation.lat}°, Longitude: {selectedLocation.lng}°
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Weather app opened in new tab
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border max-w-xs">
        <p className="text-sm text-muted-foreground">
          Click anywhere on the map to select a location and open the weather app
        </p>
      </div>
    </div>
  );
};

export default MapComponent;
