const pool = require("../config/db");

class OrderRepository {
  /**
   * ✅ Lấy doanh thu theo tháng
   */
  static async getMonthlyRevenue() {
    try {
      const query = `
        SELECT
          DATE_TRUNC('month', order_date::timestamp) AS month,
          SUM(total_amount) AS revenue
        FROM fact_orders
        WHERE order_date IS NOT NULL AND total_amount > 0
        GROUP BY DATE_TRUNC('month', order_date::timestamp)
        ORDER BY month DESC
      `;
      const result = await pool.query(query);
      
      return result.rows.map(row => ({
        month: row.month ? new Date(row.month).toISOString().split('T')[0] : null,
        revenue: parseFloat(row.revenue) || 0
      }));
    } catch (error) {
      console.error("❌ Error in getMonthlyRevenue:", error);
      throw new Error(`Database query failed: ${error.message}`);
    }
  }

  /**
   * ✅ Lấy top 10 sản phẩm bán chạy
   */
  static async getTopProducts() {
    try {
      const query = `
        SELECT 
          fo.product_id,
          COALESCE(dp.product_category_name, 'Uncategorized') AS category,
          COUNT(*) AS units_sold,
          SUM(fo.total_amount) AS revenue
        FROM fact_orders fo
        LEFT JOIN dim_products dp ON fo.product_id = dp.product_id
        WHERE fo.product_id IS NOT NULL AND fo.total_amount > 0
        GROUP BY fo.product_id, dp.product_category_name
        ORDER BY revenue DESC NULLS LAST
        LIMIT 10
      `;
      const result = await pool.query(query);
      
      return result.rows.map((row, idx) => ({
        product_id: row.product_id,
        name: `${row.product_id.substring(0, 8)}... - ${row.category}`,
        category: row.category || "Uncategorized",
        units_sold: parseInt(row.units_sold) || 0,
        revenue: parseFloat(row.revenue) || 0
      }));
    } catch (error) {
      console.error("❌ Error in getTopProducts:", error);
      throw new Error(`Database query failed: ${error.message}`);
    }
  }

  /**
   * ✅ Lấy top 10 khách hàng chi tiêu nhiều nhất
   */
  static async getTopCustomers() {
    try {
      const query = `
        SELECT
          fo.customer_id,
          MAX(dc.customer_city) AS city,
          MAX(dc.customer_state) AS state,
          COUNT(*) AS order_count,
          SUM(fo.total_amount) AS total_spent
        FROM fact_orders fo
        LEFT JOIN dim_customers dc ON fo.customer_id = dc.customer_id
        WHERE fo.customer_id IS NOT NULL AND fo.total_amount > 0
        GROUP BY fo.customer_id
        ORDER BY total_spent DESC NULLS LAST
        LIMIT 10
      `;
      const result = await pool.query(query);
      
      return result.rows.map((row, idx) => ({
        customer_id: row.customer_id,
        name: row.customer_id ? `${row.customer_id.substring(0, 8)}...` : `Customer ${idx + 1}`,
        order_count: parseInt(row.order_count) || 0,
        total_spent: parseFloat(row.total_spent) || 0,
        city: row.city || "Unknown",
        state: row.state || "Unknown"
      }));
    } catch (error) {
      console.error("❌ Error in getTopCustomers:", error);
      throw new Error(`Database query failed: ${error.message}`);
    }
  }

  /**
   * ✅ Lấy thống kê giao hàng
   */
  static async getDeliveryStats() {
    try {
      const query = `
        SELECT 
          ROUND(AVG(CASE WHEN delivery_time > 0 THEN delivery_time ELSE NULL END)::numeric, 2) AS avg_delivery_time,
          ROUND((SUM(CASE WHEN is_delayed = 1 THEN 1 ELSE 0 END)::float / NULLIF(COUNT(*), 0))::numeric, 4) AS delay_rate,
          COUNT(*) AS total_orders,
          ROUND(AVG(CASE WHEN review_score IS NOT NULL AND review_score > 0 THEN review_score ELSE NULL END)::numeric, 2) AS avg_review_score
        FROM fact_orders
        WHERE total_amount > 0
      `;
      const result = await pool.query(query);
      const row = result.rows[0];
      
      return {
        avg_delivery_time: parseFloat(row.avg_delivery_time) || 0,
        delay_rate: parseFloat(row.delay_rate) || 0,
        total_orders: parseInt(row.total_orders) || 0,
        avg_review_score: parseFloat(row.avg_review_score) || 0
      };
    } catch (error) {
      console.error("❌ Error in getDeliveryStats:", error);
      throw new Error(`Database query failed: ${error.message}`);
    }
  }
}

module.exports = OrderRepository;