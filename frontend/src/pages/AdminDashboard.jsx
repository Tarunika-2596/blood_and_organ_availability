import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminHospitals, getAdminLogs, approveHospital, disableHospital } from '../services/api';
import { AuthContext } from '../context/AuthContext.jsx';

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('hospitals');

  const navItems = [
    { key: 'hospitals', icon: '🏥', label: 'Hospitals', badge: hospitals.length },
    { key: 'logs', icon: '📋', label: 'Activity Logs', badge: logs.length },
  ];

  const loadData = useCallback(async () => {
    try {
      if (activeTab === 'hospitals') {
        const { data } = await getAdminHospitals();
        setHospitals(data);
      } else {
        const { data } = await getAdminLogs();
        setLogs(data);
      }
    } catch (error) {
      alert('Failed to load data');
    }
  }, [activeTab]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleApprove = async (id) => {
    try { await approveHospital(id); alert('Hospital approved successfully'); loadData(); }
    catch (error) { alert('Failed to approve'); }
  };

  const handleDisable = async (id) => {
    if (!window.confirm('Are you sure you want to disable this hospital?')) return;
    try { await disableHospital(id); alert('Hospital disabled'); loadData(); }
    catch (error) { alert('Failed to disable'); }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const renderContent = () => {
    if (activeTab === 'hospitals') return (
      <div style={styles.tableWrapper} className="white-card animate-fade">
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>FACILITY NAME</th>
              <th style={styles.th}>LOCATION</th>
              <th style={styles.th}>CONTACT</th>
              <th style={styles.th}>STATUS</th>
              <th style={styles.th}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {hospitals.map(hospital => (
              <tr key={hospital.id} style={styles.tr}>
                <td style={styles.td}>
                  <div style={styles.hospitalName}>{hospital.name}</div>
                  <div style={styles.hospitalAddr}>{hospital.address}</div>
                </td>
                <td style={styles.td}>{hospital.city}</td>
                <td style={styles.td}>{hospital.contactNumber}</td>
                <td style={styles.td}>
                  <div style={styles.statusGroup}>
                    {hospital.isApproved ? <span style={styles.approvedLabel}>Verified</span> : <span style={styles.pendingLabel}>Pending</span>}
                    {!hospital.isActive && <span style={styles.disabledLabel}>Inactive</span>}
                  </div>
                </td>
                <td style={styles.td}>
                  <div style={styles.actionButtons}>
                    {!hospital.isApproved && <button onClick={() => handleApprove(hospital.id)} className="btn btn-primary" style={styles.actionBtn}>Approve</button>}
                    {hospital.isActive && <button onClick={() => handleDisable(hospital.id)} className="btn btn-outline" style={{...styles.actionBtn, color: '#dc2626'}}>Disable</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    if (activeTab === 'logs') return (
      <div style={styles.logsGrid} className="animate-fade">
        {logs.map((log, idx) => (
          <div key={idx} style={styles.logCard} className="white-card">
            <div style={styles.logHeader}>
              <div>
                <h3 style={styles.logHospital}>{log.hospitalName}</h3>
                <span style={styles.logTypeBadge}>{log.type} Update</span>
              </div>
              <div style={styles.logTime}>{new Date(log.timestamp).toLocaleDateString()}</div>
            </div>
            <div style={styles.logBody}>
              <div style={styles.logField}>Modified: <strong>{log.updatedField}</strong></div>
              <div style={styles.logChange}>
                <span style={styles.oldVal}>{log.previousValue || 'None'}</span>
                <span style={styles.arrow}>→</span>
                <span style={styles.newVal}>{log.newValue}</span>
              </div>
            </div>
            <div style={styles.logFooter}>{new Date(log.timestamp).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <div style={styles.sidebar} className="glass-card">
        <div style={styles.sidebarTop}>
          <div style={styles.adminBadge}>System Admin</div>
          <div style={styles.adminTitle}>Network Oversight</div>
        </div>
        <nav style={styles.nav}>
          {navItems.map(item => (
            <button key={item.key} onClick={() => setActiveTab(item.key)} style={{ ...styles.navItem, ...(activeTab === item.key ? styles.navItemActive : {}) }}>
              <span style={styles.navIcon}>{item.icon}</span>
              <span style={styles.navLabel}>{item.label}</span>
              {item.badge > 0 && <span style={styles.navBadge}>{item.badge}</span>}
            </button>
          ))}
        </nav>
        <div style={styles.sidebarBottom}>
          <button onClick={loadData} className="btn btn-outline" style={styles.refreshBtn}>🔄 Refresh</button>
          <button onClick={handleLogout} className="btn btn-primary" style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>
            {navItems.find(n => n.key === activeTab)?.icon} {navItems.find(n => n.key === activeTab)?.label}
          </h1>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

const styles = {
  wrapper: { display: 'flex', minHeight: '100vh' },
  sidebar: { width: '260px', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '30px 20px', position: 'sticky', top: 0, borderRadius: 0 },
  sidebarTop: { marginBottom: '40px' },
  adminBadge: { background: 'rgba(220,38,38,0.15)', color: '#dc2626', padding: '4px 12px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', display: 'inline-block', marginBottom: '10px' },
  adminTitle: { fontSize: '1.1rem', fontWeight: '700', color: '#fff' },
  nav: { display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 },
  navItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: 'none', background: 'transparent', color: '#94a3b8', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', fontSize: '0.95rem' },
  navItemActive: { background: 'rgba(255,255,255,0.1)', color: '#fff' },
  navIcon: { fontSize: '1.1rem', minWidth: '24px' },
  navLabel: { flex: 1 },
  navBadge: { background: '#dc2626', color: '#fff', borderRadius: '100px', fontSize: '0.7rem', fontWeight: '700', padding: '2px 8px', minWidth: '20px', textAlign: 'center' },
  sidebarBottom: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' },
  refreshBtn: { width: '100%' },
  logoutBtn: { width: '100%' },
  main: { flex: 1, padding: '40px', overflowY: 'auto' },
  pageHeader: { marginBottom: '30px' },
  pageTitle: { fontSize: '2rem', fontWeight: '800', margin: 0 },
  tableWrapper: { padding: '20px', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '700px' },
  th: { textAlign: 'left', padding: '16px', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', letterSpacing: '1px', borderBottom: '1px solid #f1f5f9' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '18px 16px', color: '#0f172a' },
  hospitalName: { fontWeight: '700', fontSize: '1rem', color: '#0f172a' },
  hospitalAddr: { fontSize: '0.85rem', color: '#64748b', marginTop: '4px' },
  statusGroup: { display: 'flex', gap: '8px' },
  approvedLabel: { background: '#ecfdf5', color: '#059669', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700' },
  pendingLabel: { background: '#fffbeb', color: '#d97706', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700' },
  disabledLabel: { background: '#fef2f2', color: '#dc2626', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700' },
  actionButtons: { display: 'flex', gap: '8px' },
  actionBtn: { padding: '8px 16px', fontSize: '0.85rem' },
  logsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' },
  logCard: { padding: '25px', display: 'flex', flexDirection: 'column', gap: '16px' },
  logHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  logHospital: { fontSize: '1rem', fontWeight: '700', margin: 0, color: '#0f172a' },
  logTypeBadge: { display: 'inline-block', marginTop: '6px', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: '#dc2626' },
  logTime: { fontSize: '0.85rem', color: '#94a3b8' },
  logBody: { background: '#f8fafc', padding: '15px', borderRadius: '12px' },
  logField: { fontSize: '0.9rem', color: '#64748b', marginBottom: '10px' },
  logChange: { display: 'flex', alignItems: 'center', gap: '12px' },
  oldVal: { color: '#94a3b8', textDecoration: 'line-through' },
  arrow: { color: '#cbd5e1' },
  newVal: { color: '#0f172a', fontWeight: '700' },
  logFooter: { fontSize: '0.8rem', color: '#94a3b8', textAlign: 'right' },
};

export default AdminDashboard;
