import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <section style={styles.heroSection} className="animate-fade">
          <div style={styles.badge}>Live Availability Tracking</div>
          <h1 style={styles.heroTitle}>
            Sharing Life Through <span style={styles.highlight}>Technology</span>
          </h1>
          <p style={styles.heroSubtitle}>
            A centralized platform connecting patients with life-saving blood and organ resources across hospitals in real-time.
          </p>
          <div style={styles.heroActions}>
            <Link to="/search/blood" style={styles.primaryBtn} className="btn btn-primary">
              Search Blood
            </Link>
            <Link to="/search/organ" style={styles.secondaryBtn} className="btn btn-outline">
              Find Organs
            </Link>
          </div>
        </section>
        
        <div style={styles.statsRow} className="animate-fade">
          <div style={styles.statCard}>
            <div style={styles.statValue}>24/7</div>
            <div style={styles.statLabel}>Support</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>100%</div>
            <div style={styles.statLabel}>Verified Hospitals</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>Real-time</div>
            <div style={styles.statLabel}>Stock Updates</div>
          </div>
        </div>

        <div style={styles.portalGrid} className="animate-fade">
          <Link to="/login/hospital" style={styles.portalCard} className="white-card">
            <div style={styles.portalIcon}>🏥</div>
            <h3 style={styles.portalTitle}>Hospital Portal</h3>
            <p style={styles.portalText}>For medical staff to update stock and manage availability logs.</p>
            <span style={styles.portalLink}>Login as Staff →</span>
          </Link>
          
          <Link to="/login/admin" style={styles.portalCard} className="white-card">
            <div style={styles.portalIcon}>🛡️</div>
            <h3 style={styles.portalTitle}>Administration</h3>
            <p style={styles.portalText}>System-wide monitoring, hospital approvals, and activity oversight.</p>
            <span style={styles.portalLink}>Admin Access →</span>
          </Link>

          <Link to="/user-login" style={styles.portalCard} className="white-card">
            <div style={styles.portalIcon}>👤</div>
            <h3 style={styles.portalTitle}>Patient Portal</h3>
            <p style={styles.portalText}>Login or register to request blood and organs from verified hospitals.</p>
            <span style={styles.portalLink}>Patient Login →</span>
          </Link>
        </div>

        <footer style={styles.footer}>
          <p>© 2026 Blood & Organ Availability System. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    padding: '60px 20px',
  },
  container: {
    maxWidth: '1100px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  heroSection: {
    textAlign: 'center',
    marginBottom: '80px',
    maxWidth: '800px',
  },
  badge: {
    background: 'rgba(220, 38, 38, 0.1)',
    color: '#dc2626',
    padding: '8px 16px',
    borderRadius: '100px',
    fontSize: '0.9rem',
    fontWeight: '700',
    display: 'inline-block',
    marginBottom: '24px',
    border: '1px solid rgba(220, 38, 38, 0.2)',
  },
  heroTitle: {
    fontSize: '4.5rem',
    fontWeight: '800',
    lineHeight: '1.1',
    marginBottom: '24px',
    letterSpacing: '-2px',
  },
  highlight: {
    color: '#dc2626',
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    color: '#94a3b8',
    marginBottom: '40px',
    lineHeight: '1.6',
    fontWeight: '300',
  },
  heroActions: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
  },
  primaryBtn: {
    padding: '16px 40px',
    fontSize: '1.1rem',
  },
  secondaryBtn: {
    padding: '16px 40px',
    fontSize: '1.1rem',
  },
  statsRow: {
    display: 'flex',
    gap: '40px',
    marginBottom: '80px',
    width: '100%',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  statCard: {
    textAlign: 'center',
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#fff',
  },
  statLabel: {
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  portalGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '30px',
    width: '100%',
    marginBottom: '60px',
  },
  portalCard: {
    padding: '40px',
    textDecoration: 'none',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  portalIcon: {
    fontSize: '2.5rem',
    marginBottom: '10px',
  },
  portalTitle: {
    fontSize: '1.8rem',
    color: '#0f172a',
    margin: 0,
  },
  portalText: {
    color: '#64748b',
    fontSize: '1.05rem',
    lineHeight: '1.6',
  },
  portalLink: {
    marginTop: '20px',
    color: '#dc2626',
    fontWeight: '700',
    fontSize: '1.1rem',
  },
  footer: {
    marginTop: 'auto',
    color: '#64748b',
    fontSize: '0.9rem',
    padding: '40px 0',
  }
};

export default Home;
