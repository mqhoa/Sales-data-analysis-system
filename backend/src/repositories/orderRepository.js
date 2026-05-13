const pool = require("../config/db");

// ✅ Improve - orderRepository.js
class OrderRepository {
  static async getMonthlyRevenue() {
    try {
      const query = `
        SELECT DATE_TRUNC('month', order_date::timestamp) AS month,
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


  static async getTopCustomers() {
  try {
    const query = `
      SELECT customer_id,
             COUNT(*) AS order_count,
             SUM(total_amount) AS total_spent
      FROM fact_orders
      WHERE customer_id IS NOT NULL AND total_amount IS NOT NULL
      GROUP BY customer_id
      ORDER BY total_spent DESC NULLS LAST
      LIMIT 10
    `;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error in getTopCustomers:", error);
    throw new Error(`Database query failed: ${error.message}`);
  }
}

static async getTopProducts() {
  try {
    const query = `
      SELECT product_id,
             COUNT(*) AS order_count,
             SUM(total_amount) AS revenue
      FROM fact_orders
      WHERE product_id IS NOT NULL AND total_amount IS NOT NULL
      GROUP BY product_id
      ORDER BY revenue DESC NULLS LAST
      LIMIT 10
    `;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error in getTopProducts:", error);
    throw new Error(`Database query failed: ${error.message}`);
  }
}

static async getDeliveryStats() {
    try {
      const query = `
        SELECT 
          ROUND(AVG(COALESCE(delivery_time, 0))::numeric, 2) AS avg_delivery_time,
          ROUND((SUM(CASE WHEN is_delayed = 1 THEN 1 ELSE 0 END)::float / 
               NULLIF(COUNT(*), 0))::numeric, 4) AS delay_rate,
          COUNT(*) AS total_orders
        FROM fact_orders
        WHERE delivery_time IS NOT NULL AND total_amount IS NOT NULL
      `;
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("Error in getDeliveryStats:", error);
      throw new Error(`Database query failed: ${error.message}`);
    }
  }
}

module.exports = OrderRepository;