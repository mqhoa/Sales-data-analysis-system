const pool = require("../config/db");

module.exports = {
  getTopProducts: async () => {
    try {
      const result = await pool.query(`
        SELECT 
          p.product_id,
          p.product_name as name,
          COALESCE(p.product_category, 'Uncategorized') as category,
          COUNT(oi.order_id) as units_sold,
          SUM(oi.price * oi.quantity) as revenue
        FROM products p
        LEFT JOIN order_items oi ON p.product_id = oi.product_id
        GROUP BY p.product_id, p.product_name, p.product_category
        ORDER BY SUM(oi.price * oi.quantity) DESC
        LIMIT 10
      `);
      return result.rows;
    } catch (err) {
      console.error("Error in getTopProducts:", err);
      throw err;
    }
  }
};