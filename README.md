# 📦 Inventory Management System with Barcode Scanner

A full-stack Inventory Management System built with **React.js**, **Spring Boot**, and **MySQL**. The system allows users to manage products, monitor stock levels, perform stock-in/stock-out transactions, and process sales using barcode scanning through a Point of Sale (POS) interface.

---

## 🚀 Features

### 📊 Dashboard
- Displays total products
- Available stock summary
- Low stock monitoring
- Out-of-stock monitoring
- Recent stock transactions

### 📦 Product Management
- Add new products
- Edit product information
- Delete products
- Search products by barcode
- Duplicate barcode and product name validation

### 📥 Stock Management
- Stock In products
- Stock Out products
- Automatic inventory updates
- Transaction history logging

### 🛒 Point of Sale (POS)
- Barcode scanning
- Shopping cart
- Quantity adjustment
- Remove items from cart
- Automatic stock deduction after checkout

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Axios
- CSS3

### Backend
- Spring Boot
- Spring Data JPA
- Maven

### Database
- MySQL

---

## 📁 Project Structure

```
store-inventory-system/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   └── App.jsx
│
├── backend/
│   ├── controller/
│   ├── entity/
│   ├── repository/
│   ├── service/
│   └── InventorySystemApplication.java
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/store-inventory-system.git
```

### 2. Backend Setup

```bash
cd backend
```

Configure your **application.properties**

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/inventory_db
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Run the Spring Boot application.

---

### 3. Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on

```
http://localhost:5173
```

Backend runs on

```
http://localhost:8080
```

---

## 📷 Screens

- Dashboard
- Products
- Stock Transactions
- Point of Sale (POS)

---

## 🔌 REST API

### Products

| Method | Endpoint |
|----------|----------------------------|
| GET | /api/products |
| GET | /api/products/barcode/{barcode} |
| POST | /api/products |
| PUT | /api/products/{id} |
| DELETE | /api/products/{id} |

---

### Stock

| Method | Endpoint |
|----------|------------------------------|
| POST | /api/stock/{id}/in |
| POST | /api/stock/{id}/out |
| GET | /api/stock |
| GET | /api/stock/product/{id} |

---

## 📌 Future Improvements

- User Authentication (Admin/Cashier)
- Sales Reports
- Printable Receipts
- Barcode Generation
- Product Categories
- Supplier Management
- Inventory Analytics
- Sales Dashboard Charts
- Export Reports (PDF/Excel)

---

## 👨‍💻 Author

**Jivonz Dy**

Bachelor of Science in Information Technology

---

## 📄 License

This project is for educational purposes.
