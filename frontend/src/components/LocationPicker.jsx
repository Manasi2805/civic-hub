import React, { useState } from 'react';
import MapView from './MapView';
import './LocationPicker.css';

export default function LocationPicker({ onLocationSelect }) {
  const [mapMode, setMapMode] = useState(false);
  const [coords, setCoords] = useState(null);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCoords(c);
          if(onLocationSelect) onLocationSelect(c);
        },
        (err) => alert('Geolocation error: ' + err.message)
      );
    }
  };

  const handleMapSelect = (latlng) => {
    setCoords(latlng);
    if(onLocationSelect) onLocationSelect(latlng);
  };

  return (
    <div className="location-picker">
      {!mapMode ? (
        <div className="lp-buttons">
          <button className="lp-btn primary" onClick={handleGetCurrentLocation}>
            📍 Use Current Location
          </button>
          <button className="lp-btn outline" onClick={() => setMapMode(true)}>
            🗺️ Select on Map
          </button>
        </div>
      ) : (
        <div className="lp-map-container">
          <MapView mode="picker" onLocationSelect={handleMapSelect} selectedLocation={coords} />
          <button className="lp-btn small mt" onClick={() => setMapMode(false)}>Close Map</button>
        </div>
      )}
      {coords && (
        <div className="lp-selected">
          Selected: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
        </div>
      )}
    </div>
  );
}
