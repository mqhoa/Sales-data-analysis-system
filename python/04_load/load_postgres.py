import pandas as pd
from sqlalchemy import create_engine

engine = create_engine("postgresql://postgres:50028071@localhost:5432/ecommerce")

df = pd.read_csv("C:/HOACODE/sale-data-project/dataset/features/features_order.csv")

# DIM_PRODUCTS
dim_products = df[['product_id', 'product_category_name']].drop_duplicates()
dim_products.to_sql("dim_products", engine, if_exists="replace", index=False)

# DIM_CUSTOMERS  
dim_customers = df[['customer_id', 'customer_state', 'customer_city']].drop_duplicates()
dim_customers.columns = ['customer_id', 'customer_state', 'customer_city']
dim_customers.to_sql("dim_customers", engine, if_exists="replace", index=False)

# DIM_SELLERS
dim_sellers = df[['seller_id', 'seller_state', 'seller_city']].drop_duplicates()
dim_sellers.to_sql("dim_sellers", engine, if_exists="replace", index=False)

# FACT TABLE
fact_orders = df[[
    'order_id','customer_id','product_id','seller_id',
    'order_purchase_timestamp',
    'order_delivered_customer_date',
    'price','freight_value','total_amount',
    'delivery_time','is_delayed','review_score'
]].copy()

fact_orders.columns = [
    'order_id','customer_id','product_id','seller_id',
    'order_date','delivered_date',
    'price','freight_value','total_amount',
    'delivery_time','is_delayed','review_score'
]

fact_orders.to_sql("fact_orders", engine, if_exists="replace", index=False)

print("Loaded fact_orders!")