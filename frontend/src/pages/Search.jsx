import React, { useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { searchBlood, searchOrgans, createRequest } from '../services/api';
import { AuthContext } from '../context/AuthContext.jsx';

const Search = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [city, setCity] = useState('');
  const [selection, setSelection] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const organs = ['Kidney', 'Liver', 'Heart', 'Lungs', 'Pancreas', 'Cornea'];

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = { city };
      if (type === 'blood') {
        params.group = selection;
        const { data } = await searchBlood(params);
        setResults(data);
      } else {
        params.organ = selection;
        const { data } = await searchOrgans(params);
        setResults(data);
      }
    } catch (error) {
      alert('Search failed');
    }
    setLoading(false);
  };

  const handleRequest = async (item) => {
    if (!token) {
      alert('Please login to request blood or organ');
      navigate('/user-login');
      return;
    }

    const message = prompt(`Enter your message/reason for requesting ${type === 'blood' ? item.bloodGroup : item.organType}:`);
    if (!message) return;

    try {
      await createRequest({
        type: type === 'blood' ? 'Blood' : 'Organ',
        item: type === 'blood' ? item.bloodGroup : item.organType,
        hospitalId: item.hospitalId,
        message
      });
      alert('Request submitted successfully! Hospital will contact you.');
    } catch (error) {
      alert('Failed to submit request');
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.header}>
          <Link to="/" style={styles.backBtn}>← Back</Link>
          <h1 style={styles.title}>Search {type === 'blood' ? 'Blood' : 'Organ'}</h1>
          {!token && (
            <Link to="/user-login" style={styles.loginBtn}>Login to Request</Link>
          )}
        </div>
        
        <div style={styles.searchCard}>
          <div style={styles.form}>
            <select value={selection} onChange={(e) => setSelection(e.target.value)} style={styles.input}>
              <option value="">Select {type === 'blood' ? 'Blood Group' : 'Organ'}</option>
              {(type === 'blood' ? bloodGroups : organs).map(item => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            
            <input
              type="text"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={styles.input}
            />
            
            <button onClick={handleSearch} style={styles.button} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        <div style={styles.results}>
          {results.length === 0 && !loading && (
            <div style={styles.noResults}>
              <p>No results found. Try different search criteria.</p>
            </div>
          )}
          {results.map((item, idx) => (
            <div key={idx} style={{...styles.card, ...(item.isOutdated && styles.outdated)}}>
              <div style={styles.cardHeader}>
                <h3 style={styles.hospitalName}>{item.hospitalName}</h3>
                {item.isOutdated && <span style={styles.badge}>Outdated</span>}
              </div>
              <p style={styles.cardInfo}>{item.address}</p>
              <p style={styles.cardInfo}>Contact: {item.contactNumber}</p>
              {type === 'blood' ? (
                <>
                  <div style={styles.availability}>
                    <span style={styles.label}>Blood Group:</span>
                    <span style={styles.value}>{item.bloodGroup}</span>
                  </div>
                  <div style={styles.availability}>
                    <span style={styles.label}>Units Available:</span>
                    <span style={{...styles.value, ...styles.units}}>{item.unitsAvailable}</span>
                  </div>
                </>
              ) : (
                <>
                  <div style={styles.availability}>
                    <span style={styles.label}>Organ:</span>
                    <span style={styles.value}>{item.organType}</span>
                  </div>
                  <div style={styles.availability}>
                    <span style={styles.label}>Status:</span>
                    <span style={{...styles.value, color: item.status === 'Available' ? '#dc2626' : '#666'}}>
                      {item.status}
                    </span>
                  </div>
                </>
              )}
              <p style={styles.timestamp}>
                Updated: {new Date(item.lastUpdated).toLocaleString()}
              </p>
              <button onClick={() => handleRequest(item)} style={styles.requestBtn}>
                Request {type === 'blood' ? 'Blood' : 'Organ'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { minHeight: '100vh', padding: '20px' },
  container: { maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' },
  backBtn: { padding: '10px 20px', background: '#fff', borderRadius: '8px', color: '#dc2626', fontWeight: '600', fontSize: '1rem' },
  loginBtn: { padding: '10px 20px', background: '#fff', borderRadius: '8px', color: '#dc2626', fontWeight: '600', fontSize: '1rem', marginLeft: 'auto' },
  title: { color: '#fff', fontSize: '2rem', fontWeight: '700' },
  searchCard: { background: '#fff', borderRadius: '12px', padding: '30px', marginBottom: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' },
  form: { display: 'flex', gap: '15px', flexWrap: 'wrap' },
  input: { flex: '1', minWidth: '200px', padding: '15px', fontSize: '16px', border: '2px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fff' },
  button: { padding: '15px 40px', fontSize: '16px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  results: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' },
  card: { padding: '25px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' },
  outdated: { background: '#fff3cd', border: '2px solid #ffc107' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  hospitalName: { fontSize: '1.3rem', color: '#dc2626', fontWeight: '600', margin: 0 },
  badge: { padding: '5px 12px', background: '#ffc107', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', color: '#000' },
  cardInfo: { margin: '8px 0', color: '#555', fontSize: '0.95rem' },
  availability: { display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8f9fa', borderRadius: '8px', margin: '10px 0' },
  label: { fontWeight: '600', color: '#666' },
  value: { fontWeight: '700', color: '#333', fontSize: '1.1rem' },
  units: { color: '#dc2626' },
  timestamp: { fontSize: '0.85rem', color: '#999', marginTop: '15px', fontStyle: 'italic' },
  requestBtn: { width: '100%', padding: '12px', marginTop: '15px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem' },
  noResults: { gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '12px', fontSize: '1.2rem', color: '#666' }
};

export default Search;
