DROP TABLE IF EXISTS agg_sales_by_state;

CREATE TABLE agg_sales_by_state AS
SELECT 
    c.state,
    SUM(f.total_amount) AS revenue,
    COUNT(*) AS total_orders,
    AVG(f.delivery_time) AS avg_delivery_time
FROM fact_orders f
JOIN dim_customer c ON f.customer_id = c.customer_id
GROUP BY c.state
ORDER BY revenue DESC;