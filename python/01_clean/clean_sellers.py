import pandas as pd

df = pd.read_csv("C:/HOACODE/sale-data-project/dataset/raw/olist_sellers_dataset.csv")

df = df.drop_duplicates(subset=['seller_id'])

df.to_csv("C:/HOACODE/sale-data-project/dataset/staging/sellers_clean.csv", index=False)
print("sellers cleaned")