import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import './MapView.css';

function LocationSelector({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      if (onLocationSelect) onLocationSelect(e.latlng);
    },
  });
  return null;
}

export default function MapView({
  mode = 'display',
  complaints = [],
  zones = null,
  onZoneClick,
  onLocationSelect,
  selectedLocation
}) {
  const defaultCenter = [12.3051, 76.6551]; // Mysuru

  const zoneStyle = (feature) => {
    const density = feature.properties?.density || 'low';
    let color = '#00c853';
    if (density === 'medium') color = '#ffab00';
    if (density === 'high') color = '#ff5252';
    return {
      fillColor: color,
      weight: 1.5,
      opacity: 0.8,
      color: 'white',
      fillOpacity: 0.35
    };
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        if (onZoneClick) onZoneClick(feature);
      }
    });
  };

  return (
    <div className="map-wrapper">
      <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%', borderRadius: 'inherit' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=cb1_3r4g_1_28f4f69a05a9a2c74a07643f"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {mode === 'picker' && <LocationSelector onLocationSelect={onLocationSelect} />}
        {mode === 'picker' && selectedLocation && (
          <Marker position={selectedLocation} />
        )}

        {mode === 'display' && zones && (
          <GeoJSON data={zones} style={zoneStyle} onEachFeature={onEachFeature} />
        )}

        {mode === 'display' && complaints && complaints.length > 0 && (
          <MarkerClusterGroup chunkedLoading>
            {complaints.map(c => {
              const lat = c.latitude !== undefined ? c.latitude : c.lat;
              const lng = c.longitude !== undefined ? c.longitude : c.lng;
              if (lat === undefined || lng === undefined || lat === null || lng === null) return null;
              return (
                <Marker key={c.id || Math.random()} position={[lat, lng]}>
                  <Popup>
                    <strong>{c.issue_type || c.type || 'Complaint'}</strong><br />
                    ID: {c.id}<br />
                    Status: {c.status}
                  </Popup>
                </Marker>
              );
            })}
          </MarkerClusterGroup>
        )}
      </MapContainer>
    </div>
  );
}

