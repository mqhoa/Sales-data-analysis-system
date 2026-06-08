// frontend/src/pages/Financials.jsx
import { useEffect } from 'react';
import { useDashboardStore } from '../store/dashboardStore';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import InsightCard from '../components/InsightCard';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function Financials() {
  const { data, loading, fetchAllData } = useDashboardStore();

useEffect(() => {
  fetchAllData();
}, []);

if (loading) return <div style={{ padding: '32px' }}>⏳ Loading...</div>;

const revenueInsights = data.revenueInsights || {};
const totalRevenue = (data.monthlyRevenue || []).reduce((sum, item) => sum + (item.revenue || 0), 0);

// ✅ FIX: Parse string values to numbers
const avgMonthlyRevenue = parseFloat(revenueInsights.avg_month_revenue) || 0;
const peakMonthRevenue = parseFloat(revenueInsights.peak_month_revenue) || 0;
const volatilityPercent = parseFloat(revenueInsights.volatility_percent) || 0;

// ✅ DEBUG: Log everything
  console.log('=== FINANCIALS DEBUG ===');
  console.log('revenueInsights:', revenueInsights);
  console.log('avgMonthlyRevenue (parsed):', avgMonthlyRevenue);
  console.log('peakMonthRevenue (parsed):', peakMonthRevenue);
  console.log('volatilityPercent (parsed):', volatilityPercent);
  console.log('totalRevenue:', totalRevenue);
  console.log('KPI Values:');
  console.log(`  Total Revenue: $${(totalRevenue / 1000000).toFixed(2)}M`);
  console.log(`  Avg Monthly Revenue: $${(avgMonthlyRevenue / 1000000).toFixed(2)}M`);
  console.log(`  Peak Month: $${(peakMonthRevenue / 1000000).toFixed(2)}M`);
  console.log(`  Volatility: ${volatilityPercent.toFixed(1)}%`);

const shippingData = (data.monthlyRevenue || []).map(item => ({
  month: item.month,
  revenue: item.revenue || 0,
  shipping: (item.revenue || 0) * 0.1,
  tax: (item.revenue || 0) * 0.08
}));

  const paymentMethods = [
    { name: 'Credit Card', value: 45 },
    { name: 'PayPal', value: 25 },
    { name: 'Debit Card', value: 20 },
    { name: 'Others', value: 10 }
  ];

  return (
    <div style={{ padding: '32px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>💰 Financial Analysis</h1>

      {/* ========== KPI CARDS ========== */}
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '16px',
  marginBottom: '32px'
}}>
  <InsightCard
    title="Total Revenue"
    value={`$${(totalRevenue / 1000000).toFixed(2)}M`}
    color="#3b82f6"
  />
  <InsightCard
    title="Avg Monthly Revenue"
    value={`$${(avgMonthlyRevenue / 1000000).toFixed(2)}M`}
    color="#10b981"
  />
  <InsightCard
    title="Peak Month"
    value={`$${(peakMonthRevenue / 1000000).toFixed(2)}M`}
    color="#f59e0b"
  />
  <InsightCard
    title="Volatility"
    value={`${volatilityPercent.toFixed(1)}%`}
    color="#8b5cf6"
  />
</div>

      {/* ========== CHARTS ========== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
        {/* Line Chart: Revenue vs Costs */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '20px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
            📊 Revenue vs Operational Costs
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={shippingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" style={{ fontSize: '12px' }} />
              <YAxis style={{ fontSize: '12px' }} />
              <Tooltip formatter={value => `$${(value / 1000).toFixed(0)}K`} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="shipping" stroke="#ef4444" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="tax" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart: Payment Methods */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '20px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
            💳 Payment Methods
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={paymentMethods}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip formatter={value => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ========== BREAKDOWN TABLE ========== */}
      <div style={{
        marginTop: '24px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '16px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Payment Method Breakdown</h3>
        </div>
        <table style={{ width: '100%', fontSize: '14px' }}>
          <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Method</th>
              <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Percentage</th>
              <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {paymentMethods.map((method, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '12px' }}>{method.name}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>{method.value}%</td>
                <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#059669' }}>
                  ${((totalRevenue * method.value) / 100 / 1000000).toFixed(2)}M
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}