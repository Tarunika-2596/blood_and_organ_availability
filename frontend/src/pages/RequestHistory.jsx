import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyRequests } from '../services/api';

const RequestHistory = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await getMyRequests();
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch requests');
    }
    setLoading(false);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.header} className="animate-fade">
          <Link to="/" style={styles.backLink}>← Back to Search</Link>
          <h1 style={styles.title}>My Request History</h1>
          <p style={styles.subtitle}>Track your submissions for blood and organ resources.</p>
        </div>

        {loading ? (
          <div style={styles.loading}>Loading your history...</div>
        ) : requests.length === 0 ? (
          <div style={styles.empty} className="white-card animate-fade">
            <div style={styles.emptyIcon}>📄</div>
            <h2 style={styles.emptyTitle}>No requests found</h2>
            <p style={styles.emptyText}>You haven't submitted any requests for resources yet.</p>
            <Link to="/search/blood" className="btn btn-primary" style={styles.searchLink}>Search Resources</Link>
          </div>
        ) : (
          <div style={styles.grid}>
            {requests.map((req, idx) => (
              <div key={idx} style={styles.card} className="white-card animate-fade">
                <div style={styles.cardTop}>
                  <span style={{
                    ...styles.statusBadge, 
                    background: req.status === 'Approved' ? '#ecfdf5' : req.status === 'Pending' ? '#fffbeb' : '#fef2f2',
                    color: req.status === 'Approved' ? '#059669' : req.status === 'Pending' ? '#d97706' : '#dc2626'
                  }}>
                    {req.status}
                  </span>
                  <span style={styles.typeBadge}>{req.type}</span>
                </div>
                
                <h3 style={styles.itemTitle}>{req.item} Request</h3>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Sent to:</span>
                  <span style={styles.infoValue}>{req.hospital_name || 'Verification Pending'}</span>
                </div>
                
                <div style={styles.msgBlock}>
                  <div style={styles.infoLabel}>My Message:</div>
                  <p style={styles.msgText}>"{req.message}"</p>
                </div>
                
                <div style={styles.cardFooter}>
                  <span style={styles.timestamp}>Submitted: {new Date(req.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: { minHeight: '100vh', padding: '60px 20px' },
  container: { maxWidth: '1000px', margin: '0 auto' },
  header: { marginBottom: '50px', display: 'flex', flexDirection: 'column', gap: '15px' },
  backLink: { color: '#94a3b8', textDecoration: 'none', fontWeight: '600' },
  title: { fontSize: '2.8rem', fontWeight: '800', margin: 0, letterSpacing: '-1px' },
  subtitle: { color: '#94a3b8', fontSize: '1.2rem', fontWeight: '300' },
  loading: { textAlign: 'center', padding: '100px', fontSize: '1.2rem', color: '#fff' },
  empty: { padding: '80px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' },
  emptyIcon: { fontSize: '4rem' },
  emptyTitle: { fontSize: '1.8rem', fontWeight: '700', color: '#0f172a' },
  emptyText: { color: '#64748b', fontSize: '1.1rem' },
  searchLink: { marginTop: '10px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '25px' },
  card: { padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { padding: '6px 14px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: '700' },
  typeBadge: { background: '#f1f5f9', color: '#64748b', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' },
  itemTitle: { fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', margin: 0 },
  infoRow: { display: 'flex', gap: '10px', fontSize: '1rem' },
  infoLabel: { color: '#94a3b8', fontWeight: '600' },
  infoValue: { color: '#0f172a', fontWeight: '700' },
  msgBlock: { background: '#f8fafc', padding: '15px', borderRadius: '12px' },
  msgText: { color: '#64748b', fontStyle: 'italic', margin: '5px 0 0' },
  cardFooter: { marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '15px' },
  timestamp: { fontSize: '0.85rem', color: '#94a3b8' }
};

export default RequestHistory;
