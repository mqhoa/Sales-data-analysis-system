DROP TABLE IF EXISTS agg_revenue_by_time;

CREATE TABLE agg_revenue_by_time AS
SELECT 
    order_date AS date,
    SUM(total_amount) AS revenue,
    COUNT(*) AS total_orders,
    AVG(total_amount) AS avg_order_value
FROM fact_orders
GROUP BY order_date
ORDER BY order_date;