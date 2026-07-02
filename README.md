# 📦 Store Inventory System

A full-stack web-based Store Inventory System built with **React**, **Spring Boot**, and **Supabase PostgreSQL**. The system helps businesses efficiently manage products, inventory, sales, and stock movements through an intuitive dashboard.

---

## 🚀 Features

- 🔐 User Authentication
- 📦 Product Management
- 📊 Dashboard Analytics
- 🛒 Point of Sale (POS)
- 📥 Stock In / Stock Out
- 🔔 Low Stock Notifications
- 📜 Transaction History
- 📈 Inventory Monitoring
- ☁️ Cloud Database (Supabase)

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Axios
- CSS
- Lucide React Icons

### Backend
- Spring Boot
- Spring Data JPA
- Maven
- REST API

### Database
- PostgreSQL (Supabase)

---

## 📂 Project Structure

```
store-inventory-system/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── mvnw
│
└── README.md
```

---

## ⚙️ Prerequisites

Before running the project, install:

- Java 21+ (or your project's required version)
- Node.js 18+
- Maven
- Git
- Supabase Account

---

## 📥 Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/store-inventory-system.git

cd store-inventory-system
```

---

### 2. Configure the Backend

Navigate to the backend folder.

```bash
cd backend
```

Create or update your `application.properties`.

```properties
spring.datasource.url=YOUR_SUPABASE_DATABASE_URL
spring.datasource.username=YOUR_SUPABASE_USERNAME
spring.datasource.password=YOUR_SUPABASE_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Run the backend.

```bash
./mvnw spring-boot:run
```

Windows:

```bash
mvnw.cmd spring-boot:run
```

Backend runs on:

```
http://localhost:8080
```

---

### 3. Configure the Frontend

Navigate to the frontend folder.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

Start the React application.

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## ☁️ Database

This project uses **Supabase PostgreSQL** as its cloud database.

Benefits include:

- Cloud-hosted database
- Automatic backups
- Secure PostgreSQL
- Accessible from anywhere

---


## 🔮 Future Improvements

- Barcode Scanner Integration
- Sales Reports (PDF/Excel)
- Multi-user Roles
- Supplier Management
- Customer Management
- Email Notifications
- Audit Logs
- Mobile Responsive UI

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a new branch.
3. Commit your changes.
4. Push the branch.
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Developer

Developed by **Jivonz Dy**

GitHub:
https://github.com/YOUR_USERNAME
