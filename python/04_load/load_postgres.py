'''import pandas as pd
from sqlalchemy import create_engine

engine = create_engine("postgresql://postgres:50028071@localhost:5432/ecommerce")

# load master data
df = pd.read_csv("C:/HOACODE/sale-data-project/dataset/warehouse/master_data.csv")

# =====================
# DIM CUSTOMER
dim_customer = df[['customer_id','customer_unique_id','customer_city','customer_state']].drop_duplicates()
dim_customer.columns = ['customer_id','customer_unique_id','city','state']

dim_customer.to_sql("dim_customer", engine, if_exists="replace", index=False)

# =====================
# DIM PRODUCT
dim_product = df[['product_id','product_category_name']].drop_duplicates()
dim_product.columns = ['product_id','category_name']

dim_product.to_sql("dim_product", engine, if_exists="replace", index=False)

# =====================
# DIM SELLER
dim_seller = df[['seller_id','seller_city','seller_state']].drop_duplicates()
dim_seller.columns = ['seller_id','city','state']

dim_seller.to_sql("dim_seller", engine, if_exists="replace", index=False)

# =====================
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

print("Data Warehouse loaded!")'''


import pandas as pd
from sqlalchemy import create_engine

engine = create_engine("postgresql://postgres:50028071@localhost:5432/ecommerce")

df = pd.read_csv("C:/HOACODE/sale-data-project/dataset/features/features_order.csv")

# Thêm vào load_postgres.py
# DIM_PRODUCTS
dim_products = df[['product_id', 'product_category_name']].drop_duplicates()
dim_products.to_sql("dim_products", engine, if_exists="replace", index=False)

# DIM_CUSTOMERS
dim_customers = df[['customer_id', 'customer_state', 'customer_city']].drop_duplicates()
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