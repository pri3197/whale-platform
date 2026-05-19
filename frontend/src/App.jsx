import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Waves, MapPin, Plus, Send, Droplets } from 'lucide-react';
import axios from 'axios';
import L from 'leaflet';

// Fix leaflet icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Whale Icon
const whaleIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to dynamically fly to location
function FlyToLocation({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo([target.latitude, target.longitude], 6, {
        duration: 2
      });
    }
  }, [target, map]);
  return null;
}

function App() {
  const [sightings, setSightings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLocation, setActiveLocation] = useState(null);
  const [formData, setFormData] = useState({
    species: '',
    latitude: '',
    longitude: '',
    observerName: '',
    comments: ''
  });

  const API_URL = 'http://localhost:8080/api/sightings';

  useEffect(() => {
    fetchSightings();
  }, []);

  const fetchSightings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setSightings(response.data);
    } catch (error) {
      console.error('Error fetching sightings. Using mock data for demo.', error);
      // Fallback for UI demonstration if backend is down
      setSightings([
        { id: 1, species: "Humpback Whale", latitude: 20.7984, longitude: -156.3319, sightingDate: new Date().toISOString(), observerName: "Alice", comments: "Breaching near Maui" },
        { id: 2, species: "Blue Whale", latitude: 36.6226, longitude: -122.0163, sightingDate: new Date().toISOString(), observerName: "Bob", comments: "Monterey Bay feeding" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newSighting = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        sightingDate: new Date().toISOString()
      };
      await axios.post(API_URL, newSighting);
      setFormData({ species: '', latitude: '', longitude: '', observerName: '', comments: '' });
      fetchSightings();
      setActiveLocation(newSighting);
    } catch (error) {
      console.error('Error submitting sighting', error);
      alert("Error submitting. Make sure backend is running.");
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo-container">
          <Waves size={32} className="logo-icon" />
          <h1 className="logo-text">Oceanic Watch</h1>
        </div>
        <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
          <Droplets size={20} color="#0ea5e9" />
          <span style={{color: 'var(--text-muted)'}}>Global Data Platform</span>
        </div>
      </nav>

      <main className="dashboard">
        <aside className="sidebar">
          <div>
            <h2>Recent Sightings</h2>
            <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem'}}>
              Real-time feed of marine mammal activity
            </p>
            {loading ? (
              <div className="loader-container"><div className="loader"></div></div>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                {sightings.map((s, idx) => (
                  <div 
                    key={s.id || idx} 
                    className="sighting-card animate-fade-in"
                    style={{animationDelay: `${idx * 0.1}s`}}
                    onClick={() => setActiveLocation(s)}
                  >
                    <h3>{s.species}</h3>
                    <div className="sighting-meta">
                      <span><MapPin size={14} style={{display:'inline', marginRight:'4px'}}/> {s.latitude.toFixed(2)}, {s.longitude.toFixed(2)}</span>
                      <span>By {s.observerName}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form className="submit-form" onSubmit={handleSubmit}>
            <h2 style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Plus size={20}/> Report Sighting</h2>
            <div className="form-group">
              <input type="text" name="species" placeholder="Species (e.g., Orca)" value={formData.species} onChange={handleInputChange} required />
            </div>
            <div style={{display: 'flex', gap: '1rem'}}>
              <div className="form-group" style={{flex: 1}}>
                <input type="number" step="any" name="latitude" placeholder="Latitude" value={formData.latitude} onChange={handleInputChange} required />
              </div>
              <div className="form-group" style={{flex: 1}}>
                <input type="number" step="any" name="longitude" placeholder="Longitude" value={formData.longitude} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="form-group">
              <input type="text" name="observerName" placeholder="Your Name" value={formData.observerName} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <textarea name="comments" placeholder="Details/Comments" rows="2" value={formData.comments} onChange={handleInputChange}></textarea>
            </div>
            <button type="submit" className="submit-btn"><Send size={18} /> Submit Data</button>
          </form>
        </aside>

        <section className="map-container">
          <MapContainer 
            center={[20, 0]} 
            zoom={3} 
            style={{ height: '100%', width: '100%', background: '#0f172a' }}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <FlyToLocation target={activeLocation} />
            
            {sightings.map((s, idx) => (
              <Marker 
                key={s.id || idx} 
                position={[s.latitude, s.longitude]}
                icon={whaleIcon}
              >
                <Popup className="dark-popup">
                  <div style={{padding: '0.5rem'}}>
                    <h3 style={{margin: '0 0 0.5rem 0', color: '#000'}}>{s.species}</h3>
                    <p style={{margin: '0 0 0.25rem 0', color: '#333'}}><strong>Observer:</strong> {s.observerName}</p>
                    <p style={{margin: '0', color: '#666', fontStyle: 'italic'}}>"{s.comments}"</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </section>
      </main>
    </div>
  );
}

export default App;
