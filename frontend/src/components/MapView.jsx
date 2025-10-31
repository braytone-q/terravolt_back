import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { energyAPI } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import { MapPin, Zap, Activity, Info } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom icon for solar installations
const createSolarIcon = (power) => {
  const size = power > 100 ? 40 : power > 50 ? 30 : 20;
  const color = power > 100 ? '#16a34a' : power > 50 ? '#22c55e' : '#86efac';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg width="${size * 0.6}" height="${size * 0.6}" viewBox="0 0 24 24" fill="white">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 2 L12 8 M12 16 L12 22 M2 12 L8 12 M16 12 L22 12" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

const MapView = () => {
  const [installations, setInstallations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInstallation, setSelectedInstallation] = useState(null);

  useEffect(() => {
    fetchInstallations();
  }, []);

  const fetchInstallations = async () => {
    try {
      setLoading(true);
      // Use mini version by default for faster loading
      // Full version can be loaded later if needed
      const data = await energyAPI.getMapInstallationsMini();
      if (data && data.features) {
        setInstallations(data.features);
      }
    } catch (err) {
      console.error('Map error:', err);
      // Try full version as fallback
      try {
        const data = await energyAPI.getMapInstallations();
        if (data && data.features) {
          setInstallations(data.features);
        }
      } catch (fallbackErr) {
        setError(fallbackErr.message || 'Failed to fetch installations');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchInstallations}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Default center: Kenya
  const center = [0.0236, 37.9062];
  
  // If we have installations, use the first one as center
  if (installations.length > 0) {
    const firstInstallation = installations[0];
    if (firstInstallation.geometry && firstInstallation.geometry.coordinates) {
      center[1] = firstInstallation.geometry.coordinates[0];
      center[0] = firstInstallation.geometry.coordinates[1];
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Installation Map</h1>
          </div>
          <p className="text-gray-600">
            Solar energy installations across Kenya ({installations.length} active systems)
          </p>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-[60vh] md:h-[70vh]">
        <MapContainer
          center={center}
          zoom={7}
          style={{ height: '100%', width: '100%', zIndex: 1 }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {installations.map((feature, index) => {
            const { installation_id, name, capacity_kw, status, current_power_kw, region } = feature.properties;
            const [lng, lat] = feature.geometry.coordinates;
            
            return (
              <Marker
                key={installation_id || index}
                position={[lat, lng]}
                icon={createSolarIcon(capacity_kw || 0)}
                eventHandlers={{
                  click: () => setSelectedInstallation(feature),
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-bold text-gray-900 mb-2">{name}</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span>Capacity: <strong>{capacity_kw} kW</strong></span>
                      </div>
                      {current_power_kw && (
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-blue-500" />
                          <span>Current: <strong>{current_power_kw} kW</strong></span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-green-500" />
                        <span>Status: <strong className="capitalize">{status}</strong></span>
                      </div>
                      {region && (
                        <div className="text-xs text-gray-500 mt-2">
                          📍 Region: {region}
                        </div>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 sm:p-4 z-[1000] border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Legend</h3>
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-600 border-2 border-white"></div>
              <span>High Capacity (&gt;100 kW)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
              <span>Medium (50-100 kW)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400 border-2 border-white"></div>
              <span>Small (&lt;50 kW)</span>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        {selectedInstallation && (
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-xl p-4 sm:p-6 z-[1000] border border-gray-200 max-w-sm w-[90vw] sm:w-auto">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900">
                {selectedInstallation.properties.name}
              </h3>
              <button
                onClick={() => setSelectedInstallation(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" />
                <span>ID: <strong>{selectedInstallation.properties.installation_id}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>Capacity: <strong>{selectedInstallation.properties.capacity_kw} kW</strong></span>
              </div>
              {selectedInstallation.properties.current_power_kw && (
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  <span>Current: <strong>{selectedInstallation.properties.current_power_kw} kW</strong></span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-green-500" />
                <span>Status: <strong className="capitalize">{selectedInstallation.properties.status}</strong></span>
              </div>
              {selectedInstallation.properties.region && (
                <div className="text-xs text-gray-500 mt-2">
                  📍 Region: {selectedInstallation.properties.region}
                </div>
              )}
              {selectedInstallation.properties.timestamp && (
                <div className="text-xs text-gray-500 mt-2">
                  🕐 Last update: {new Date(selectedInstallation.properties.timestamp).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;

