DROP TABLE IF EXISTS agg_product_association;

CREATE TABLE agg_product_association AS
SELECT 
    a.product_id AS product_a,
    b.product_id AS product_b,
    COUNT(*) AS frequency
FROM fact_orders a
JOIN fact_orders b 
    ON a.order_id = b.order_id
    AND a.product_id <> b.product_id
GROUP BY a.product_id, b.product_id
ORDER BY frequency DESC
LIMIT 100;