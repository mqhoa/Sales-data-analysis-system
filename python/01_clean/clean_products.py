import pandas as pd

df = pd.read_csv("C:/HOACODE/sale-data-project/dataset/raw/olist_products_dataset.csv")

df = df.dropna(subset=['product_category_name'])
df = df.drop_duplicates(subset=['product_id'])

df.to_csv("C:/HOACODE/sale-data-project/dataset/staging/products_clean.csv", index=False)
print("products cleaned") 