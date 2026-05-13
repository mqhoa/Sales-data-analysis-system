import pandas as pd

df = pd.read_csv("C:/HOACODE/sale-data-project/dataset/warehouse/master_data.csv")

# datetime
df['order_purchase_timestamp'] = pd.to_datetime(df['order_purchase_timestamp'])
df['order_delivered_customer_date'] = pd.to_datetime(df['order_delivered_customer_date'])
df['order_estimated_delivery_date'] = pd.to_datetime(df['order_estimated_delivery_date'])

# delivery time
df['delivery_time'] = (
    df['order_delivered_customer_date'] - df['order_purchase_timestamp']
).dt.days

# delay
df['is_delayed'] = (
    df['order_delivered_customer_date'] > df['order_estimated_delivery_date']
).astype(int)

# Thêm vào build_features.py
# Xử lí NaN trong delivery_time (nếu đơn hàng chưa giao)
df['delivery_time'] = df['delivery_time'].fillna(-1)  # -1 = chưa giao
df['is_delayed'] = df['is_delayed'].fillna(0)

# time features
df['order_hour'] = df['order_purchase_timestamp'].dt.hour
df['order_dayofweek'] = df['order_purchase_timestamp'].dt.dayofweek

df.to_csv("C:/HOACODE/sale-data-project/dataset/features/features_order.csv", index=False)
print("features built")