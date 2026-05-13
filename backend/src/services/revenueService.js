const pool = require("../config/db");

module.exports = {
  getMonthlyRevenue: async () => {
    try {
      const result = await pool.query(`
        SELECT 
          DATE_TRUNC('month', o.order_purchase_timestamp)::DATE as month,
          SUM(o.order_purchase_value) as revenue
        FROM orders o
        WHERE o.order_purchase_timestamp IS NOT NULL
        GROUP BY DATE_TRUNC('month', o.order_purchase_timestamp)
        ORDER BY DATE_TRUNC('month', o.order_purchase_timestamp)
      `);
      
      return result.rows.map(row => ({
        month: row.month ? row.month.toISOString().split('T')[0] : 'Unknown',
        revenue: parseFloat(row.revenue) || 0
      }));
    } catch (err) {
      console.error("Error in getMonthlyRevenue:", err);
      throw err;
    }
  }
};