// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Quality from './pages/Quality';
import Geography from './pages/Geography';
import Financials from './pages/Financials';
import Login from './pages/Login';
import { useDashboardStore } from './store/dashboardStore';
import './App.css';

function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fetchAllData } = useDashboardStore();

  // ✅ Check login status on mount (1 time only)
  useEffect(() => {
    console.log('🔍 App.jsx mounted - Checking login status...');
    
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('user');
    
    console.log('📍 Token exists:', !!token);
    console.log('📍 User info exists:', !!userInfo);
    
    if (token && userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        console.log('✅ User logged in:', parsedUser.username);
        setIsLoggedIn(true);
        setUser(parsedUser);
        // ✅ Fetch data khi đã login
        fetchAllData();
      } catch (err) {
        console.error('❌ Failed to parse user info:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
      }
    } else {
      console.log('⚠️  User not logged in - Showing login page');
      setIsLoggedIn(false);
    }
    
    setLoading(false);
  }, []); // ✅ Empty dependency - chạy 1 lần

  const handleLoginSuccess = (token, userInfo) => {
    console.log('🔓 Login successful:', userInfo.username);
    console.log('🔑 Token saved:', token.substring(0, 20) + '...');
    
    setIsLoggedIn(true);
    setUser(userInfo);
    // ✅ Fetch data sau khi login
    fetchAllData();
  };

  const handleLogout = () => {
    console.log('🚪 Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setActiveMenu('dashboard');
  };

  // ✅ Loading State
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>⏳ Loading...</p>
        </div>
      </div>
    );
  }

  // ✅ Render Login Page (khi chưa login)
  if (!isLoggedIn) {
    console.log('📄 Rendering Login page');
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // ✅ Render Dashboard (khi đã login)
  console.log('📄 Rendering Dashboard page');
  
  const renderPage = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'quality':
        return <Quality />;
      case 'geography':
        return <Geography />;
      case 'financials':
        return <Financials />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Navbar user={user} onLogout={handleLogout} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default App;