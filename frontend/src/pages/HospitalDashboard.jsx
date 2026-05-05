import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateBlood, updateOrgan, getHospitalRequests, getMyHospital, updateMyHospital, getMyBloodStock, getMyOrgans, updateRequestStatus, getHospitals, createRequest, searchBlood, searchOrgans } from '../services/api';
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
  const [hospitals, setHospitals] = useState([]);
  const [hospitalReqData, setHospitalReqData] = useState({ type: 'Blood', item: '', hospitalId: '', message: '' });
  const [searchType, setSearchType] = useState('blood');
  const [searchCity, setSearchCity] = useState('');
  const [searchSelection, setSearchSelection] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const REQUEST_STATUSES = ['Pending', 'Will Contact', 'Contacted', 'Fulfilled', 'Rejected'];
  const STATUS_COLORS = { 'Pending': '#d97706', 'Will Contact': '#3b82f6', 'Contacted': '#8b5cf6', 'Fulfilled': '#059669', 'Rejected': '#dc2626' };
  const STATUS_BG = { 'Pending': '#fffbeb', 'Will Contact': '#eff6ff', 'Contacted': '#f5f3ff', 'Fulfilled': '#ecfdf5', 'Rejected': '#fef2f2' };
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const organs = ['Kidney', 'Liver', 'Heart', 'Lungs', 'Pancreas', 'Cornea'];

  const navItems = [
    { key: 'inventory', icon: '📊', label: 'Inventory' },
    { key: 'search', icon: '🔍', label: 'Search Network' },
    { key: 'requests', icon: '📩', label: 'Patient Requests', badge: requests.length },
    { key: 'send-request', icon: '🏥', label: 'Request Hospital' },
    { key: 'profile', icon: '✏️', label: 'Edit Profile' },
  ];

  useEffect(() => {
    if (activeTab === 'inventory') fetchInventory();
    if (activeTab === 'requests') fetchRequests();
    if (activeTab === 'profile') fetchProfile();
    if (activeTab === 'send-request') fetchHospitals();
    if (activeTab === 'search') { setSearchResults([]); setSearchSelection(''); setSearchCity(''); }
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
    } catch (error) { console.error('Failed to fetch inventory'); }
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data } = await getMyHospital();
      setProfileData({ name: data.name, address: data.address, city: data.city, contactNumber: data.contactNumber });
    } catch (error) { console.error('Failed to fetch hospital profile'); }
    setLoading(false);
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await getHospitalRequests();
      setRequests(data);
    } catch (error) { console.error('Failed to fetch requests'); }
    setLoading(false);
  };

  const fetchHospitals = async () => {
    try {
      const { data } = await getHospitals();
      setHospitals(data.filter(h => h.isApproved && h.isActive));
    } catch (error) { console.error('Failed to fetch hospitals'); }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await updateMyHospital(profileData); alert('Hospital details updated successfully'); }
    catch (error) { alert(error.response?.data?.message || 'Update failed'); }
    setLoading(false);
  };

  const handleStatusUpdate = async (reqId, status) => {
    try {
      await updateRequestStatus(reqId, status);
      setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status } : r));
    } catch (error) { alert('Failed to update status'); }
  };

  const handleHospitalRequest = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await createRequest(hospitalReqData);
      alert('Request sent to hospital successfully!');
      setHospitalReqData({ type: 'Blood', item: '', hospitalId: '', message: '' });
    } catch (error) { alert(error.response?.data?.message || 'Failed to send request'); }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!searchSelection) return alert(`Please select a ${searchType === 'blood' ? 'blood group' : 'organ'}`);
    setSearching(true);
    try {
      const params = { city: searchCity };
      if (searchType === 'blood') { params.group = searchSelection; const { data } = await searchBlood(params); setSearchResults(data); }
      else { params.organ = searchSelection; const { data } = await searchOrgans(params); setSearchResults(data); }
    } catch (error) { alert('Search failed'); }
    setSearching(false);
  };

  const handleSearchRequest = async (item) => {
    const message = prompt(`Enter reason for requesting ${searchType === 'blood' ? item.bloodGroup : item.organType}:`);
    if (!message) return;
    try {
      await createRequest({ type: searchType === 'blood' ? 'Blood' : 'Organ', item: searchType === 'blood' ? item.bloodGroup : item.organType, hospitalId: item.hospitalId, message });
      alert('Request sent successfully!');
    } catch (error) { alert('Failed to send request'); }
  };
    setLoading(true);
    try { await updateBlood({ bloodGroup, unitsAvailable: Number(editingBlood[bloodGroup]) }); fetchInventory(); }
    catch (error) { alert(error.response?.data?.message || 'Update failed'); }
    setLoading(false);
  };

  const handleOrganUpdate = async (organType) => {
    setLoading(true);
    try { await updateOrgan({ organType, status: editingOrgan[organType] }); fetchInventory(); }
    catch (error) { alert(error.response?.data?.message || 'Update failed'); }
    setLoading(false);
  };

  const handleAddBlood = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await updateBlood({ ...bloodData, unitsAvailable: Number(bloodData.unitsAvailable) });
      setBloodData({ bloodGroup: '', unitsAvailable: '' }); fetchInventory();
    } catch (error) { alert(error.response?.data?.message || 'Update failed'); }
    setLoading(false);
  };

  const handleAddOrgan = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await updateOrgan(organData);
      setOrganData({ organType: '', status: '' }); fetchInventory();
    } catch (error) { alert(error.response?.data?.message || 'Update failed'); }
    setLoading(false);
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const renderContent = () => {
    if (activeTab === 'search') return (
      <div className="animate-fade">
        <div style={styles.searchPanel} className="glass-card">
          <div style={styles.searchRow}>
            <div style={styles.inputGroup}>
              <label style={styles.labelLight}>Type</label>
              <select value={searchType} onChange={(e) => { setSearchType(e.target.value); setSearchSelection(''); setSearchResults([]); }} className="input-field">
                <option value="blood">Blood</option>
                <option value="organ">Organ</option>
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.labelLight}>{searchType === 'blood' ? 'Blood Group' : 'Organ Type'}</label>
              <select value={searchSelection} onChange={(e) => setSearchSelection(e.target.value)} className="input-field">
                <option value="">Select...</option>
                {(searchType === 'blood' ? bloodGroups : organs).map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.labelLight}>City (optional)</label>
              <input type="text" placeholder="e.g. Chennai" value={searchCity} onChange={(e) => setSearchCity(e.target.value)} className="input-field" />
            </div>
            <button onClick={handleSearch} className="btn btn-primary" style={styles.searchBtn} disabled={searching}>
              {searching ? 'Searching...' : '🔍 Search'}
            </button>
          </div>
        </div>

        {searchResults.length === 0 && !searching && (
          <div style={styles.emptyState} className="white-card"><p style={{color:'#64748b'}}>Search to see available blood and organs across the network.</p></div>
        )}

        <div style={styles.resultsGrid}>
          {searchResults.map((item, idx) => (
            <div key={idx} style={styles.resultCard} className="white-card">
              <div style={styles.resultHeader}>
                <h3 style={styles.resultHospital}>{item.hospitalName}</h3>
                <span style={item.isOutdated ? styles.outdatedBadge : styles.freshBadge}>{item.isOutdated ? 'Outdated' : 'Fresh'}</span>
              </div>
              <p style={styles.resultAddr}>📍 {item.address}</p>
              <p style={styles.resultContact}>📞 {item.contactNumber}</p>
              <div style={styles.dataBlock}>
                <div style={styles.dataItem}>
                  <span style={styles.dataLabel}>{searchType === 'blood' ? 'Group' : 'Organ'}</span>
                  <span style={styles.dataValue}>{searchType === 'blood' ? item.bloodGroup : item.organType}</span>
                </div>
                <div style={styles.dataItem}>
                  <span style={styles.dataLabel}>{searchType === 'blood' ? 'Units' : 'Status'}</span>
                  <span style={{...styles.dataValue, color: item.status === 'Available' || item.unitsAvailable > 0 ? '#10b981' : '#dc2626'}}>
                    {searchType === 'blood' ? item.unitsAvailable : item.status}
                  </span>
                </div>
              </div>
              <button onClick={() => handleSearchRequest(item)} className="btn btn-primary" style={{width:'100%'}}>Send Request</button>
            </div>
          ))}
        </div>
      </div>
    );

    if (activeTab === 'inventory') return (
      <div style={styles.contentGrid}>
        <div style={styles.card} className="white-card animate-fade">
          <div style={styles.cardHeader}><div style={styles.iconCircle}>🩸</div><h2 style={styles.cardTitle}>Blood Inventory</h2></div>
          {bloodStock.length > 0 && (
            <div style={styles.stockList}>
              {bloodStock.map(b => (
                <div key={b.bloodGroup} style={styles.stockRow}>
                  <span style={styles.stockLabel}>{b.bloodGroup}</span>
                  <input type="number" value={editingBlood[b.bloodGroup] ?? b.unitsAvailable} onChange={(e) => setEditingBlood({...editingBlood, [b.bloodGroup]: e.target.value})} className="input-field" style={styles.stockInput} min="0" />
                  <span style={styles.stockUnit}>units</span>
                  <button onClick={() => handleBloodUpdate(b.bloodGroup)} className="btn btn-primary" style={styles.saveBtn} disabled={loading}>Save</button>
                </div>
              ))}
            </div>
          )}
          <div style={styles.divider} />
          <p style={styles.cardDesc}>Add new blood group:</p>
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

        <div style={styles.card} className="white-card animate-fade">
          <div style={styles.cardHeader}><div style={styles.iconCircle}>🫀</div><h2 style={styles.cardTitle}>Organ Availability</h2></div>
          {myOrgans.length > 0 && (
            <div style={styles.stockList}>
              {myOrgans.map(o => (
                <div key={o.organType} style={styles.stockRow}>
                  <span style={styles.stockLabel}>{o.organType}</span>
                  <select value={editingOrgan[o.organType] ?? o.status} onChange={(e) => setEditingOrgan({...editingOrgan, [o.organType]: e.target.value})} className="input-field" style={styles.stockInput}>
                    <option value="Available">Available</option>
                    <option value="Not Available">Not Available</option>
                  </select>
                  <button onClick={() => handleOrganUpdate(o.organType)} className="btn btn-primary" style={styles.saveBtn} disabled={loading}>Save</button>
                </div>
              ))}
            </div>
          )}
          <div style={styles.divider} />
          <p style={styles.cardDesc}>Add new organ:</p>
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
    );

    if (activeTab === 'requests') return (
      <div className="animate-fade">
        {requests.length === 0 ? (
          <div style={styles.emptyState} className="white-card"><p style={{color:'#64748b'}}>No patient requests received yet.</p></div>
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
                  <div style={styles.infoRow}><span style={styles.infoLabel}>From:</span><span style={styles.infoValue}>{req.user_name}</span></div>
                  <div style={styles.infoRow}><span style={styles.infoLabel}>Contact:</span><a href={`mailto:${req.user_email}`} style={styles.infoLink}>{req.user_email}</a></div>
                </div>
                <div style={styles.reqMessage}><strong>Message:</strong><p>"{req.message}"</p></div>
                <div style={styles.statusRow}>
                  <span style={{ ...styles.statusBadge, background: STATUS_BG[req.status] || '#f1f5f9', color: STATUS_COLORS[req.status] || '#64748b' }}>{req.status}</span>
                  <select value={req.status} onChange={(e) => handleStatusUpdate(req.id, e.target.value)} className="input-field" style={styles.statusSelect}>
                    {REQUEST_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );

    if (activeTab === 'send-request') return (
      <div style={styles.singleCard} className="animate-fade">
        <div style={styles.card} className="white-card">
          <div style={styles.cardHeader}><div style={styles.iconCircle}>🏥</div><h2 style={styles.cardTitle}>Request from Another Hospital</h2></div>
          <p style={styles.cardDesc}>Send a blood or organ request to another hospital in the network.</p>
          <form onSubmit={handleHospitalRequest} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Request Type</label>
              <select value={hospitalReqData.type} onChange={(e) => setHospitalReqData({...hospitalReqData, item: '', type: e.target.value})} className="input-field" required>
                <option value="Blood">Blood</option>
                <option value="Organ">Organ</option>
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>{hospitalReqData.type === 'Blood' ? 'Blood Group' : 'Organ Type'}</label>
              <select value={hospitalReqData.item} onChange={(e) => setHospitalReqData({...hospitalReqData, item: e.target.value})} className="input-field" required>
                <option value="">Select...</option>
                {(hospitalReqData.type === 'Blood' ? bloodGroups : organs).map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Target Hospital</label>
              <select value={hospitalReqData.hospitalId} onChange={(e) => setHospitalReqData({...hospitalReqData, hospitalId: e.target.value})} className="input-field" required>
                <option value="">Select Hospital</option>
                {hospitals.map(h => <option key={h.id} value={h.id}>{h.name} — {h.city}</option>)}
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Message</label>
              <input type="text" placeholder="Reason for request..." value={hospitalReqData.message} onChange={(e) => setHospitalReqData({...hospitalReqData, message: e.target.value})} className="input-field" required />
            </div>
            <button type="submit" className="btn btn-primary" style={styles.submitBtn} disabled={loading}>{loading ? 'Sending...' : 'Send Request'}</button>
          </form>
        </div>
      </div>
    );

    if (activeTab === 'profile') return (
      <div style={styles.singleCard} className="animate-fade">
        <div style={styles.card} className="white-card">
          <div style={styles.cardHeader}><div style={styles.iconCircle}>🏥</div><h2 style={styles.cardTitle}>Hospital Details</h2></div>
          <p style={styles.cardDesc}>Update your hospital's information visible to patients.</p>
          <form onSubmit={handleProfileUpdate} style={styles.form}>
            <div style={styles.inputGroup}><label style={styles.label}>Hospital Name</label><input type="text" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} className="input-field" required /></div>
            <div style={styles.inputGroup}><label style={styles.label}>City</label><input type="text" value={profileData.city} onChange={(e) => setProfileData({...profileData, city: e.target.value})} className="input-field" required /></div>
            <div style={styles.inputGroup}><label style={styles.label}>Address</label><input type="text" value={profileData.address} onChange={(e) => setProfileData({...profileData, address: e.target.value})} className="input-field" required /></div>
            <div style={styles.inputGroup}><label style={styles.label}>Contact Number</label><input type="text" value={profileData.contactNumber} onChange={(e) => setProfileData({...profileData, contactNumber: e.target.value})} className="input-field" required /></div>
            <button type="submit" className="btn btn-primary" style={styles.submitBtn} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <div style={styles.sidebar} className="glass-card">
        <div style={styles.sidebarTop}>
          <div style={styles.userBadge}>Hospital Staff</div>
          <div style={styles.userName}>{user?.name}</div>
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
        <button onClick={handleLogout} className="btn btn-outline" style={styles.logoutBtn}>Logout</button>
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
  userBadge: { background: 'rgba(220,38,38,0.15)', color: '#dc2626', padding: '4px 12px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', display: 'inline-block', marginBottom: '10px' },
  userName: { fontSize: '1.1rem', fontWeight: '700', color: '#fff' },
  nav: { display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 },
  navItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: 'none', background: 'transparent', color: '#94a3b8', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', fontSize: '0.95rem' },
  navItemActive: { background: 'rgba(255,255,255,0.1)', color: '#fff' },
  navIcon: { fontSize: '1.1rem', minWidth: '24px' },
  navLabel: { flex: 1 },
  navBadge: { background: '#dc2626', color: '#fff', borderRadius: '100px', fontSize: '0.7rem', fontWeight: '700', padding: '2px 8px', minWidth: '20px', textAlign: 'center' },
  logoutBtn: { marginTop: '20px', width: '100%' },
  main: { flex: 1, padding: '40px', overflowY: 'auto' },
  pageHeader: { marginBottom: '30px' },
  pageTitle: { fontSize: '2rem', fontWeight: '800', margin: 0 },
  contentGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' },
  singleCard: { maxWidth: '600px' },
  card: { padding: '35px' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' },
  iconCircle: { width: '45px', height: '45px', background: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' },
  cardTitle: { fontSize: '1.4rem', fontWeight: '700', margin: 0, color: '#0f172a' },
  cardDesc: { color: '#64748b', fontSize: '0.95rem', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8' },
  submitBtn: { marginTop: '8px' },
  stockList: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '10px' },
  stockRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  stockLabel: { fontWeight: '700', color: '#0f172a', minWidth: '65px', fontSize: '0.95rem' },
  stockInput: { flex: 1, padding: '10px 14px', fontSize: '0.95rem' },
  stockUnit: { color: '#94a3b8', fontSize: '0.85rem', minWidth: '35px' },
  saveBtn: { padding: '10px 16px', fontSize: '0.85rem', whiteSpace: 'nowrap' },
  divider: { borderTop: '1px solid #f1f5f9', margin: '20px 0' },
  emptyState: { padding: '60px', textAlign: 'center' },
  requestsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '20px' },
  reqCard: { padding: '25px', display: 'flex', flexDirection: 'column', gap: '14px' },
  reqHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  reqType: { background: '#fee2e2', color: '#dc2626', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' },
  reqDate: { color: '#94a3b8', fontSize: '0.85rem' },
  reqItem: { fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: 0 },
  patientInfo: { display: 'flex', flexDirection: 'column', gap: '6px', padding: '12px', background: '#f8fafc', borderRadius: '10px' },
  infoRow: { display: 'flex', gap: '10px', fontSize: '0.9rem' },
  infoLabel: { color: '#94a3b8', fontWeight: '600', minWidth: '65px' },
  infoValue: { color: '#0f172a', fontWeight: '700' },
  infoLink: { color: '#dc2626', fontWeight: '700', textDecoration: 'underline' },
  reqMessage: { fontSize: '0.9rem', color: '#64748b', lineHeight: '1.6' },
  statusRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  statusBadge: { padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700', whiteSpace: 'nowrap' },
  statusSelect: { flex: 1, padding: '8px 12px', fontSize: '0.9rem' },
  searchPanel: { padding: '25px 30px', marginBottom: '30px' },
  searchRow: { display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' },
  labelLight: { fontSize: '0.85rem', fontWeight: '600', color: 'rgba(255,255,255,0.6)' },
  searchBtn: { height: '50px', padding: '0 30px', whiteSpace: 'nowrap' },
  resultsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' },
  resultCard: { padding: '25px', display: 'flex', flexDirection: 'column', gap: '12px' },
  resultHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  resultHospital: { fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', margin: 0 },
  freshBadge: { background: '#ecfdf5', color: '#059669', padding: '3px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700' },
  outdatedBadge: { background: '#fef2f2', color: '#dc2626', padding: '3px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700' },
  resultAddr: { color: '#64748b', fontSize: '0.9rem', margin: 0 },
  resultContact: { color: '#64748b', fontSize: '0.9rem', fontWeight: '600', margin: 0 },
  dataBlock: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', padding: '15px', background: '#f8fafc', borderRadius: '10px' },
  dataItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  dataLabel: { fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' },
  dataValue: { fontSize: '1.3rem', fontWeight: '800', color: '#0f172a' },
};

export default HospitalDashboard;
