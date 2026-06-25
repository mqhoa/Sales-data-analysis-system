// backend/src/repositories/insightRepository.js
const pool = require("../config/db");

class InsightRepository {
  //  Lấy insights cho Revenue  
  static async getRevenueInsights() {
    try {
      const query = `
        WITH monthly_data AS (
          SELECT
            DATE_TRUNC('month', order_date::timestamp) AS month,
            SUM(total_amount) AS revenue
          FROM fact_orders
          WHERE order_date IS NOT NULL
          GROUP BY DATE_TRUNC('month', order_date::timestamp)
        )
        SELECT
          COALESCE(MAX(revenue), 0) AS peak_month_revenue,
          COALESCE(MIN(revenue), 0) AS lowest_month_revenue,
          COALESCE(AVG(revenue), 0) AS avg_month_revenue,
          COUNT(*) AS total_months,
          -- CÔNG THỨC CHUẨN: Độ lệch chuẩn / Trung bình (Bọc NULLIF để chống chia cho số 0)
          CASE 
            WHEN AVG(revenue) > 0 THEN 
              ROUND((STDDEV(revenue) / NULLIF(AVG(revenue), 0) * 100)::numeric, 2)
            ELSE 0
          END AS volatility_percent
        FROM monthly_data
      `;
      const result = await pool.query(query);
      return result.rows[0] || {};
    } catch (error) {
      console.error("❌ Error in getRevenueInsights:", error);
      throw error;
    }
  }

  //  Lấy insights cho Products 
  static async getProductInsights() {
    try {
      const query = `
        WITH payment_summary AS (
          -- Gom nhóm payments trước để tránh làm nhân dòng (fan-out) hệ thống
          SELECT order_id, SUM(payment_value) AS total_order_payment
          FROM order_payments
          WHERE payment_value IS NOT NULL AND payment_value > 0
          GROUP BY order_id
        ),
        product_data AS (
          SELECT 
            fo.product_id,
            COALESCE(dp.product_category_name, 'Uncategorized') AS category,
            COUNT(DISTINCT fo.order_id) AS units_sold,
            SUM(ps.total_order_payment) AS revenue
          FROM fact_orders fo
          LEFT JOIN dim_products dp ON fo.product_id = dp.product_id
          INNER JOIN payment_summary ps ON fo.order_id = ps.order_id
          WHERE fo.product_id IS NOT NULL 
          GROUP BY fo.product_id, dp.product_category_name
        )
        SELECT
          COUNT(*) AS total_products,
          COALESCE(ROUND(AVG(revenue)::numeric, 2), 0) AS avg_revenue_per_product,
          COALESCE(MAX(revenue), 0) AS best_seller_revenue,
          COALESCE(ROUND(AVG(units_sold)::numeric, 2), 0) AS avg_units_sold,
          COUNT(DISTINCT category) AS total_categories
        FROM product_data
      `;
      const result = await pool.query(query);
      return result.rows[0] || {};
    } catch (error) {
      console.error("❌ Error in getProductInsights:", error);
      throw error;
    }
  }

  //  Lấy insights cho Customers  //
  static async getCustomerInsights() {
    try {
      const query = `
        WITH customer_data AS (
          SELECT
            fo.customer_id,
            COUNT(*) AS order_count,
            SUM(fo.total_amount) AS total_spent
          FROM fact_orders fo
          WHERE fo.customer_id IS NOT NULL AND fo.total_amount IS NOT NULL
          GROUP BY fo.customer_id
        )
        SELECT
          COUNT(*) AS total_customers,
          COALESCE(ROUND(AVG(total_spent)::numeric, 2), 0) AS avg_customer_value,
          COALESCE(MAX(total_spent), 0) AS vip_customer_spent,
          COALESCE(ROUND(AVG(order_count)::numeric, 2), 0) AS avg_orders_per_customer,
          COALESCE(ROUND((SUM(CASE WHEN order_count > 1 THEN 1 ELSE 0 END)::float / NULLIF(COUNT(*), 0) * 100)::numeric, 2), 0) AS repeat_customer_percent
        FROM customer_data
      `;
      const result = await pool.query(query);
      return result.rows[0] || {};
    } catch (error) {
      console.error("❌ Error in getCustomerInsights:", error);
      throw error;
    }
  }

  //  Lấy insights cho Delivery/Quality 
  static async getQualityInsights() {
  try {
    const query = `
      SELECT
        ROUND(AVG(CASE WHEN delivery_time > 0 THEN delivery_time ELSE NULL END)::numeric, 2) AS avg_delivery_days,
        ROUND((SUM(CASE WHEN is_delayed = 1 THEN 1 ELSE 0 END)::float / NULLIF(COUNT(*), 0) * 100)::numeric, 2) AS delay_rate_percent,
        ROUND(AVG(CASE WHEN review_score IS NOT NULL AND review_score > 0 THEN review_score ELSE NULL END)::numeric, 2) AS avg_review_score,
        COUNT(*) AS total_orders_analyzed,
        ROUND((SUM(CASE WHEN review_score >= 4.0 THEN 1 ELSE 0 END)::float / NULLIF(COUNT(*), 0) * 100)::numeric, 2) AS satisfaction_percent
      FROM fact_orders
      WHERE total_amount > 0
    `;
    const result = await pool.query(query);
    return result.rows[0] || {};
  } catch (error) {
    console.error("❌ Error in getQualityInsights:", error);
    throw error;
  }
}

  /**
   * ✅ Lấy insights cho Geography - TOP STATES
   */
  static async getGeographyInsights() {
    try {
      const query = `
        WITH state_data AS (
          SELECT
            COALESCE(dc.customer_state, 'Unknown') AS state,
            COUNT(*) AS order_count,
            SUM(fo.total_amount) AS total_revenue
          FROM fact_orders fo
          LEFT JOIN dim_customers dc ON fo.customer_id = dc.customer_id
          WHERE fo.customer_id IS NOT NULL AND fo.total_amount IS NOT NULL
          GROUP BY dc.customer_state
        )
        SELECT
          COUNT(*) AS total_states,
          COALESCE(MAX(total_revenue), 0) AS top_state_revenue,
          COALESCE(ROUND(AVG(total_revenue)::numeric, 2), 0) AS avg_state_revenue,
          (SELECT state FROM state_data WHERE total_revenue = (SELECT MAX(total_revenue) FROM state_data) LIMIT 1) AS top_state,
          COUNT(DISTINCT state) AS states_covered
        FROM state_data
        WHERE state != 'Unknown'
      `;
      const result = await pool.query(query);
      return result.rows[0] || {};
    } catch (error) {
      console.error("❌ Error in getGeographyInsights:", error);
      throw error;
    }
  }

  /**
   * ✅ Lấy dữ liệu chi tiết theo từng state
   */
  static async getStateData() {
    try {
      const query = `
        SELECT
          COALESCE(dc.customer_state, 'Unknown') AS state,
          COUNT(*) AS order_count,
          SUM(fo.total_amount) AS total_revenue,
          COUNT(DISTINCT fo.customer_id) AS customer_count
        FROM fact_orders fo
        LEFT JOIN dim_customers dc ON fo.customer_id = dc.customer_id
        WHERE fo.customer_id IS NOT NULL AND fo.total_amount IS NOT NULL
        GROUP BY dc.customer_state
        ORDER BY total_revenue DESC
        LIMIT 10
      `;
      const result = await pool.query(query);
      return result.rows.map(row => ({
        state: row.state || 'Unknown',
        revenue: parseFloat(row.total_revenue) || 0,
        customers: parseInt(row.customer_count) || 0,
        orders: parseInt(row.order_count) || 0
      }));
    } catch (error) {
      console.error("❌ Error in getStateData:", error);
      throw error;
    }
  }
}

module.exports = InsightRepository;