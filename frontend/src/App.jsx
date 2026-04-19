import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Home from './pages/Home.jsx';
import Search from './pages/Search.jsx';
import Login from './pages/Login.jsx';
import UserLogin from './pages/UserLogin.jsx';
import HospitalDashboard from './pages/HospitalDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import RequestHistory from './pages/RequestHistory.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search/:type" element={<Search />} />
          <Route path="/login/:role" element={<Login />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route
            path="/hospital/dashboard"
            element={
              <PrivateRoute role="hospital">
                <HospitalDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/request-history"
            element={
              <PrivateRoute role="user">
                <RequestHistory />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
