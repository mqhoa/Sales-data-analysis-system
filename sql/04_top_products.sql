DROP TABLE IF EXISTS agg_top_products;

CREATE TABLE agg_top_products AS
SELECT 
    p.product_id,
    p.category_name,
    SUM(f.total_amount) AS revenue,
    COUNT(*) AS total_orders
FROM fact_orders f
JOIN dim_product p ON f.product_id = p.product_id
GROUP BY p.product_id, p.category_name
ORDER BY revenue DESC
LIMIT 50;