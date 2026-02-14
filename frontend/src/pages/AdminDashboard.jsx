import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminHospitals, getAdminLogs, approveHospital, disableHospital } from '../services/api';
import { AuthContext } from '../context/AuthContext.jsx';

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('hospitals');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
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
  };

  const handleApprove = async (id) => {
    try {
      await approveHospital(id);
      alert('Hospital approved');
      loadData();
    } catch (error) {
      alert('Failed to approve');
    }
  };

  const handleDisable = async (id) => {
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
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Admin Dashboard</h1>
            <p style={styles.subtitle}>Manage hospitals and monitor system activity</p>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>

        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab('hospitals')}
            style={{...styles.tab, ...(activeTab === 'hospitals' && styles.activeTab)}}
          >
            Hospitals ({hospitals.length})
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            style={{...styles.tab, ...(activeTab === 'logs' && styles.activeTab)}}
          >
            Update Logs ({logs.length})
          </button>
        </div>

        {activeTab === 'hospitals' ? (
          <div style={styles.tableCard}>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Hospital Name</th>
                    <th style={styles.th}>City</th>
                    <th style={styles.th}>Contact</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hospitals.map(hospital => (
                    <tr key={hospital._id} style={styles.tr}>
                      <td style={styles.td}>{hospital.name}</td>
                      <td style={styles.td}>{hospital.city}</td>
                      <td style={styles.td}>{hospital.contactNumber}</td>
                      <td style={styles.td}>
                        {hospital.isApproved ? (
                          <span style={styles.approved}>Approved</span>
                        ) : (
                          <span style={styles.pending}>Pending</span>
                        )}
                        {!hospital.isActive && <span style={styles.disabled}> Disabled</span>}
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actions}>
                          {!hospital.isApproved && (
                            <button onClick={() => handleApprove(hospital._id)} style={styles.approveBtn}>
                              Approve
                            </button>
                          )}
                          {hospital.isActive && (
                            <button onClick={() => handleDisable(hospital._id)} style={styles.disableBtn}>
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
          </div>
        ) : (
          <div style={styles.logsContainer}>
            {logs.map((log, idx) => (
              <div key={idx} style={styles.logCard}>
                <div style={styles.logHeader}>
                  <h3 style={styles.logTitle}>{log.hospitalId?.name}</h3>
                  <span style={styles.logBadge}>{log.type}</span>
                </div>
                <div style={styles.logContent}>
                  <p><strong>Field:</strong> {log.updatedField}</p>
                  <p><strong>Change:</strong> "{log.previousValue}" → "{log.newValue}"</p>
                </div>
                <p style={styles.timestamp}>{new Date(log.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: { minHeight: '100vh', padding: '20px' },
  container: { maxWidth: '1400px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px', background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' },
  title: { color: '#dc2626', fontSize: '2rem', margin: 0, fontWeight: '700' },
  subtitle: { color: '#666', marginTop: '5px', fontSize: '1rem' },
  logoutBtn: { padding: '12px 25px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem' },
  tabs: { display: 'flex', gap: '15px', marginBottom: '25px', flexWrap: 'wrap' },
  tab: { padding: '15px 30px', border: '2px solid #fff', background: '#fff', cursor: 'pointer', borderRadius: '8px', fontWeight: '600', fontSize: '1rem', color: '#666' },
  activeTab: { background: '#dc2626', color: 'white', border: '2px solid #dc2626' },
  tableCard: { background: '#fff', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', overflowX: 'auto' },
  tableContainer: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '800px' },
  th: { padding: '15px', textAlign: 'left', borderBottom: '2px solid #e0e0e0', backgroundColor: '#f8f9fa', fontWeight: '600', color: '#333' },
  tr: { transition: 'background 0.2s' },
  td: { padding: '15px', borderBottom: '1px solid #e0e0e0' },
  approved: { padding: '5px 12px', background: '#d4edda', color: '#155724', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '600' },
  pending: { padding: '5px 12px', background: '#fff3cd', color: '#856404', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '600' },
  disabled: { padding: '5px 12px', background: '#f8d7da', color: '#721c24', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '600', marginLeft: '5px' },
  actions: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  approveBtn: { padding: '8px 16px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' },
  disableBtn: { padding: '8px 16px', background: '#666', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' },
  logsContainer: { display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' },
  logCard: { padding: '20px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
  logHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '10px', borderBottom: '2px solid #f0f0f0' },
  logTitle: { margin: 0, color: '#dc2626', fontSize: '1.1rem', fontWeight: '600' },
  logBadge: { padding: '5px 12px', background: '#fee', color: '#dc2626', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' },
  logContent: { marginBottom: '15px', lineHeight: '1.8', color: '#555' },
  timestamp: { fontSize: '0.85rem', color: '#999', fontStyle: 'italic' }
};

export default AdminDashboard;
