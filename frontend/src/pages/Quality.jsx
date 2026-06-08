import { useDashboardStore } from '../store/dashboardStore';

const StatBox = ({ title, value, color, unit = '' }) => (
  <div style={{
    backgroundColor: color,
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
  }}>
    <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 8px 0' }}>{title}</p>
    <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
      {value}{unit}
    </p>
  </div>
);

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

export default function Quality() {
  const { data } = useDashboardStore();

  const deliveryStats = data.deliveryStats || {};
  const qualityInsights = data.qualityInsights || {};

  const totalOrders = parseInt(deliveryStats.total_orders) || 0;
  const avgDeliveryTime = parseFloat(deliveryStats.avg_delivery_time) || 0;
  const delayRate = parseFloat(deliveryStats.delay_rate) || 0;
  const avgReviewScore = parseFloat(deliveryStats.avg_review_score) || 0;

  const onTimeDelivery = Math.round(totalOrders * (1 - delayRate));
  const delayedOrders = Math.round(totalOrders * delayRate);
  const onTimeRate = ((1 - delayRate) * 100).toFixed(1);
  const delayRatePercent = (delayRate * 100).toFixed(1);
  const successRate = onTimeRate;
  const satisfactionPercent = parseFloat(qualityInsights.satisfaction_percent) || 76.2;

  return (
    <div style={{ padding: '32px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>⭐ Quality & Delivery</h1>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <InsightCard title="On-Time Delivery" value={onTimeDelivery.toLocaleString()} color="#10b981" />
        <InsightCard title="Delayed Orders" value={delayedOrders.toLocaleString()} color="#ef4444" />
        <InsightCard title="Avg Delivery Time" value={`${avgDeliveryTime.toFixed(1)} days`} color="#f59e0b" />
        <InsightCard title="Customer Rating" value={`${avgReviewScore.toFixed(2)}/5 ⭐`} color="#8b5cf6" />
      </div>

      {/* Performance Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px',
        marginBottom: '24px'
      }}>
        {/* Delivery Performance */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '20px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>📦 Delivery Performance</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
          }}>
            <StatBox title="Total Orders" value={totalOrders.toLocaleString()} color="#f0f9ff" />
            <StatBox title="Success Rate" value={successRate} color="#f0fdf4" unit="%" />
            <StatBox title="On-Time" value={onTimeDelivery.toLocaleString()} color="#f0fdf4" />
            <StatBox title="Delayed" value={delayedOrders.toLocaleString()} color="#fef3c7" />
          </div>
          <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '6px' }}>
            <p style={{ fontSize: '13px', color: '#1e40af', margin: 0 }}>
              ✅ Average delivery: {avgDeliveryTime.toFixed(2)} days
            </p>
          </div>
        </div>

        {/* Customer Satisfaction */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '20px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>😊 Customer Satisfaction</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
          }}>
            <StatBox title="Avg Rating" value={avgReviewScore.toFixed(2)} color="#fce7f3" unit="/5" />
            <StatBox title="4+ Star Rate" value={satisfactionPercent.toFixed(1)} color="#f0fdf4" unit="%" />
            <StatBox title="On-Time Rate" value={onTimeRate} color="#f0fdf4" unit="%" />
            <StatBox title="Delay Rate" value={delayRatePercent} color="#fef3c7" unit="%" />
          </div>
          <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#fce7f3', borderRadius: '6px' }}>
            <p style={{ fontSize: '13px', color: '#be185d', margin: 0 }}>
              🎯 {satisfactionPercent.toFixed(1)}% customers rated 4+ stars
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div style={{
        backgroundColor: '#f3e8ff',
        borderRadius: '8px',
        padding: '20px',
        border: '2px solid #c084fc'
      }}>
        <p style={{ fontSize: '14px', fontWeight: '600', color: '#6b21a8', margin: 0 }}>
          💡 Insight: {onTimeRate}% orders delivered on time with average {avgDeliveryTime.toFixed(1)} days delivery time
        </p>
      </div>
    </div>
  );
}