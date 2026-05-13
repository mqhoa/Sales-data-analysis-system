DROP TABLE IF EXISTS agg_payment_distribution;

CREATE TABLE agg_payment_distribution AS
SELECT 
    payment_type,
    COUNT(*) AS total_transactions,
    SUM(payment_value) AS total_value
FROM order_payments
GROUP BY payment_type;