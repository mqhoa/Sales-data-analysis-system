import pandas as pd

df = pd.read_csv("C:/HOACODE/sale-data-project/dataset/raw/olist_order_items_dataset.csv")

# remove negative price
df = df[df['price'] > 0]

df.to_csv("C:/HOACODE/sale-data-project/dataset/staging/order_items_clean.csv", index=False)
print("order_items cleaned")