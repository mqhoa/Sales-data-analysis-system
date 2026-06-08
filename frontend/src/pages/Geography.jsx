// frontend/src/pages/Geography.jsx
import { useEffect } from 'react';
import { useDashboardStore } from '../store/dashboardStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import InsightCard from '../components/InsightCard';

export default function Geography() {
  const { data, loading, fetchAllData } = useDashboardStore();

  useEffect(() => {
    fetchAllData();
  }, []);

  if (loading) return <div style={{ padding: '32px' }}>⏳ Loading...</div>;

  const geoInsights = data.geographyInsights || {};
  const geoData = data.stateData || [];

  // ✅ Prepare data for charts with safe values
  const chartData = geoData.map(item => ({
    state: item.state || 'Unknown',
    revenue: parseFloat(item.revenue) || 0,
    customers: parseInt(item.customers) || 0
  }));

  // ✅ Safe value extraction
  const topStateRevenue = parseFloat(geoInsights.top_state_revenue) || 0;
  const avgStateRevenue = parseFloat(geoInsights.avg_state_revenue) || 0;
  const topState = geoInsights.top_state || 'N/A';
  const statesCovered = parseInt(geoInsights.states_covered) || 0;

  return (
    <div style={{ padding: '32px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>🗺️ Geographic Analysis</h1>

      {/* ========== KPI CARDS ========== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <InsightCard
          title="States Covered"
          value={statesCovered}
          color="#3b82f6"
        />
        <InsightCard
          title="Top State Revenue"
          value={`$${(topStateRevenue / 1000000).toFixed(2)}M`}
          color="#10b981"
        />
        <InsightCard
          title="Avg State Revenue"
          value={`$${(avgStateRevenue / 1000000).toFixed(2)}M`}
          color="#f59e0b"
        />
        <InsightCard
          title="Top State"
          value={topState}
          color="#8b5cf6"
        />
      </div>

      {/* ========== CHARTS ========== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '24px' }}>
        {/* Revenue by State */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '20px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
            💰 Revenue by State
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="state" style={{ fontSize: '11px' }} angle={-45} textAnchor="end" height={60} />
              <YAxis style={{ fontSize: '12px' }} />
              <Tooltip formatter={value => `$${(value / 1000000).toFixed(2)}M`} />
              <Bar dataKey="revenue" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Customers by State */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '20px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
            👥 Customers by State
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="state" style={{ fontSize: '11px' }} angle={-45} textAnchor="end" height={60} />
              <YAxis style={{ fontSize: '12px' }} />
              <Tooltip formatter={value => value.toLocaleString()} />
              <Bar dataKey="customers" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ========== DETAILED TABLE ========== */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', fontSize: '14px' }}>
          <thead style={{ backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>State/Province</th>
              <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Revenue</th>
              <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Customers</th>
              <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Avg Order Value</th>
              <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>% of Total</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((row, idx) => {
              const totalRevenue = chartData.reduce((sum, r) => sum + r.revenue, 0);
              const avgOrderValue = row.customers > 0 ? row.revenue / row.customers : 0;
              const percentage = totalRevenue > 0 ? (row.revenue / totalRevenue) * 100 : 0;
              
              return (
                <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px' }}>{row.state}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#059669' }}>
                    ${(row.revenue / 1000000).toFixed(2)}M
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>{row.customers.toLocaleString()}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    ${avgOrderValue.toFixed(0)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', color: '#6b7280' }}>
                    {percentage.toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}