import { useDashboardStore } from '../store/dashboardStore';
import { useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const InsightCard = ({ title, value, color }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: '20px',
    borderLeft: `4px solid ${color}`,
  }}>
    <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 8px 0' }}>{title}</p>
    <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
      {value || '0'}
    </p>
  </div>
);

export default function Dashboard() {
  const { data, loading, fetchAllData } = useDashboardStore();

  useEffect(() => {
    console.log('Dashboard mounted - Fetching data...');
    fetchAllData();
  }, []);

  if (loading) return <div style={{ padding: '32px', fontSize: '16px' }}>⏳ Loading analytics...</div>;

  const monthlyRevenue = Array.isArray(data.monthlyRevenue) ? data.monthlyRevenue : [];
  const topProducts = Array.isArray(data.topProducts) ? data.topProducts : [];
  const topCustomers = Array.isArray(data.topCustomers) ? data.topCustomers : [];
  const revenueInsights = data.revenueInsights || {};
  const qualityInsights = data.qualityInsights || {};
  const customerInsights = data.customerInsights || {};
  const productInsights = data.productInsights || {};

  const totalRevenue = monthlyRevenue.reduce((sum, item) => {
    const revenue = parseFloat(item.revenue) || 0;
    return sum + revenue;
  }, 0);

  const peakMonthRevenue = parseFloat(revenueInsights.peak_month_revenue) || 0;
  const avgMonthlyRevenue = parseFloat(revenueInsights.avg_month_revenue) || 0;
  const totalCustomers = parseInt(customerInsights.total_customers) || 0;

  // Shorten product names - extract category only
  const topProductsForChart = topProducts.slice(0, 10).map((p) => ({
    ...p,
    shortenedName: p.category || p.name.split(' - ')[1] || 'Unknown'
  }));

  console.log('Dashboard Data:', {
    monthlyRevenue: monthlyRevenue.length,
    totalRevenue: totalRevenue,
    peakMonthRevenue: peakMonthRevenue,
    avgMonthlyRevenue: avgMonthlyRevenue,
    totalCustomers: totalCustomers,
  });

  return (
    <div style={{ padding: '32px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>📊 Overview</h1>

      {/* KPI Cards */}
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
          title="Peak Month Revenue"
          value={`$${(peakMonthRevenue / 1000000).toFixed(2)}M`}
          color="#10b981"
        />
        <InsightCard
          title="Avg Monthly Revenue"
          value={`$${(avgMonthlyRevenue / 1000000).toFixed(2)}M`}
          color="#f59e0b"
        />
        <InsightCard
          title="Total Customers"
          value={totalCustomers.toLocaleString()}
          color="#8b5cf6"
        />
      </div>

      {/* Charts Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px',
        marginBottom: '24px'
      }}>
        {/* Revenue Trend */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '20px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>💰 Monthly Revenue Trend</h3>
          {monthlyRevenue.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" style={{ fontSize: '12px' }} />
                  <YAxis style={{ fontSize: '12px' }} />
                  <Tooltip 
                    formatter={value => `$${((value || 0) / 1000000).toFixed(2)}M`}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '6px' }}>
                <p style={{ fontSize: '13px', color: '#1e40af', margin: 0 }}>
                  📈 Peak: ${(peakMonthRevenue / 1000000).toFixed(2)}M | Volatility: {(parseFloat(revenueInsights.volatility_percent) || 0).toFixed(0)}%
                </p>
              </div>
            </>
          ) : (
            <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
              No data available
            </div>
          )}
        </div>

        {/* Top Products */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '20px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>🏆 Top 10 Products by Revenue</h3>
          {topProducts.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topProductsForChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="shortenedName"
                    style={{ fontSize: '11px' }} 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                  />
                  <YAxis style={{ fontSize: '12px' }} />
                  <Tooltip 
                    formatter={value => `$${((value || 0) / 1000).toFixed(0)}K`}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                    labelStyle={{ color: '#000' }}
                  />
                  <Bar dataKey="revenue" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '6px' }}>
                <p style={{ fontSize: '13px', color: '#15803d', margin: 0 }}>
                  📊 Avg Revenue/Product: ${(parseFloat(productInsights.avg_revenue_per_product) || 0).toFixed(0)}
                </p>
              </div>
            </>
          ) : (
            <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
              No data available
            </div>
          )}
        </div>

        {/* Top Customers */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '20px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>👥 Top Customers</h3>
          {topCustomers.length > 0 ? (
            <>
              <div style={{ height: '250px', overflowY: 'auto' }}>
                <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f3f4f6', position: 'sticky', top: 0 }}>
                    <tr>
                      <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Customer</th>
                      <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>Orders</th>
                      <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCustomers.slice(0, 5).map((customer, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '8px' }}>{customer.name || 'N/A'}</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>{customer.order_count || 0}</td>
                        <td style={{ padding: '8px', textAlign: 'right', fontWeight: '600', color: '#16a34a' }}>
                          ${((parseFloat(customer.total_spent) || 0) / 1000).toFixed(0)}K
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#fef3c7', borderRadius: '6px' }}>
                <p style={{ fontSize: '13px', color: '#92400e', margin: 0 }}>
                  💎 VIP Value: ${((parseFloat(customerInsights.vip_customer_spent) || 0) / 1000).toFixed(0)}K
                </p>
              </div>
            </>
          ) : (
            <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
              No data available
            </div>
          )}
        </div>

        {/* Delivery Quality */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '20px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>⭐ Delivery Quality</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px'
          }}>
            <div style={{ backgroundColor: '#f0fdf4', padding: '12px', borderRadius: '6px' }}>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 6px 0' }}>On-Time Rate</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a', margin: 0 }}>
                {(100 - (parseFloat(qualityInsights.delay_rate_percent) || 0)).toFixed(1)}%
              </p>
            </div>
            <div style={{ backgroundColor: '#fef3c7', padding: '12px', borderRadius: '6px' }}>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 6px 0' }}>Delay Rate</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ea580c', margin: 0 }}>
                {(parseFloat(qualityInsights.delay_rate_percent) || 0).toFixed(1)}%
              </p>
            </div>
            <div style={{ backgroundColor: '#fce7f3', padding: '12px', borderRadius: '6px' }}>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 6px 0' }}>Avg Delivery</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#be185d', margin: 0 }}>
                {(parseFloat(qualityInsights.avg_delivery_days || 0)).toFixed(1)} days
              </p>
            </div>
            <div style={{ backgroundColor: '#f0f9ff', padding: '12px', borderRadius: '6px' }}>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 6px 0' }}>Rating</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#0284c7', margin: 0 }}>
                {(parseFloat(qualityInsights.avg_review_score || 0)).toFixed(2)}/5
              </p>
            </div>
          </div>
          <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f3e8ff', borderRadius: '6px' }}>
            <p style={{ fontSize: '13px', color: '#6b21a8', margin: 0 }}>
              😊 Satisfaction: {(parseFloat(qualityInsights.satisfaction_percent) || 0).toFixed(1)}% rated 4+ stars
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}