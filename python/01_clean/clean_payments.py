import pandas as pd

df = pd.read_csv("C:/HOACODE/sale-data-project/dataset/raw/olist_order_payments_dataset.csv")

df = df[df['payment_value'] > 0]

df.to_csv("C:/HOACODE/sale-data-project/dataset/staging/payments_clean.csv", index=False)
print("payments cleaned")