const pool = require("../config/db");

class OrderRepository {
  static async getMonthlyRevenue() {
    try {
      const query = `
        SELECT
          DATE_TRUNC('month', order_date::timestamp) AS month,
          SUM(total_amount) AS revenue
        FROM fact_orders
        WHERE order_date IS NOT NULL
        GROUP BY DATE_TRUNC('month', order_date::timestamp)
        ORDER BY month DESC
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error in getMonthlyRevenue:", error);
      throw new Error(`Database query failed: ${error.message}`);
    }
  }

  static async getTopProducts() {
    try {
      const query = `
        SELECT 
          fo.product_id,
          dp.product_category_name AS name,
          COUNT(*) AS units_sold,
          SUM(fo.total_amount) AS revenue
        FROM fact_orders fo
        LEFT JOIN dim_products dp ON fo.product_id = dp.product_id
        WHERE fo.product_id IS NOT NULL AND fo.total_amount IS NOT NULL
        GROUP BY fo.product_id, dp.product_category_name
        ORDER BY revenue DESC NULLS LAST
        LIMIT 10
      `;
      const result = await pool.query(query);
      return result.rows.map((row, idx) => ({
        product_id: row.product_id,
        name: row.name || `Product ${row.product_id?.substring(0, 8) || (idx + 1)}`,
        revenue: Number(row.revenue ?? 0),
        units_sold: Number(row.units_sold ?? 0),
      }));
    } catch (error) {
      console.error("Error in getTopProducts:", error);
      throw new Error(`Database query failed: ${error.message}`);
    }
  }

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
        WHERE fo.customer_id IS NOT NULL AND fo.total_amount IS NOT NULL
        GROUP BY fo.customer_id
        ORDER BY total_spent DESC NULLS LAST
        LIMIT 10
      `;
      const result = await pool.query(query);
      return result.rows.map((row, idx) => ({
        customer_id: row.customer_id,
        name: row.customer_id || `Customer ${idx + 1}`,
        order_count: Number(row.order_count ?? 0),
        total_spent: Number(row.total_spent ?? 0),
        city: row.city ?? "",
        state: row.state ?? "",
      }));
    } catch (error) {
      console.error("Error in getTopCustomers:", error);
      throw new Error(`Database query failed: ${error.message}`);
    }
  }

  static async getDeliveryStats() {
    try {
      const query = `
        SELECT 
          ROUND(AVG(COALESCE(delivery_time, 0))::numeric, 2) AS avg_delivery_time,
          ROUND((SUM(CASE WHEN is_delayed = 1 THEN 1 ELSE 0 END)::float / NULLIF(COUNT(*), 0))::numeric, 4) AS delay_rate,
          COUNT(*) AS total_orders,
          ROUND(AVG(review_score)::numeric, 2) AS avg_review_score
        FROM fact_orders
        WHERE delivery_time IS NOT NULL AND total_amount IS NOT NULL
      `;
      const result = await pool.query(query);
      return {
        avg_delivery_time: Number(result.rows[0].avg_delivery_time ?? 0),
        delay_rate: Number(result.rows[0].delay_rate ?? 0),
        total_orders: Number(result.rows[0].total_orders ?? 0),
        avg_review_score: Number(result.rows[0].avg_review_score ?? 0),
      };
    } catch (error) {
      console.error("Error in getDeliveryStats:", error);
      throw new Error(`Database query failed: ${error.message}`);
    }
  }
}

module.exports = OrderRepository;