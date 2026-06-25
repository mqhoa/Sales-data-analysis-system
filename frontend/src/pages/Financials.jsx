import { useEffect, useState } from 'react';
import { useDashboardStore } from '../store/dashboardStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
         ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import InsightCard from '../components/InsightCard';
import api from '../services/api';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Financials() {
  const { data, loading, fetchAllData } = useDashboardStore();
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    fetchAllData();
    api.get('/revenue/payment-stats')
      .then(res => {
        const cleanData = res.data.filter(item => item.name !== 'not_defined' && item.value > 0);
        setPaymentMethods(cleanData);
      })
      .catch(err => console.error('Payment stats error:', err));
  }, []);

  if (loading) return <div style={{ padding: '32px' }}>⏳ Loading...</div>;

  const revenueInsights = data.revenueInsights || {};
  const totalRevenue = (data.monthlyRevenue || [])
    .reduce((sum, item) => sum + (item.revenue || 0), 0);

  const avgMonthlyRevenue = parseFloat(revenueInsights.avg_month_revenue) || 0;
  const peakMonthRevenue = parseFloat(revenueInsights.peak_month_revenue) || 0;
  const volatilityPercent = parseFloat(revenueInsights.volatility_percent) || 0;

  // ✅ Chỉ dùng revenue thực, bỏ shipping/tax giả
  const revenueChartData = (data.monthlyRevenue || []).map(item => ({
    month: item.month,
    revenue: item.revenue || 0
  }));

  return (
    <div style={{ padding: '32px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>
        💰 Financial Analysis
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px', marginBottom: '32px'
      }}>
        <InsightCard title="Total Revenue" value={`$${(totalRevenue/1000000).toFixed(2)}M`} color="#3b82f6" />
        <InsightCard title="Avg Monthly Revenue" value={`$${(avgMonthlyRevenue/1000000).toFixed(2)}M`} color="#10b981" />
        <InsightCard title="Peak Month" value={`$${(peakMonthRevenue/1000000).toFixed(2)}M`} color="#f59e0b" />
        <InsightCard title="Volatility" value={`${volatilityPercent.toFixed(1)}%`} color="#8b5cf6" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
        {/* ✅ Line Chart: chỉ revenue thực */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
            📊 Monthly Revenue
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" style={{ fontSize: '11px' }} />
              <YAxis style={{ fontSize: '11px' }} />
              <Tooltip formatter={value => `$${(value/1000).toFixed(0)}K`} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ✅ Pie Chart: payment methods từ DB */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
            💳 Payment Methods
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={paymentMethods} dataKey="value" nameKey="name"
                cx="50%" cy="50%" outerRadius={70}
                label={({ name, value }) => `${name}: ${value}%`}>
                {paymentMethods.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={value => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment breakdown table */}
      <div style={{ marginTop: '24px', backgroundColor: 'white', borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <div style={{ padding: '16px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Payment Method Breakdown</h3>
        </div>
        <table style={{ width: '100%', fontSize: '14px' }}>
          <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Method</th>
              <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Percentage</th>
              <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Total Value</th>
            </tr>
          </thead>
          <tbody>
            {paymentMethods.map((method, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '12px' }}>{method.name}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>{method.value}%</td>
                <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#059669' }}>
                  ${(method.total / 1000000).toFixed(2)}M
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}