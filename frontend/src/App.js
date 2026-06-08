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

  // Khởi tạo trạng thái đăng nhập từ localStorage khi component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('user');
    
    if (token && userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        setIsLoggedIn(true);
        setUser(parsedUser);
        fetchAllData();
      } catch (err) {
        // Fallback xử lý khi thông tin user lưu trữ bị lỗi cấu trúc dữ liệu
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
    
    setLoading(false);
  }, [fetchAllData]);

  const handleLoginSuccess = (token, userInfo) => {
    setIsLoggedIn(true);
    setUser(userInfo);
    fetchAllData();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setActiveMenu('dashboard');
  };

  // Trạng thái chờ khởi tạo ứng dụng
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

  // Điều hướng sang màn hình Login nếu chưa xác thực
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

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