import pandas as pd

df = pd.read_csv("C:/HOACODE/sale-data-project/dataset/raw/olist_order_reviews_dataset.csv")

df = df.drop_duplicates(subset=['review_id'])

df.to_csv("C:/HOACODE/sale-data-project/dataset/staging/reviews_clean.csv", index=False)
print("reviews cleaned")