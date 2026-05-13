const pool = require("../config/db");

module.exports = {
  getTopCustomers: async () => {
    try {
      const result = await pool.query(`
        SELECT 
          c.customer_id,
          COALESCE(c.customer_name, 'Customer ' || SUBSTRING(c.customer_id, 1, 8)) as name,
          COUNT(o.order_id) as orders,
          COALESCE(SUM(o.order_purchase_value), 0) as total_spent
        FROM customers c
        LEFT JOIN orders o ON c.customer_id = o.customer_id
        GROUP BY c.customer_id, c.customer_name
        ORDER BY SUM(o.order_purchase_value) DESC
        LIMIT 10
      `);
      return result.rows;
    } catch (err) {
      console.error("Error in getTopCustomers:", err);
      throw err;
    }
  }
};