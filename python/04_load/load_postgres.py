import pandas as pd
from sqlalchemy import create_engine, text
import os

# ============================================================
# 🔧 CONFIGURATION
# ============================================================
database_url = "postgresql://postgres:50028071@localhost:5432/ecommerce"
dataset_path = "C:/HOACODE/sale-data-project/dataset"

print("=" * 70)
print("📊 LOADING DATA TO POSTGRESQL")
print("=" * 70)
print(f"\n🔗 Database: {database_url}")
print(f"📁 Dataset Path: {dataset_path}\n")

# ============================================================
# ✅ CONNECT TO DATABASE
# ============================================================
try:
    engine = create_engine(database_url)
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))  # ✅ FIX: Wrap in text()
    print("✅ Database connected successfully!\n")
except Exception as e:
    print(f"❌ Database connection failed: {e}")
    print("   Make sure PostgreSQL is running and credentials are correct!")
    exit(1)

# ============================================================
# 📥 LOAD DATA FROM CSV FILES
# ============================================================
print("=" * 70)
print("📥 LOADING CSV FILES")
print("=" * 70)

try:
    print("\n📄 Loading customers...")
    customers = pd.read_csv(f"{dataset_path}/staging/customers_clean.csv")
    print(f"   ✅ Loaded {len(customers)} customers")

    print("\n📄 Loading products...")
    products = pd.read_csv(f"{dataset_path}/staging/products_clean.csv")
    print(f"   ✅ Loaded {len(products)} products")

    print("\n📄 Loading orders...")
    orders = pd.read_csv(f"{dataset_path}/staging/orders_clean.csv")
    print(f"   ✅ Loaded {len(orders)} orders")

    print("\n📄 Loading order items...")
    items = pd.read_csv(f"{dataset_path}/staging/order_items_clean.csv")
    print(f"   ✅ Loaded {len(items)} order items")

    print("\n📄 Loading payments...")
    payments = pd.read_csv(f"{dataset_path}/staging/payments_clean.csv")
    print(f"   ✅ Loaded {len(payments)} payment records")

    print("\n📄 Loading reviews...")
    reviews = pd.read_csv(f"{dataset_path}/staging/reviews_clean.csv")
    print(f"   ✅ Loaded {len(reviews)} reviews")

    # ✅ Optional: Load sellers if exists
    sellers_path = f"{dataset_path}/staging/sellers_clean.csv"
    if os.path.exists(sellers_path):
        print("\n📄 Loading sellers...")
        sellers = pd.read_csv(sellers_path)
        print(f"   ✅ Loaded {len(sellers)} sellers")
    else:
        print("\n⚠️  Sellers file not found - skipping")
        sellers = pd.DataFrame()

except FileNotFoundError as e:
    print(f"❌ File not found: {e}")
    print("\n   Please check the following files exist:")
    print(f"   - {dataset_path}/staging/customers_clean.csv")
    print(f"   - {dataset_path}/staging/products_clean.csv")
    print(f"   - {dataset_path}/staging/orders_clean.csv")
    print(f"   - {dataset_path}/staging/order_items_clean.csv")
    print(f"   - {dataset_path}/staging/payments_clean.csv")
    print(f"   - {dataset_path}/staging/reviews_clean.csv")
    exit(1)

# ============================================================
# 🔄 DATA TRANSFORMATION
# ============================================================
print("\n" + "=" * 70)
print("🔄 DATA TRANSFORMATION")
print("=" * 70)

print("\n⚙️  Processing datetime columns...")
orders['order_purchase_timestamp'] = pd.to_datetime(orders['order_purchase_timestamp'])
orders['order_delivered_customer_date'] = pd.to_datetime(orders['order_delivered_customer_date'])
orders['order_estimated_delivery_date'] = pd.to_datetime(orders['order_estimated_delivery_date'])

print("⚙️  Calculating delivery time...")
orders['delivery_time'] = (
    orders['order_delivered_customer_date'] - orders['order_purchase_timestamp']
).dt.days

print("⚙️  Detecting delayed orders...")
orders['is_delayed'] = (
    orders['order_delivered_customer_date'] > orders['order_estimated_delivery_date']
).astype(int)

# ✅ Handle NaN values for undelivered orders
orders['delivery_time'] = orders['delivery_time'].fillna(0).astype(int)
orders['is_delayed'] = orders['is_delayed'].fillna(0).astype(int)

print("⚙️  Aggregating payments by order...")
payments_agg = payments.groupby("order_id")["payment_value"].sum().reset_index()
payments_agg.columns = ["order_id", "total_amount"]

print("⚙️  Aggregating order items by order...")
# ✅ FIX: Group by order_id and take first product/seller (since 1 order can have multiple items)
items_agg = items.groupby("order_id").agg({
    "product_id": "first",      # First product ID (if order has multiple products)
    "seller_id": "first",       # First seller ID
    "price": "sum",             # Sum of all item prices
    "freight_value": "sum"      # Sum of freight
}).reset_index()

print("⚙️  Merging all data into fact table...")
# ✅ Merge orders with aggregated data
fact_orders = orders.merge(items_agg, on="order_id", how="left")
fact_orders = fact_orders.merge(payments_agg, on="order_id", how="left")
fact_orders = fact_orders.merge(reviews[['order_id', 'review_score']], on="order_id", how="left")

# ✅ Fill NaN values in numeric columns
fact_orders['total_amount'] = fact_orders['total_amount'].fillna(0)
fact_orders['price'] = fact_orders['price'].fillna(0)
fact_orders['freight_value'] = fact_orders['freight_value'].fillna(0)
fact_orders['review_score'] = fact_orders['review_score'].fillna(0)

# ✅ Select and rename columns for fact table
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

print(f"✅ Fact table prepared: {len(fact_orders)} rows")

# ============================================================
# 💾 CREATE DIMENSION TABLES
# ============================================================
print("\n" + "=" * 70)
print("💾 CREATING DIMENSION TABLES")
print("=" * 70)

print("\n💿 Creating dim_customers...")
dim_customers = customers[['customer_id', 'customer_state', 'customer_city']].drop_duplicates()
dim_customers.columns = ['customer_id', 'customer_state', 'customer_city']
dim_customers.to_sql("dim_customers", engine, if_exists="replace", index=False)
print(f"   ✅ Created with {len(dim_customers)} records")

print("\n💿 Creating dim_products...")
# ✅ FIX: Handle different column names
if 'product_category_name' in products.columns:
    dim_products = products[['product_id', 'product_category_name']].drop_duplicates()
elif 'product_category' in products.columns:
    dim_products = products[['product_id', 'product_category']].drop_duplicates()
    dim_products.columns = ['product_id', 'product_category_name']
else:
    dim_products = products[['product_id']].drop_duplicates()
    dim_products['product_category_name'] = 'Uncategorized'

dim_products.to_sql("dim_products", engine, if_exists="replace", index=False)
print(f"   ✅ Created with {len(dim_products)} records")

print("\n💿 Creating dim_sellers...")
if not sellers.empty and 'seller_id' in sellers.columns:
    dim_sellers = sellers[['seller_id', 'seller_state', 'seller_city']].drop_duplicates()
    dim_sellers.columns = ['seller_id', 'seller_state', 'seller_city']
    dim_sellers.to_sql("dim_sellers", engine, if_exists="replace", index=False)
    print(f"   ✅ Created with {len(dim_sellers)} records")
else:
    print("   ⚠️  Sellers data not available - skipping")

# ============================================================
# 📊 CREATE FACT TABLE
# ============================================================
print("\n" + "=" * 70)
print("📊 CREATING FACT TABLE")
print("=" * 70)

print("\n📈 Creating fact_orders...")
fact_orders.to_sql("fact_orders", engine, if_exists="replace", index=False)
print(f"   ✅ Created with {len(fact_orders)} records")

# ============================================================
# 📋 DATA VALIDATION & SUMMARY
# ============================================================
print("\n" + "=" * 70)
print("📋 DATA SUMMARY")
print("=" * 70)

print(f"\n✅ Dimension Tables:")
print(f"   • Customers: {len(dim_customers):,}")
print(f"   • Products: {len(dim_products):,}")
if not sellers.empty:
    print(f"   • Sellers: {len(dim_sellers):,}")

print(f"\n✅ Fact Table:")
print(f"   • Orders: {len(fact_orders):,}")
print(f"   • Total Revenue: ${fact_orders['total_amount'].sum():,.2f}")
print(f"   • Avg Order Value: ${fact_orders['total_amount'].mean():,.2f}")

print(f"\n✅ Order Status:")
total_with_delivery = fact_orders[fact_orders['delivery_time'] > 0].shape[0]
avg_delivery = fact_orders[fact_orders['delivery_time'] > 0]['delivery_time'].mean()
delayed_orders = fact_orders['is_delayed'].sum()
delay_rate = (delayed_orders / len(fact_orders) * 100) if len(fact_orders) > 0 else 0

print(f"   • Delivered Orders: {total_with_delivery:,}")
print(f"   • Avg Delivery Time: {avg_delivery:.1f} days")
print(f"   • Delayed Orders: {delayed_orders:,} ({delay_rate:.1f}%)")

print(f"\n✅ Customer Reviews:")
reviewed_orders = fact_orders[fact_orders['review_score'] > 0].shape[0]
avg_rating = fact_orders[fact_orders['review_score'] > 0]['review_score'].mean()
print(f"   • Reviewed Orders: {reviewed_orders:,}")
print(f"   • Avg Rating: {avg_rating:.2f}/5.0 ⭐")

# ============================================================
# ✅ SUCCESS MESSAGE
# ============================================================
print("\n" + "=" * 70)
print("🎉 DATA LOADED SUCCESSFULLY!")
print("=" * 70)
print("\n✨ You can now:")
print("   1. Start backend: cd backend && npm run dev")
print("   2. Start frontend: cd frontend && npm start")
print("   3. Login with: username=demo, password=demo123\n")