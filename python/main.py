import os

print("=== CLEAN ===")
os.system("python 01_clean/clean_orders.py")
os.system("python 01_clean/clean_customers.py")
os.system("python 01_clean/clean_order_items.py")
os.system("python 01_clean/clean_payments.py")
os.system("python 01_clean/clean_reviews.py")
os.system("python 01_clean/clean_products.py")
os.system("python 01_clean/clean_sellers.py")
os.system("python 01_clean/clean_geolocation.py")

print("=== JOIN ===")
os.system("python 02_transform/join_data.py")

print("=== FEATURE ===")
os.system("python 03_feature/build_features.py")

print("=== LOAD ===")
os.system("python 04_load/load_postgres.py")

print("DONE")