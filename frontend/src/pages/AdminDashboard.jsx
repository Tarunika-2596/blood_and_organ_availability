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

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApprove = async (id) => {
    try {
      await approveHospital(id);
      alert('Hospital approved successfully');
      loadData();
    } catch (error) {
      alert('Failed to approve');
    }
  };

  const handleDisable = async (id) => {
    if (!window.confirm('Are you sure you want to disable this hospital?')) return;
    try {
      await disableHospital(id);
      alert('Hospital disabled');
      loadData();
    } catch (error) {
      alert('Failed to disable');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.header} className="glass-card animate-fade">
          <div style={styles.headerInfo}>
            <div style={styles.adminBadge}>System Admin</div>
            <h1 style={styles.title}>Network Oversight</h1>
            <p style={styles.subtitle}>Manage medical facilities and audit system updates.</p>
          </div>
          <button onClick={handleLogout} className="btn btn-primary" style={styles.logoutBtn}>Logout Admin</button>
        </div>

        <div style={styles.controls} className="animate-fade">
          <div style={styles.tabs}>
            <button
              onClick={() => setActiveTab('hospitals')}
              style={{...styles.tab, ...(activeTab === 'hospitals' && styles.activeTab)}}
            >
              Registered Hospitals ({hospitals.length})
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              style={{...styles.tab, ...(activeTab === 'logs' && styles.activeTab)}}
            >
              Activity Logs ({logs.length})
            </button>
          </div>
          <button onClick={loadData} className="btn btn-outline" style={styles.refreshBtn}>Refresh Data</button>
        </div>

        {activeTab === 'hospitals' ? (
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
                        {hospital.isApproved ? (
                          <span style={styles.approvedLabel}>Verified</span>
                        ) : (
                          <span style={styles.pendingLabel}>Pending</span>
                        )}
                        {!hospital.isActive && <span style={styles.disabledLabel}>Inactive</span>}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionButtons}>
                        {!hospital.isApproved && (
                          <button onClick={() => handleApprove(hospital.id)} className="btn btn-primary" style={styles.actionBtn}>
                            Approve
                          </button>
                        )}
                        {hospital.isActive && (
                          <button onClick={() => handleDisable(hospital.id)} className="btn btn-outline" style={{...styles.actionBtn, color: '#dc2626'}}>
                            Disable
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
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
                <div style={styles.logFooter}>
                  {new Date(log.timestamp).toLocaleTimeString()}
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
  container: { maxWidth: '1200px', margin: '0 auto' },
  header: { padding: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  adminBadge: { display: 'inline-block', background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '10px' },
  title: { fontSize: '2.8rem', fontWeight: '800', margin: 0, letterSpacing: '-1px' },
  subtitle: { color: '#94a3b8', fontSize: '1.1rem', fontWeight: '300', marginTop: '5px' },
  logoutBtn: { padding: '16px 32px' },
  controls: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' },
  tabs: { display: 'flex', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '14px' },
  tab: { padding: '12px 24px', borderRadius: '10px', border: 'none', background: 'transparent', color: '#94a3b8', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' },
  activeTab: { background: '#fff', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  refreshBtn: { borderRadius: '10px' },
  tableWrapper: { padding: '20px', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '900px' },
  th: { textAlign: 'left', padding: '16px', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', letterSpacing: '1px', borderBottom: '1px solid #f1f5f9' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '20px 16px', color: '#0f172a' },
  hospitalName: { fontWeight: '700', fontSize: '1.1rem', color: '#0f172a' },
  hospitalAddr: { fontSize: '0.85rem', color: '#64748b', marginTop: '4px' },
  statusGroup: { display: 'flex', gap: '8px' },
  approvedLabel: { background: '#ecfdf5', color: '#059669', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700' },
  pendingLabel: { background: '#fffbeb', color: '#d97706', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700' },
  disabledLabel: { background: '#fef2f2', color: '#dc2626', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700' },
  actionButtons: { display: 'flex', gap: '8px' },
  actionBtn: { padding: '8px 16px', fontSize: '0.85rem' },
  logsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' },
  logCard: { padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px' },
  logHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  logHospital: { fontSize: '1.1rem', fontWeight: '700', margin: 0, color: '#0f172a' },
  logTypeBadge: { display: 'inline-block', marginTop: '6px', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: '#dc2626' },
  logTime: { fontSize: '0.85rem', color: '#94a3b8' },
  logBody: { background: '#f8fafc', padding: '15px', borderRadius: '12px' },
  logField: { fontSize: '0.9rem', color: '#64748b', marginBottom: '10px' },
  logChange: { display: 'flex', alignItems: 'center', gap: '12px' },
  oldVal: { color: '#94a3b8', textDecoration: 'line-through' },
  arrow: { color: '#cbd5e1' },
  newVal: { color: '#0f172a', fontWeight: '700' },
  logFooter: { marginTop: 'auto', fontSize: '0.8rem', color: '#94a3b8', textAlign: 'right' }
};

export default AdminDashboard;
