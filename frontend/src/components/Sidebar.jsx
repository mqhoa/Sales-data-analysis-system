import { useState } from 'react';
import { BarChart3, Package, Zap, Globe, DollarSign, Settings } from 'lucide-react';

export default function Sidebar({ activeMenu, setActiveMenu }) {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'quality', label: 'Quality', icon: Zap },
    { id: 'geography', label: 'Geography', icon: Globe },
    { id: 'financials', label: 'Financials', icon: DollarSign },
  ];

  return (
    <div style={{ width: isOpen ? '256px' : '80px', backgroundColor: '#1f2937', color: 'white', transition: 'all 300ms', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid #374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {isOpen && <h2 style={{ fontWeight: 'bold', fontSize: '18px' }}>Menu</h2>}
        <button onClick={() => setIsOpen(!isOpen)} style={{ fontSize: '20px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
          ☰
        </button>
      </div>

      <div style={{ flex: 1, paddingY: '16px' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              style={{
                width: '100%',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 300ms',
                backgroundColor: activeMenu === item.id ? '#2563eb' : 'transparent',
                borderLeft: activeMenu === item.id ? '4px solid #60a5fa' : 'none',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              <Icon size={20} />
              {isOpen && <span>{item.label}</span>}
            </button>
          );
        })}
      </div>

      <div style={{ borderTop: '1px solid #374151', padding: '16px' }}>
        <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 16px', backgroundColor: 'transparent', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '4px' }}>
          <Settings size={20} />
          {isOpen && <span>Settings</span>}
        </button>
      </div>
    </div>
  );
}