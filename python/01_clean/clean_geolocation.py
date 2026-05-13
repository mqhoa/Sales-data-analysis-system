import pandas as pd

df = pd.read_csv("C:/HOACODE/sale-data-project/dataset/raw/olist_geolocation_dataset.csv")

df = df.drop_duplicates()

df.to_csv("C:/HOACODE/sale-data-project/dataset/staging/geolocation_clean.csv", index=False)
print("geolocation cleaned")