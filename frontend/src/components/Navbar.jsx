// frontend/src/components/Navbar.jsx
export default function Navbar({ user, onLogout }) {
  return (
    <nav style={{ 
      backgroundColor: '#1e293b', 
      color: 'white', 
      padding: '16px 24px', 
      boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>📊 Sales Analytics</h1>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <span style={{ fontSize: '14px' }}>
          Welcome, <strong>{user?.username || 'User'}</strong>
        </span>
        <button 
          onClick={onLogout}
          style={{ 
            backgroundColor: '#dc2626', 
            color: 'white', 
            padding: '8px 16px', 
            borderRadius: '4px', 
            border: 'none', 
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}