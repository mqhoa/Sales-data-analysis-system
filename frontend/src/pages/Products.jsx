import { useDashboardStore } from '../store/dashboardStore';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

const InsightCard = ({ title, value, color }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: '20px',
    borderLeft: `4px solid ${color}`,
  }}>
    <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 8px 0' }}>{title}</p>
    <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{value}</p>
  </div>
);

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'];

export default function Products() {
  const { data } = useDashboardStore();
  const [searchTerm, setSearchTerm] = useState('');

  const topProducts = Array.isArray(data.topProducts) ? data.topProducts : [];
  const productInsights = data.productInsights || {};

  const totalProducts = parseInt(productInsights.total_products) || 0;
  const avgRevenuePerProduct = parseFloat(productInsights.avg_revenue_per_product) || 0;
  const bestSellerRevenue = topProducts.length > 0 ? parseFloat(topProducts[0]?.revenue) || 0 : 0;
  const avgUnitsSold = parseFloat(productInsights.avg_units_sold) || 0;

  // Category distribution (group by category)
  const categoryMap = {};
  topProducts.forEach(p => {
    const cat = p.category || 'Unknown';
    categoryMap[cat] = (categoryMap[cat] || 0) + (parseFloat(p.revenue) || 0);
  });

  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value
  })).slice(0, 6);

  // Filter products by search
  const filteredProducts = topProducts.filter(p =>
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '32px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>📦 Products Analysis</h1>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <InsightCard title="Total Products" value={totalProducts.toLocaleString()} color="#3b82f6" />
        <InsightCard title="Avg Revenue/Product" value={`$${(avgRevenuePerProduct).toFixed(0)}K`} color="#10b981" />
        <InsightCard title="Best Seller Revenue" value={`$${(bestSellerRevenue / 1000).toFixed(0)}K`} color="#f59e0b" />
        <InsightCard title="Avg Units Sold" value={avgUnitsSold.toFixed(0)} color="#8b5cf6" />
      </div>

      {/* Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px',
        marginBottom: '24px'
      }}>
        {/* Top 10 Products */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '20px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>🏆 Top 10 Products by Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} style={{ fontSize: '10px' }} />
              <YAxis />
              <Tooltip formatter={v => `$${(v / 1000).toFixed(0)}K`} />
              <Bar dataKey="revenue" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '20px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>📁 Category Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value }) => `${name}: $${(value / 1000).toFixed(0)}K`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={v => `$${(v / 1000).toFixed(0)}K`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Products Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '20px'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>📊 Products List</h3>
        
        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '16px',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f3f4f6' }}>
              <tr>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Product</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Category</th>
                <th style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>Units</th>
                <th style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.slice(0, 10).map((product, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '10px' }}>{product.name || 'N/A'}</td>
                  <td style={{ padding: '10px' }}>{product.category || 'N/A'}</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>{product.units_sold || 0}</td>
                  <td style={{ padding: '10px', textAlign: 'right', fontWeight: '600', color: '#16a34a' }}>
                    ${(parseFloat(product.revenue) / 1000).toFixed(0)}K
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}