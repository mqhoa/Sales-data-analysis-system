DROP TABLE IF EXISTS agg_product_trend;

CREATE TABLE agg_product_trend AS
SELECT 
    product_id,
    DATE_TRUNC('month', order_date) AS month,
    SUM(total_amount) AS revenue
FROM fact_orders
GROUP BY product_id, month;