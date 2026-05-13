import pandas as pd

# ===== LOAD DATA =====
orders = pd.read_csv("C:/HOACODE/sale-data-project/dataset/staging/orders_clean.csv")
customers = pd.read_csv("C:/HOACODE/sale-data-project/dataset/staging/customers_clean.csv")
items = pd.read_csv("C:/HOACODE/sale-data-project/dataset/staging/order_items_clean.csv")
payments = pd.read_csv("C:/HOACODE/sale-data-project/dataset/staging/payments_clean.csv")
reviews = pd.read_csv("C:/HOACODE/sale-data-project/dataset/staging/reviews_clean.csv")

# ===== AGGREGATE =====

# tổng payment theo order
payments_agg = payments.groupby("order_id")["payment_value"].sum().reset_index()

# tổng item theo order
items_agg = items.groupby("order_id").agg({
    "price": "sum",
    "freight_value": "sum",
    "product_id": lambda x: ','.join(x.astype(str)),  # Nếu 1 order có nhiều sản phẩm
    "seller_id": lambda x: ','.join(x.astype(str))
}).reset_index()

# ===== MERGE =====
df = orders.merge(customers, on="customer_id", how="left")
df = df.merge(items_agg, on="order_id", how="left")
df = df.merge(payments_agg, on="order_id", how="left")
df = df.merge(reviews, on="order_id", how="left")

'''# Thêm vào join_data.py
df = df.merge(sellers[['seller_id', 'seller_state', 'seller_city']], on="seller_id", how="left")
df = df.merge(geolocation[['zip_code_prefix', 'state']], left_on="customer_zip_code_prefix", right_on="zip_code_prefix", how="left")
'''
# ===== FEATURE =====
df["total_amount"] = df["price"] + df["freight_value"]

# ===== SAVE =====
df.to_csv("C:/HOACODE/sale-data-project/dataset/warehouse/master_data.csv", index=False)

print("joined master_data DONE!")