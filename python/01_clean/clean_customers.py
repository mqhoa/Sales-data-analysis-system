'''
1. File olist_customers_dataset.csv có các cột:
customer_id                 ID riêng cho mỗi đơn hàng
customer_unique_id          ID duy nhất của từng khách hàng
customer_zip_code_prefix    Mã bưu chính/ZIP codw của khách hàng
customer_city               Thành phố của khách hàng
customer_state              Khu cực của khách hàng


=> Cần clean những cái sau:
- Đơn hàng trùng lặp qua customer_id XXX
- Dữ liệu trống
- Dự liệu đúng định dạng
- Loại bỏ dữ liệu fake

'''



import pandas as pd

df = pd.read_csv("C:/HOACODE/sale-data-project/dataset/raw/olist_customers_dataset.csv")

df = df.drop_duplicates(subset=['customer_id'])

df.to_csv("C:/HOACODE/sale-data-project/dataset/staging/customers_clean.csv", index=False)

print("customers cleaned")