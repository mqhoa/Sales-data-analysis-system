# Sales Data Analysis System

## Giới thiệu

Website dashboard hỗ trợ trực quan hóa và phân tích dữ liệu bán hàng thông qua các biểu đồ và chỉ số thống kê.

## Công nghệ sử dụng

* Frontend: React, Recharts, Chart.js
* Backend: Node.js, Express.js
* Database: PostgreSQL

## Cài đặt

### Clone project

```bash
git clone <repository-url>
```

### Cài đặt dependencies

Thư mục gốc:

```bash
npm install
```

Thư mục backend:

```bash
cd backend
npm install
```

### Cấu hình môi trường

Tạo file `.env` trong thư mục `backend` dựa trên file `.env.example`.

### Cấu hình cơ sở dữ liệu

Tạo database PostgreSQL và thực thi các script trong thư mục `sql`.

## Chạy chương trình

Backend:

```bash
cd backend
npm start
```

Frontend:

```bash
npm start
```

## Lưu ý

File `.env` không được đưa lên GitHub vì chứa thông tin cấu hình và dữ liệu nhạy cảm.
