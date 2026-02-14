import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Blood & Organ Availability System</h1>
        <p style={styles.subtitle}>Connecting patients with life-saving resources</p>
      </div>
      
      <div style={styles.grid}>
        <Link to="/search/blood" style={styles.card}>
          <h2 style={styles.cardTitle}>Search Blood</h2>
          <p style={styles.cardText}>Find available blood groups from verified hospitals</p>
        </Link>
        
        <Link to="/search/organ" style={styles.card}>
          <h2 style={styles.cardTitle}>Search Organs</h2>
          <p style={styles.cardText}>Check organ availability across medical centers</p>
        </Link>
        
        <Link to="/login/hospital" style={styles.card}>
          <h2 style={styles.cardTitle}>Hospital Portal</h2>
          <p style={styles.cardText}>Update and manage availability data</p>
        </Link>
        
        <Link to="/login/admin" style={styles.card}>
          <h2 style={styles.cardTitle}>Admin Panel</h2>
          <p style={styles.cardText}>System management and oversight</p>
        </Link>
      </div>
      
      <footer style={styles.footer}>
        <p>Saving lives through technology and coordination</p>
      </footer>
    </div>
  );
};

const styles = {
  container: { 
    minHeight: '100vh', 
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  hero: {
    textAlign: 'center',
    marginBottom: '60px'
  },
  title: { 
    fontSize: '3rem', 
    marginBottom: '15px', 
    color: '#fff',
    fontWeight: '700',
    letterSpacing: '-1px'
  },
  subtitle: { 
    fontSize: '1.3rem', 
    color: '#fee',
    fontWeight: '300'
  },
  grid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
    gap: '30px',
    maxWidth: '1200px',
    width: '100%',
    marginBottom: '40px'
  },
  card: { 
    padding: '40px 30px', 
    background: '#fff',
    borderRadius: '12px', 
    textDecoration: 'none', 
    color: '#333',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    textAlign: 'center',
    cursor: 'pointer',
    border: '3px solid transparent'
  },
  cardTitle: {
    fontSize: '1.5rem',
    marginBottom: '10px',
    color: '#dc2626',
    fontWeight: '600'
  },
  cardText: {
    color: '#666',
    fontSize: '1rem',
    lineHeight: '1.6'
  },
  footer: {
    marginTop: '40px',
    color: '#fff',
    fontSize: '1rem',
    textAlign: 'center',
    opacity: 0.9
  }
};

export default Home;
