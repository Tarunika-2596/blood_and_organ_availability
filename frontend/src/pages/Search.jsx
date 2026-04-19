import React, { useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { searchBlood, searchOrgans, createRequest } from '../services/api';
import { AuthContext } from '../context/AuthContext.jsx';

const Search = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [city, setCity] = useState('');
  const [selection, setSelection] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const organs = ['Kidney', 'Liver', 'Heart', 'Lungs', 'Pancreas', 'Cornea'];

  const handleSearch = async () => {
    if (!selection) return alert(`Please select a ${type === 'blood' ? 'blood group' : 'organ'}`);
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
        <div style={styles.navbar} className="animate-fade">
          <Link to="/" style={styles.backLink}>← Back to Home</Link>
          <div style={styles.navRight}>
            {token ? (
              <Link to="/request-history" className="btn btn-outline" style={styles.historyBtn}>My Requests</Link>
            ) : (
              <Link to="/user-login" className="btn btn-primary" style={styles.loginBtn}>Login to Request</Link>
            )}
          </div>
        </div>

        <section style={styles.headerSection} className="animate-fade">
          <h1 style={styles.title}>Find {type === 'blood' ? 'Blood Banks' : 'Available Organs'}</h1>
          <p style={styles.subtitle}>Enter details below to search across our network of verified hospitals.</p>
        </section>
        
        <div style={styles.searchPanel} className="glass-card animate-fade">
          <div style={styles.formGroup}>
            <label style={styles.label}>Select {type === 'blood' ? 'Blood Group' : 'Organ Type'}</label>
            <select value={selection} onChange={(e) => setSelection(e.target.value)} className="input-field" style={styles.select}>
              <option value="">Choose...</option>
              {(type === 'blood' ? bloodGroups : organs).map(item => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>City/Location</label>
            <input
              type="text"
              placeholder="e.g. Chennai, Mumbai"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="input-field"
            />
          </div>
          
          <button onClick={handleSearch} className="btn btn-primary" style={styles.searchBtn} disabled={loading}>
            {loading ? 'Searching...' : 'Search Now'}
          </button>
        </div>

        <div style={styles.resultsGrid}>
          {results.length === 0 && !loading && (
            <div style={styles.emptyState} className="animate-fade">
              <div style={styles.emptyIcon}>🔍</div>
              <h3 style={styles.emptyTitle}>No results found yet</h3>
              <p style={styles.emptyText}>Adjust your search criteria to find available stock.</p>
            </div>
          )}
          
          {results.map((item, idx) => (
            <div key={idx} style={styles.resultCard} className={`white-card animate-fade`}>
              <div style={styles.cardHeader}>
                <h3 style={styles.hospitalName}>{item.hospitalName}</h3>
                {item.isOutdated ? (
                  <span style={styles.outdatedBadge}>Outdated</span>
                ) : (
                  <span style={styles.activeBadge}>Fresh</span>
                )}
              </div>
              
              <div style={styles.hospitalInfo}>
                <p style={styles.address}>📍 {item.address}</p>
                <p style={styles.contact}>📞 {item.contactNumber}</p>
              </div>

              <div style={styles.dataBlock}>
                <div style={styles.dataItem}>
                  <span style={styles.dataLabel}>{type === 'blood' ? 'Group' : 'Organ'}</span>
                  <span style={styles.dataValue}>{type === 'blood' ? item.bloodGroup : item.organType}</span>
                </div>
                <div style={styles.dataItem}>
                   <span style={styles.dataLabel}>{type === 'blood' ? 'Units' : 'Status'}</span>
                   <span style={{...styles.dataValue, color: item.status === 'Available' || item.unitsAvailable > 0 ? '#10b981' : '#dc2626'}}>
                    {type === 'blood' ? item.unitsAvailable : item.status}
                   </span>
                </div>
              </div>

              <div style={styles.cardFooter}>
                <p style={styles.updatedAt}>Last updated: {new Date(item.lastUpdated).toLocaleString()}</p>
                {token ? (
                <button onClick={() => handleRequest(item)} className="btn btn-primary" style={styles.requestBtn}>
                  Request {type === 'blood' ? 'Blood' : 'Organ'}
                </button>
              ) : (
                <Link to="/user-login" className="btn btn-outline" style={styles.requestBtn}>
                  🔒 Login to Request
                </Link>
              )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { minHeight: '100vh', padding: '40px 20px' },
  container: { maxWidth: '1200px', margin: '0 auto' },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' },
  backLink: { color: '#94a3b8', textDecoration: 'none', fontWeight: '500', fontSize: '1rem' },
  navRight: { display: 'flex', gap: '15px' },
  headerSection: { textAlign: 'center', marginBottom: '50px' },
  title: { fontSize: '3rem', fontWeight: '800', marginBottom: '10px' },
  subtitle: { fontSize: '1.2rem', color: '#94a3b8', fontWeight: '300' },
  searchPanel: { 
    padding: '40px', 
    display: 'flex', 
    gap: '20px', 
    alignItems: 'flex-end', 
    flexWrap: 'wrap',
    marginBottom: '60px',
  },
  formGroup: { flex: '1', minWidth: '250px', display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '0.9rem', fontWeight: '600', color: '#94a3b8', letterSpacing: '0.5px' },
  searchBtn: { height: '52px', padding: '0 40px' },
  resultsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '30px' },
  resultCard: { padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  hospitalName: { fontSize: '1.4rem', fontWeight: '700', color: '#0f172a', margin: 0 },
  activeBadge: { background: '#ecfdf5', color: '#059669', padding: '4px 12px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: '700' },
  outdatedBadge: { background: '#fef2f2', color: '#dc2626', padding: '4px 12px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: '700' },
  hospitalInfo: { display: 'flex', flexDirection: 'column', gap: '8px' },
  address: { color: '#64748b', fontSize: '0.95rem' },
  contact: { color: '#64748b', fontSize: '0.95rem', fontWeight: '600' },
  dataBlock: { 
    display: 'grid', 
    gridTemplateColumns: '1fr 1fr', 
    gap: '20px', 
    padding: '20px', 
    background: '#f8fafc', 
    borderRadius: '12px' 
  },
  dataItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  dataLabel: { fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' },
  dataValue: { fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' },
  cardFooter: { marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' },
  updatedAt: { fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' },
  requestBtn: { width: '100%' },
  emptyState: { gridColumn: '1/-1', textAlign: 'center', padding: '80px 20px' },
  emptyIcon: { fontSize: '4rem', marginBottom: '20px' },
  emptyTitle: { fontSize: '1.8rem', fontWeight: '700', color: '#fff', marginBottom: '10px' },
  emptyText: { color: '#94a3b8', fontSize: '1.1rem' }
};

export default Search;
