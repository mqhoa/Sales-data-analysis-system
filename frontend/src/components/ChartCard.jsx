export default function ChartCard({ title, children }) {
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px', transition: 'all 300ms' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>{title}</h3>
      <div style={{ width: '100%', height: '320px' }}>
        {children}
      </div>
    </div>
  );
}