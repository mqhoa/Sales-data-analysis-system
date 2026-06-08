export default function StatCard({ title, value, icon: Icon, trend }) {
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px', transition: 'all 300ms' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: '#4b5563', fontSize: '14px', fontWeight: '500' }}>{title}</p>
          <h3 style={{ fontSize: '30px', fontWeight: 'bold', marginTop: '8px' }}>{value}</h3>
          {trend && (
            <p style={{ fontSize: '14px', marginTop: '8px', color: trend > 0 ? '#16a34a' : '#dc2626' }}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% từ tháng trước
            </p>
          )}
        </div>
        {Icon && <Icon size={32} style={{ color: '#3b82f6' }} />}
      </div>
    </div>
  );
}