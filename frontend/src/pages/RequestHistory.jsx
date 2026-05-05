import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMyRequests } from '../services/api';
import { AuthContext } from '../context/AuthContext.jsx';

const RequestHistory = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const STATUS_COLORS = { 'Pending': '#d97706', 'Will Contact': '#3b82f6', 'Contacted': '#8b5cf6', 'Fulfilled': '#059669', 'Rejected': '#dc2626' };
  const STATUS_BG = { 'Pending': '#fffbeb', 'Will Contact': '#eff6ff', 'Contacted': '#f5f3ff', 'Fulfilled': '#ecfdf5', 'Rejected': '#fef2f2' };

  const navItems = [
    { key: 'all', icon: '📋', label: 'All Requests' },
    { key: 'Blood', icon: '🩸', label: 'Blood Requests' },
    { key: 'Organ', icon: '🫀', label: 'Organ Requests' },
  ];

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await getMyRequests();
      setRequests(data);
    } catch (error) { console.error('Failed to fetch requests'); }
    setLoading(false);
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const filtered = activeTab === 'all' ? requests : requests.filter(r => r.type === activeTab);

  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <div style={styles.sidebar} className="glass-card">
        <div style={styles.sidebarTop}>
          <div style={styles.userBadge}>Patient</div>
          <div style={styles.userName}>{user?.name || 'User'}</div>
        </div>
        <nav style={styles.nav}>
          {navItems.map(item => (
            <button key={item.key} onClick={() => setActiveTab(item.key)} style={{ ...styles.navItem, ...(activeTab === item.key ? styles.navItemActive : {}) }}>
              <span style={styles.navIcon}>{item.icon}</span>
              <span style={styles.navLabel}>{item.label}</span>
              <span style={styles.navBadge}>
                {item.key === 'all' ? requests.length : requests.filter(r => r.type === item.key).length}
              </span>
            </button>
          ))}
        </nav>
        <div style={styles.sidebarBottom}>
          <Link to="/search/blood" className="btn btn-primary" style={styles.searchBtn}>🔍 Search Resources</Link>
          <button onClick={handleLogout} className="btn btn-outline" style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>{navItems.find(n => n.key === activeTab)?.icon} {navItems.find(n => n.key === activeTab)?.label}</h1>
          <p style={styles.pageSubtitle}>Track the status of your submitted requests.</p>
        </div>

        {loading ? (
          <div style={styles.loading}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyState} className="white-card animate-fade">
            <div style={styles.emptyIcon}>📄</div>
            <h2 style={styles.emptyTitle}>No requests found</h2>
            <p style={styles.emptyText}>You haven't submitted any {activeTab !== 'all' ? activeTab.toLowerCase() : ''} requests yet.</p>
            <Link to="/search/blood" className="btn btn-primary" style={{marginTop: '10px'}}>Search Resources</Link>
          </div>
        ) : (
          <div style={styles.grid}>
            {filtered.map((req, idx) => (
              <div key={idx} style={styles.card} className="white-card animate-fade">
                <div style={styles.cardTop}>
                  <span style={{ ...styles.statusBadge, background: STATUS_BG[req.status] || '#f1f5f9', color: STATUS_COLORS[req.status] || '#64748b' }}>{req.status}</span>
                  <span style={styles.typeBadge}>{req.type}</span>
                </div>
                <h3 style={styles.itemTitle}>{req.item} Request</h3>
                <div style={styles.infoRow}><span style={styles.infoLabel}>Sent to:</span><span style={styles.infoValue}>{req.hospital_name || 'Verification Pending'}</span></div>
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
  wrapper: { display: 'flex', minHeight: '100vh' },
  sidebar: { width: '260px', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '30px 20px', position: 'sticky', top: 0, borderRadius: 0 },
  sidebarTop: { marginBottom: '40px' },
  userBadge: { background: 'rgba(220,38,38,0.15)', color: '#dc2626', padding: '4px 12px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', display: 'inline-block', marginBottom: '10px' },
  userName: { fontSize: '1.1rem', fontWeight: '700', color: '#fff' },
  nav: { display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 },
  navItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: 'none', background: 'transparent', color: '#94a3b8', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', fontSize: '0.95rem' },
  navItemActive: { background: 'rgba(255,255,255,0.1)', color: '#fff' },
  navIcon: { fontSize: '1.1rem', minWidth: '24px' },
  navLabel: { flex: 1 },
  navBadge: { background: 'rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '100px', fontSize: '0.7rem', fontWeight: '700', padding: '2px 8px' },
  sidebarBottom: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' },
  searchBtn: { width: '100%', textAlign: 'center', textDecoration: 'none' },
  logoutBtn: { width: '100%' },
  main: { flex: 1, padding: '40px', overflowY: 'auto' },
  pageHeader: { marginBottom: '30px' },
  pageTitle: { fontSize: '2rem', fontWeight: '800', margin: 0 },
  pageSubtitle: { color: '#94a3b8', marginTop: '8px' },
  loading: { textAlign: 'center', padding: '100px', fontSize: '1.2rem', color: '#fff' },
  emptyState: { padding: '60px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' },
  emptyIcon: { fontSize: '3.5rem' },
  emptyTitle: { fontSize: '1.6rem', fontWeight: '700', color: '#0f172a' },
  emptyText: { color: '#64748b', fontSize: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px' },
  card: { padding: '25px', display: 'flex', flexDirection: 'column', gap: '16px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { padding: '5px 14px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: '700' },
  typeBadge: { background: '#f1f5f9', color: '#64748b', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' },
  itemTitle: { fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: 0 },
  infoRow: { display: 'flex', gap: '10px', fontSize: '0.95rem' },
  infoLabel: { color: '#94a3b8', fontWeight: '600' },
  infoValue: { color: '#0f172a', fontWeight: '700' },
  msgBlock: { background: '#f8fafc', padding: '14px', borderRadius: '10px' },
  msgText: { color: '#64748b', fontStyle: 'italic', margin: '5px 0 0' },
  cardFooter: { borderTop: '1px solid #f1f5f9', paddingTop: '12px' },
  timestamp: { fontSize: '0.85rem', color: '#94a3b8' },
};

export default RequestHistory;
