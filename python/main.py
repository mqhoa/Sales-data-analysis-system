import pandas as pd
from sqlalchemy import create_engine

# Kết nối database
engine = create_engine("postgresql://postgres:50028071@localhost:5432/ecommerce")

print("Loading data from CSV files...")

# Đường dẫn đến các file
dataset_path = "C:/HOACODE/sale-data-project/dataset"

try:
    # 1. Load DIM_CUSTOMERS từ file staging
    print("\n📥 Loading customers...")
    customers = pd.read_csv(f"{dataset_path}/staging/customers_clean.csv")
    dim_customers = customers[['customer_id', 'customer_state', 'customer_city']].drop_duplicates()
    dim_customers.to_sql("dim_customers", engine, if_exists="replace", index=False)
    print(f"✅ Loaded {len(dim_customers)} customers")

    # 2. Load DIM_PRODUCTS
    print("\n📥 Loading products...")
    products = pd.read_csv(f"{dataset_path}/staging/products_clean.csv")
    # Kiểm tra column name
    if 'product_category_name' in products.columns:
        dim_products = products[['product_id', 'product_category_name']].drop_duplicates()
    elif 'product_category' in products.columns:
        dim_products = products[['product_id', 'product_category']].drop_duplicates()
        dim_products.columns = ['product_id', 'product_category_name']
    else:
        dim_products = products[['product_id']].drop_duplicates()
        dim_products['product_category_name'] = 'Uncategorized'
    
    dim_products.to_sql("dim_products", engine, if_exists="replace", index=False)
    print(f"✅ Loaded {len(dim_products)} products")

    # 3. Load DIM_SELLERS
    print("\n📥 Loading sellers...")
    sellers = pd.read_csv(f"{dataset_path}/staging/sellers_clean.csv") if pd.io.common.file_exists(f"{dataset_path}/staging/sellers_clean.csv") else pd.DataFrame()
    
    if not sellers.empty:
        dim_sellers = sellers[['seller_id', 'seller_state', 'seller_city']].drop_duplicates()
        dim_sellers.to_sql("dim_sellers", engine, if_exists="replace", index=False)
        print(f"✅ Loaded {len(dim_sellers)} sellers")
    else:
        print("⚠️ Sellers file not found, skipping...")

    # 4. Load FACT_ORDERS
    print("\n📥 Loading orders...")
    orders = pd.read_csv(f"{dataset_path}/staging/orders_clean.csv")
    items = pd.read_csv(f"{dataset_path}/staging/order_items_clean.csv")
    payments = pd.read_csv(f"{dataset_path}/staging/payments_clean.csv")
    reviews = pd.read_csv(f"{dataset_path}/staging/reviews_clean.csv")

    # Aggregate payments by order
    payments_agg = payments.groupby("order_id")["payment_value"].sum().reset_index()
    payments_agg.columns = ["order_id", "total_amount"]

    # Aggregate items by order
    items_agg = items.groupby("order_id").agg({
        "product_id": "first",
        "seller_id": "first",
        "price": "sum",
        "freight_value": "sum"
    }).reset_index()

    # Merge all data
    fact_orders = orders.merge(items_agg, on="order_id", how="left")
    fact_orders = fact_orders.merge(payments_agg, on="order_id", how="left")
    fact_orders = fact_orders.merge(reviews, on="order_id", how="left")

    # Calculate delivery time
    fact_orders['order_purchase_timestamp'] = pd.to_datetime(fact_orders['order_purchase_timestamp'])
    fact_orders['order_delivered_customer_date'] = pd.to_datetime(fact_orders['order_delivered_customer_date'])
    fact_orders['order_estimated_delivery_date'] = pd.to_datetime(fact_orders['order_estimated_delivery_date'])

    fact_orders['delivery_time'] = (
        fact_orders['order_delivered_customer_date'] - fact_orders['order_purchase_timestamp']
    ).dt.days

    fact_orders['is_delayed'] = (
        fact_orders['order_delivered_customer_date'] > fact_orders['order_estimated_delivery_date']
    ).astype(int)

    # Select and rename columns
    fact_orders = fact_orders[[
        'order_id', 'customer_id', 'product_id', 'seller_id',
        'order_purchase_timestamp', 'order_delivered_customer_date',
        'price', 'freight_value', 'total_amount',
        'delivery_time', 'is_delayed', 'review_score'
    ]].copy()

    fact_orders.columns = [
        'order_id', 'customer_id', 'product_id', 'seller_id',
        'order_date', 'delivered_date',
        'price', 'freight_value', 'total_amount',
        'delivery_time', 'is_delayed', 'review_score'
    ]

    # Handle NaN values
    fact_orders['delivery_time'] = fact_orders['delivery_time'].fillna(-1).astype(int)
    fact_orders['is_delayed'] = fact_orders['is_delayed'].fillna(0).astype(int)
    fact_orders['review_score'] = fact_orders['review_score'].fillna(0)

    fact_orders.to_sql("fact_orders", engine, if_exists="replace", index=False)
    print(f"✅ Loaded {len(fact_orders)} orders")

    # Summary
    print("\n" + "="*50)
    print("📊 DATA SUMMARY")
    print("="*50)
    print(f"Customers: {len(dim_customers)}")
    print(f"Products:  {len(dim_products)}")
    if not sellers.empty:
        print(f"Sellers:   {len(dim_sellers)}")
    print(f"Orders:    {len(fact_orders)}")
    print(f"Total Revenue: ${fact_orders['total_amount'].sum():,.2f}")
    print(f"Avg Delivery Time: {fact_orders[fact_orders['delivery_time'] > 0]['delivery_time'].mean():.1f} days")
    print(f"Delayed Orders: {fact_orders['is_delayed'].sum()} ({fact_orders['is_delayed'].mean()*100:.1f}%)")
    print(f"Avg Review Score: {fact_orders[fact_orders['review_score'] > 0]['review_score'].mean():.2f}/5")
    print("="*50)
    print("✅ Data loaded successfully!")

except Exception as e:
    print(f"\n❌ Error: {str(e)}")
    print("\nMake sure these files exist:")
    print(f"  - {dataset_path}/staging/customers_clean.csv")
    print(f"  - {dataset_path}/staging/products_clean.csv")
    print(f"  - {dataset_path}/staging/orders_clean.csv")
    print(f"  - {dataset_path}/staging/order_items_clean.csv")
    print(f"  - {dataset_path}/staging/payments_clean.csv")
    print(f"  - {dataset_path}/staging/reviews_clean.csv")