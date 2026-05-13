'''
File olist_orders_dataset.csv có:
order_id
customer_id
order_status
order_purchase_timestamp
order_approved_at
order_delivered_carrier_date
order_delivered_customer_date
order_estimated_delivery_date

'''

import pandas as pd

df = pd.read_csv("C:/HOACODE/sale-data-project/dataset/raw/olist_orders_dataset.csv")

# Chuyển các cột thời gian từ string sang datetime
cols = [
    'order_purchase_timestamp',
    'order_approved_at',
    'order_delivered_carrier_date',
    'order_delivered_customer_date',
    'order_estimated_delivery_date'
]

for col in cols:
    df[col] = pd.to_datetime(df[col], errors='coerce')

# Loại bỏ dữ liệu thời gian sai logic
df = df[
    df['order_delivered_customer_date'].isna() |
    (df['order_delivered_customer_date'] >= df['order_purchase_timestamp'])
]

# Loại bỏ trùng đơn hàng
df = df.drop_duplicates(subset=['order_id'])

df.to_csv("C:/HOACODE/sale-data-project/dataset/staging/orders_clean.csv", index=False)
print("orders cleaned")