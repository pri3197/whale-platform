import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Waves, MapPin, Plus, Send, Droplets, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const whaleIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function FlyToLocation({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target && target.latitude && target.longitude) {
      map.flyTo([target.latitude, target.longitude], 6, {
        duration: 2
      });
    }
  }, [target, map]);
  return null;
}

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' or 'dashboard'
  const [sightings, setSightings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLocation, setActiveLocation] = useState(null);
  const [activeTab, setActiveTab] = useState('map');
  const [formData, setFormData] = useState({
    species: '',
    latitude: '',
    longitude: '',
    observerName: '',
    comments: ''
  });

  const API_URL = 'http://localhost:8080/api/sightings';

  useEffect(() => {
    if (currentPage === 'dashboard') {
      fetchSightings();
    }
  }, [currentPage]);

  const fetchSightings = async () => {
    try {
      setLoading(true);
      // Fetch from GBIF API for Order Cetacea (Whales, Dolphins, Porpoises) taxonKey = 734
      const gbifRes = await axios.get('https://api.gbif.org/v1/occurrence/search?taxonKey=734&hasCoordinate=true&limit=100');

      const gbifData = gbifRes.data.results
        .filter(r => r.decimalLatitude && r.decimalLongitude)
        .map((r, idx) => ({
          id: `gbif-${r.key}`,
          species: r.species || r.scientificName || "Unknown Cetacean",
          latitude: r.decimalLatitude,
          longitude: r.decimalLongitude,
          sightingDate: r.eventDate || null,
          observerName: r.recordedBy || "GBIF Public Data",
          comments: r.locality || "Sourced from GBIF API",
          length: null,
          breadth: null,
          approxAge: null,
          predictedLat: null,
          predictedLng: null,
          actualLat: null,
          actualLng: null,
          imageUrl: r.media && r.media.length > 0 ? r.media[0].identifier : null
        }));

      // Fetch from our local backend
      let localData = [];
      try {
        const localResponse = await axios.get(API_URL);
        localData = localResponse.data;
      } catch (localErr) {
        console.error("Local DB not running, proceeding with just GBIF data.");
      }

      setSightings([...localData, ...gbifData]);
    } catch (error) {
      console.error('Error fetching sightings.', error);
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

  if (currentPage === 'home') {
    return (
      <div className="home-page">
        <div className="video-overlay"></div>
        <div className="animated-bg"></div>

        <div className="home-content">
          <Waves size={80} color="#ffffff" style={{ marginBottom: '1rem' }} />
          <h1 className="home-title">Smart Whale Ecosystem Platform</h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            A comprehensive data platform currently integrating Global Biodiversity Information Facility (GBIF) data
            with marine mammal tracking.
          </p>
          <button className="enter-btn" onClick={() => setCurrentPage('dashboard')}>
            Enter Platform
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo-container">
          <Waves size={32} className="logo-icon" />
          <h1 className="logo-text">Oceanic Watch</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Droplets size={20} color="#0284c7" />
          <span style={{ color: 'var(--text-muted)' }}>Global Data Platform (GBIF Integrated)</span>
        </div>
      </nav>

      <main className="dashboard">
        <aside className="sidebar">
          <div>
            <h2>Recent Sightings</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Real-time feed of marine mammal activity
            </p>
            {loading ? (
              <div className="loader-container"><div className="loader"></div></div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {sightings.slice(0, 15).map((s, idx) => (
                  <div
                    key={s.id || idx}
                    className="sighting-card animate-fade-in"
                    style={{ animationDelay: `${(idx % 10) * 0.05}s` }}
                    onClick={() => {
                      setActiveLocation(s);
                      setActiveTab('map');
                    }}
                  >
                    <h3>{s.species}</h3>
                    <div className="sighting-meta">
                      <span><MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} /> {s.latitude.toFixed(2)}, {s.longitude.toFixed(2)}</span>
                      <span>By {s.observerName.substring(0, 25)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form className="submit-form" onSubmit={handleSubmit}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)' }}><Plus size={20} /> Report Sighting</h2>
            <div className="form-group">
              <input type="text" name="species" placeholder="Species (e.g., Orca)" value={formData.species} onChange={handleInputChange} required />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <input type="number" step="any" name="latitude" placeholder="Latitude" value={formData.latitude} onChange={handleInputChange} required />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
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

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="tabs">
            <button className={`tab-btn ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>Global Map</button>
            <button className={`tab-btn ${activeTab === 'table' ? 'active' : ''}`} onClick={() => setActiveTab('table')}>Data Records</button>
          </div>

          {activeTab === 'map' ? (
            <section className="map-container">
              <MapContainer
                center={[20, 0]}
                zoom={3}
                style={{ height: '100%', width: '100%', background: '#e2e8f0' }}
                zoomControl={false}
              >
                {/* Updated to Light Base Map */}
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                <FlyToLocation target={activeLocation} />

                {sightings.map((s, idx) => (
                  <React.Fragment key={s.id || idx}>
                    <Marker
                      position={[s.latitude, s.longitude]}
                      icon={whaleIcon}
                    >
                      <Popup>
                        <div style={{ padding: '0.5rem' }}>
                          <h3 style={{ margin: '0 0 0.5rem 0', color: '#000' }}>{s.species}</h3>
                          <p style={{ margin: '0 0 0.25rem 0', color: '#333' }}><strong>Observer:</strong> {s.observerName}</p>
                          <p style={{ margin: '0', color: '#666', fontStyle: 'italic' }}>"{s.comments}"</p>
                        </div>
                      </Popup>
                    </Marker>

                    {s.predictedLat && s.predictedLng && (
                      <Polyline
                        positions={[[s.latitude, s.longitude], [s.predictedLat, s.predictedLng]]}
                        pathOptions={{ color: '#ef4444', weight: 3, dashArray: '5, 8' }}
                      />
                    )}

                    {s.actualLat && s.actualLng && (
                      <Polyline
                        positions={[[s.latitude, s.longitude], [s.actualLat, s.actualLng]]}
                        pathOptions={{ color: '#22c55e', weight: 4 }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </MapContainer>
            </section>
          ) : (
            <section className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Species</th>
                    <th>Date & Time</th>
                    <th>Coordinates</th>
                    <th>Length (m)</th>
                    <th>Breadth (m)</th>
                    <th>Approx. Age</th>
                    <th>Predicted Location (24h)</th>
                    <th>Actual Location</th>
                    <th>Media</th>
                  </tr>
                </thead>
                <tbody>
                  {sightings.map((s, idx) => (
                    <tr key={s.id || idx}>
                      <td>{s.species}</td>
                      <td>{s.sightingDate ? new Date(s.sightingDate).toLocaleString() : <span className="badge-tbd">To be determined</span>}</td>
                      <td>
                        <span
                          className="link-coords"
                          onClick={() => {
                            setActiveLocation(s);
                            setActiveTab('map');
                          }}
                        >
                          {s.latitude.toFixed(4)}, {s.longitude.toFixed(4)}
                        </span>
                      </td>
                      <td>{s.length ? s.length : <span className="badge-tbd">To be determined</span>}</td>
                      <td>{s.breadth ? s.breadth : <span className="badge-tbd">To be determined</span>}</td>
                      <td>{s.approxAge ? s.approxAge : <span className="badge-tbd">To be determined</span>}</td>
                      <td>
                        {s.predictedLat && s.predictedLng ? (
                          <span>{s.predictedLat.toFixed(4)}, {s.predictedLng.toFixed(4)}</span>
                        ) : (
                          <span className="badge-tbd">To be determined</span>
                        )}
                      </td>
                      <td>
                        {s.actualLat && s.actualLng ? (
                          <span>{s.actualLat.toFixed(4)}, {s.actualLng.toFixed(4)}</span>
                        ) : (
                          <span className="badge-tbd">To be determined</span>
                        )}
                      </td>
                      <td>
                        {s.imageUrl ? (
                          <a href={s.imageUrl} target="_blank" rel="noreferrer" className="img-link">
                            <ImageIcon size={16} /> View
                          </a>
                        ) : (
                          <span className="badge-tbd">To be determined</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
