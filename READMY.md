System Architecture
Raw Data (CSV)
        ↓
Data Processing (Python)
        ↓
Processed Data (CSV/JSON)
        ↓
Database (PostgreSQL) [optional]
        ↓
Backend API (NodeJS) [planned]
        ↓
Frontend Dashboard (React) [planned]

Raw Data (CSV)
    ↓
Data Cleaning (Python)
    ↓
Staging Layer (PostgreSQL)
    ↓
Data Warehouse (Star Schema)
    ↓
Feature Store (phục vụ AI)
    ↓
Backend API (Java)
    ↓
Frontend Dashboard


Data Processing Pipeline
Raw Data → Join → Clean → Analysis → Export → Visualization


Luống dữ liệu:
raw
 ↓
clean_orders.py
 ↓
staging
 ↓
join_data.py
 ↓
warehouse
 ↓
build_features.py
 ↓
features
 ↓
load_postgres.py
 ↓
PostgreSQL




Kiến trúc Star Schema
                 dim_time
                     |
dim_customer — fact_orders — dim_product
                     |
                dim_seller
                     |
                dim_location


TỔNG THỂ HỆ THỐNG 

| Folder     | Vai trò          |
| ---------- | ---------------- |
| entity     | map với table DB |
| repository | query DB         |
| service    | xử lý logic      |
| controller | API cho frontend |


                ┌────────────────────────────┐
                │      CSV / RAW DATA        │
                │ (Olist datasets, logs...)  │
                └────────────┬───────────────┘
                             │
                             ▼
                ┌────────────────────────────┐
                │   INGESTION LAYER          │
                │  (Batch + Streaming)       │
                │                            │
                │ - Python ETL / Spark       │
                │ - Kafka (real-time stream) │
                └────────────┬───────────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
┌──────────────────────┐        ┌────────────────────────┐
│  BATCH PROCESSING     │        │ REAL-TIME PROCESSING   │
│  Apache Spark        │        │ Spark Streaming        │
│                      │        │ Kafka Stream           │
└──────────┬───────────┘        └──────────┬─────────────┘
           │                               │
           └──────────────┬───────────────┘
                          ▼
              ┌────────────────────────────┐
              │   DATA STORAGE LAYER       │
              │                            │
              │ PostgreSQL (OLTP)         │
              │ Data Warehouse (schema)   │
              └────────────┬───────────────┘
                           │
                           ▼
              ┌────────────────────────────┐
              │  BACKEND API LAYER         │
              │  Spring Boot (Java)        │
              │  REST APIs                 │
              └────────────┬───────────────┘
                           │
            ┌──────────────┴──────────────┐
            ▼                             ▼
 ┌──────────────────────┐     ┌────────────────────────┐
 │ FRONTEND WEB APP     │     │ REAL-TIME DASHBOARD     │
 │ React / Next.js      │     │ WebSocket / SSE         │
 └──────────────────────┘     └────────────────────────┘
                           │
                           ▼
              ┌────────────────────────────┐
              │     AI LAYER (FUTURE)      │
              │                            │
              │ - ML model training        │
              │ - recommendation system    │
              │ - demand prediction        │
              └────────────────────────────┘

Real time Pipline(Streaming)
Event Source (orders/logs/clicks)
   ↓
Kafka Producer
   ↓
Kafka Topic
   ↓
Spark Streaming Consumer
   ↓
Real-time aggregation
   ↓
PostgreSQL / Redis
   ↓
WebSocket API (Spring Boot)
   ↓
Dashboard realtime update


WEB ARCHITECTURE(SPRIN BOOT)
Frontend (React)
       │
       ▼
Spring Boot REST API
       │
 ┌─────┼────────────┐
 ▼     ▼            ▼
Service Layer   WebSocket   AI Service (future)
       │
Repository Layer
       │
PostgreSQL


REAL TIME SYSTEM
Order Event Created
        ↓
     Kafka
        ↓
 Spark Streaming
        ↓
Compute:
- revenue realtime
- top products
- live orders
        ↓
PostgreSQL / Redis
        ↓
WebSocket push
        ↓
Frontend updates instantly

DOCKER ARCHITECTURE
┌──────────────┐
│ Frontend     │
├──────────────┤
│ Spring Boot  │
├──────────────┤
│ PostgreSQL   │
├──────────────┤
│ Kafka        │
├──────────────┤
│ Spark        │
└──────────────┘
      ↓
   Docker Compose

   

