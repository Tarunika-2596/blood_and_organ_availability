import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateBlood, updateOrgan, getHospitalRequests, getMyHospital, updateMyHospital, getMyBloodStock, getMyOrgans } from '../services/api';
import { AuthContext } from '../context/AuthContext.jsx';

const HospitalDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bloodData, setBloodData] = useState({ bloodGroup: '', unitsAvailable: '' });
  const [organData, setOrganData] = useState({ organType: '', status: '' });
  const [bloodStock, setBloodStock] = useState([]);
  const [myOrgans, setMyOrgans] = useState([]);
  const [editingBlood, setEditingBlood] = useState({});
  const [editingOrgan, setEditingOrgan] = useState({});
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', address: '', city: '', contactNumber: '' });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const organs = ['Kidney', 'Liver', 'Heart', 'Lungs', 'Pancreas', 'Cornea'];

  useEffect(() => {
    if (activeTab === 'inventory') fetchInventory();
    if (activeTab === 'requests') fetchRequests();
    if (activeTab === 'profile') fetchProfile();
  }, [activeTab]);

  const fetchInventory = async () => {
    try {
      const [bloodRes, organRes] = await Promise.all([getMyBloodStock(), getMyOrgans()]);
      setBloodStock(bloodRes.data);
      setMyOrgans(organRes.data);
      const bEdits = {};
      bloodRes.data.forEach(b => { bEdits[b.bloodGroup] = b.unitsAvailable; });
      setEditingBlood(bEdits);
      const oEdits = {};
      organRes.data.forEach(o => { oEdits[o.organType] = o.status; });
      setEditingOrgan(oEdits);
    } catch (error) {
      console.error('Failed to fetch inventory');
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data } = await getMyHospital();
      setProfileData({ name: data.name, address: data.address, city: data.city, contactNumber: data.contactNumber });
    } catch (error) {
      console.error('Failed to fetch hospital profile');
    }
    setLoading(false);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateMyHospital(profileData);
      alert('Hospital details updated successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Update failed');
    }
    setLoading(false);
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await getHospitalRequests();
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch requests');
    }
    setLoading(false);
  };

  const handleBloodUpdate = async (bloodGroup) => {
    setLoading(true);
    try {
      await updateBlood({ bloodGroup, unitsAvailable: Number(editingBlood[bloodGroup]) });
      alert(`${bloodGroup} updated successfully`);
      fetchInventory();
    } catch (error) {
      alert(error.response?.data?.message || 'Update failed');
    }
    setLoading(false);
  };

  const handleOrganUpdate = async (organType) => {
    setLoading(true);
    try {
      await updateOrgan({ organType, status: editingOrgan[organType] });
      alert(`${organType} updated successfully`);
      fetchInventory();
    } catch (error) {
      alert(error.response?.data?.message || 'Update failed');
    }
    setLoading(false);
  };

  const handleAddBlood = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateBlood({ ...bloodData, unitsAvailable: Number(bloodData.unitsAvailable) });
      alert('Blood stock added successfully');
      setBloodData({ bloodGroup: '', unitsAvailable: '' });
      fetchInventory();
    } catch (error) {
      alert(error.response?.data?.message || 'Update failed');
    }
    setLoading(false);
  };

  const handleAddOrgan = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateOrgan(organData);
      alert('Organ availability added successfully');
      setOrganData({ organType: '', status: '' });
      fetchInventory();
    } catch (error) {
      alert(error.response?.data?.message || 'Update failed');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.header} className="glass-card animate-fade">
          <div style={styles.headerLeft}>
            <div style={styles.userBadge}>Hospital Staff</div>
            <h1 style={styles.title}>Portal Dashboard</h1>
            <p style={styles.welcome}>Logged in as <strong>{user?.name}</strong></p>
          </div>
          <button onClick={handleLogout} className="btn btn-outline" style={styles.logoutBtn}>Logout Session</button>
        </div>

        <div style={styles.tabContainer} className="animate-fade">
          <button 
            onClick={() => setActiveTab('inventory')} 
            style={{...styles.tab, ...(activeTab === 'inventory' && styles.activeTab)}}
          >
            📊 Inventory Management
          </button>
          <button 
            onClick={() => setActiveTab('requests')} 
            style={{...styles.tab, ...(activeTab === 'requests' && styles.activeTab)}}
          >
            📩 Patient Requests ({requests.length})
          </button>
          <button 
            onClick={() => setActiveTab('profile')} 
            style={{...styles.tab, ...(activeTab === 'profile' && styles.activeTab)}}
          >
            ✏️ Edit Profile
          </button>
        </div>

        {activeTab === 'inventory' ? (
          <div style={styles.inventoryContainer}>
            {/* Blood Stock */}
            <div style={styles.card} className="white-card animate-fade">
              <div style={styles.cardHeader}>
                <div style={styles.iconCircle}>🩸</div>
                <h2 style={styles.cardTitle}>Blood Inventory</h2>
              </div>
              {bloodStock.length > 0 && (
                <div style={styles.stockList}>
                  {bloodStock.map(b => (
                    <div key={b.bloodGroup} style={styles.stockRow}>
                      <span style={styles.stockLabel}>{b.bloodGroup}</span>
                      <input
                        type="number"
                        value={editingBlood[b.bloodGroup] ?? b.unitsAvailable}
                        onChange={(e) => setEditingBlood({...editingBlood, [b.bloodGroup]: e.target.value})}
                        className="input-field"
                        style={styles.stockInput}
                        min="0"
                      />
                      <span style={styles.stockUnit}>units</span>
                      <button onClick={() => handleBloodUpdate(b.bloodGroup)} className="btn btn-primary" style={styles.saveBtn} disabled={loading}>Save</button>
                    </div>
                  ))}
                </div>
              )}
              <div style={styles.divider} />
              <p style={styles.cardDesc}>Add a new blood group entry:</p>
              <form onSubmit={handleAddBlood} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Blood Group</label>
                  <select value={bloodData.bloodGroup} onChange={(e) => setBloodData({...bloodData, bloodGroup: e.target.value})} className="input-field" required>
                    <option value="">Select Group</option>
                    {bloodGroups.filter(bg => !bloodStock.find(b => b.bloodGroup === bg)).map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Units Available</label>
                  <input type="number" placeholder="e.g. 15" value={bloodData.unitsAvailable} onChange={(e) => setBloodData({...bloodData, unitsAvailable: e.target.value})} className="input-field" min="0" required />
                </div>
                <button type="submit" className="btn btn-primary" style={styles.submitBtn} disabled={loading}>{loading ? 'Adding...' : 'Add Blood Group'}</button>
              </form>
            </div>

            {/* Organ Availability */}
            <div style={styles.card} className="white-card animate-fade">
              <div style={styles.cardHeader}>
                <div style={styles.iconCircle}>🫀</div>
                <h2 style={styles.cardTitle}>Organ Availability</h2>
              </div>
              {myOrgans.length > 0 && (
                <div style={styles.stockList}>
                  {myOrgans.map(o => (
                    <div key={o.organType} style={styles.stockRow}>
                      <span style={styles.stockLabel}>{o.organType}</span>
                      <select
                        value={editingOrgan[o.organType] ?? o.status}
                        onChange={(e) => setEditingOrgan({...editingOrgan, [o.organType]: e.target.value})}
                        className="input-field"
                        style={styles.stockInput}
                      >
                        <option value="Available">Available</option>
                        <option value="Not Available">Not Available</option>
                      </select>
                      <button onClick={() => handleOrganUpdate(o.organType)} className="btn btn-primary" style={styles.saveBtn} disabled={loading}>Save</button>
                    </div>
                  ))}
                </div>
              )}
              <div style={styles.divider} />
              <p style={styles.cardDesc}>Add a new organ entry:</p>
              <form onSubmit={handleAddOrgan} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Organ Type</label>
                  <select value={organData.organType} onChange={(e) => setOrganData({...organData, organType: e.target.value})} className="input-field" required>
                    <option value="">Select Organ</option>
                    {organs.filter(org => !myOrgans.find(o => o.organType === org)).map(org => <option key={org} value={org}>{org}</option>)}
                  </select>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Status</label>
                  <select value={organData.status} onChange={(e) => setOrganData({...organData, status: e.target.value})} className="input-field" required>
                    <option value="">Set Status</option>
                    <option value="Available">Available</option>
                    <option value="Not Available">Not Available</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" style={styles.submitBtn} disabled={loading}>{loading ? 'Adding...' : 'Add Organ'}</button>
              </form>
            </div>
          </div>
        ) : activeTab === 'profile' ? (
          <div style={styles.grid} className="animate-fade">
            <div style={styles.card} className="white-card">
              <div style={styles.cardHeader}>
                <div style={styles.iconCircle}>🏥</div>
                <h2 style={styles.cardTitle}>Hospital Details</h2>
              </div>
              <p style={styles.cardDesc}>Update your hospital's information visible to patients.</p>
              <form onSubmit={handleProfileUpdate} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Hospital Name</label>
                  <input type="text" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} className="input-field" required />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>City</label>
                  <input type="text" value={profileData.city} onChange={(e) => setProfileData({...profileData, city: e.target.value})} className="input-field" required />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Address</label>
                  <input type="text" value={profileData.address} onChange={(e) => setProfileData({...profileData, address: e.target.value})} className="input-field" required />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Contact Number</label>
                  <input type="text" value={profileData.contactNumber} onChange={(e) => setProfileData({...profileData, contactNumber: e.target.value})} className="input-field" required />
                </div>
                <button type="submit" className="btn btn-primary" style={styles.submitBtn} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div style={styles.requestsList} className="animate-fade">
            {requests.length === 0 ? (
              <div style={styles.noRequests} className="white-card">
                <p>No requests received yet.</p>
              </div>
            ) : (
              <div style={styles.requestsGrid}>
                {requests.map((req, idx) => (
                  <div key={idx} style={styles.reqCard} className="white-card">
                    <div style={styles.reqHeader}>
                      <span style={styles.reqType}>{req.type}</span>
                      <span style={styles.reqDate}>{new Date(req.created_at).toLocaleDateString()}</span>
                    </div>
                    <h3 style={styles.reqItem}>{req.item} Need</h3>
                    <div style={styles.patientInfo}>
                      <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Patient:</span>
                        <span style={styles.infoValue}>{req.user_name}</span>
                      </div>
                      <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Contact:</span>
                        <a href={`mailto:${req.user_email}`} style={styles.infoLink}>{req.user_email}</a>
                      </div>
                    </div>
                    <div style={styles.reqMessage}>
                      <strong>Message from patient:</strong>
                      <p>"{req.message}"</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: { minHeight: '100vh', padding: '60px 20px' },
  container: { maxWidth: '1000px', margin: '0 auto' },
  header: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '30px', 
    padding: '30px',
  },
  headerLeft: { display: 'flex', flexDirection: 'column', gap: '8px' },
  userBadge: { display: 'inline-block', background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', width: 'fit-content' },
  title: { fontSize: '2.5rem', fontWeight: '800', margin: 0 },
  welcome: { color: '#94a3b8', fontSize: '1.1rem', fontWeight: '300' },
  logoutBtn: { alignSelf: 'center' },
  tabContainer: { display: 'flex', gap: '15px', marginBottom: '30px' },
  tab: { padding: '12px 24px', borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' },
  activeTab: { background: '#fff', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' },
  inventoryContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' },
  stockList: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '10px' },
  stockRow: { display: 'flex', alignItems: 'center', gap: '12px' },
  stockLabel: { fontWeight: '700', color: '#0f172a', minWidth: '55px', fontSize: '1rem' },
  stockInput: { flex: 1, padding: '10px 14px', fontSize: '0.95rem' },
  stockUnit: { color: '#94a3b8', fontSize: '0.85rem', minWidth: '35px' },
  saveBtn: { padding: '10px 16px', fontSize: '0.85rem', whiteSpace: 'nowrap' },
  divider: { borderTop: '1px solid #f1f5f9', margin: '20px 0' },
  card: { padding: '40px' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' },
  iconCircle: { width: '50px', height: '50px', background: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', display: 'flex', justifyContent: 'center' },
  cardTitle: { fontSize: '1.5rem', fontWeight: '700', margin: 0, color: '#0f172a' },
  cardDesc: { color: '#64748b', fontSize: '0.95rem', marginBottom: '30px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8' },
  submitBtn: { marginTop: '10px' },
  requestsList: { width: '100%' },
  noRequests: { padding: '40px', textAlign: 'center', color: '#64748b' },
  requestsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '20px' },
  reqCard: { padding: '30px', display: 'flex', flexDirection: 'column', gap: '15px' },
  reqHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  reqType: { background: '#fee2e2', color: '#dc2626', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' },
  reqDate: { color: '#94a3b8', fontSize: '0.85rem' },
  reqItem: { fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', margin: 0 },
  patientInfo: { display: 'flex', flexDirection: 'column', gap: '8px', padding: '15px', background: '#f8fafc', borderRadius: '12px' },
  infoRow: { display: 'flex', gap: '10px', fontSize: '0.95rem' },
  infoLabel: { color: '#94a3b8', fontWeight: '600', minWidth: '70px' },
  infoValue: { color: '#0f172a', fontWeight: '700' },
  infoLink: { color: '#dc2626', fontWeight: '700', textDecoration: 'underline' },
  reqMessage: { fontSize: '0.95rem', color: '#64748b', lineHeight: '1.6' }
};

export default HospitalDashboard;
