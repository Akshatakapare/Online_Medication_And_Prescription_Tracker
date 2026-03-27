Online_Medication_And_Prescription_Tracker

Team Members:
- Akshata Kapare
- Priyansh Patel
- Khushi Sharma
- Shreya

# 💊 Prescripto - Online Medication & Prescription Tracker

A full-stack web application to manage prescriptions and track medication schedules digitally.

Developed as part of the Infosys Springboard Internship Program.

---

# 📖 About The Project

Patients often rely on paper prescriptions and memory, which can lead to:

* Lost prescriptions
* Missed doses
* Incorrect medication usage

**Prescripto** solves this problem by providing a centralized digital platform where patients, doctors, caregivers, and admins can efficiently manage prescriptions and medication schedules.

---

# ✨ Features

## 👤 Patient

* View digital prescriptions
* Track daily medicine schedule (Morning / Evening / Night)
* Mark doses as Taken or Missed
* View adherence report (health stats)
* Book appointments with doctors

## 👨‍⚕️ Doctor

* Create prescriptions using medicine dropdown
* View patient list
* Track patient adherence
* Manage appointments

## 👨‍👩‍👧 Caregiver

* Monitor patient's medicines
* View prescriptions
* Track daily status

## 🛡️ Admin

* View all users
* Delete users
* Dashboard with system statistics

## ⚙️ Automated Features

* Auto-mark missed doses using Cron Job
* Reminder alerts for pending medicines

---

# 🛠️ Tech Stack

| Layer          | Technology                                             |
| -------------- | ------------------------------------------------------ |
| Backend        | Java 21, Spring Boot, Spring Security, Spring Data JPA |
| Frontend       | React (Vite), Tailwind CSS, Axios                      |
| Database       | MySQL 8                                                |
| Authentication | JWT (JSON Web Token)                                   |

---

# 📁 Project Structure

```
frontend/
└── src/
    ├── components/
    ├── pages/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── api.js
    



backend/
└── src/main/java/com/prescripto/
    ├── controller/
    ├── service/
    ├── repository/
    ├── entity/
    ├── scheduler/
    ├── security/
    
```

---

# 🚀 Setup Instructions

## ✅ Prerequisites

Make sure you have installed:

* Java 21
* Node.js (18+)
* MySQL 8
* Maven

---

# 🗄️ Step 1: Database Setup

Open MySQL and run:

```sql
CREATE DATABASE prescripto_db_main;
```

---

# ⚙️ Step 2: Backend Setup

```bash
cd backend
```

### Update application.properties

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/prescripto_db_main
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

jwt.secret=prescripto_jwt_secret_key_2024_secure
jwt.expiration=86400000

server.port=8080

# =============================================
# GEMINI AI API KEY (Add this line)
# =============================================
gemini.api.key= YOUR GEMINI API KEY
```

### Run Backend

```bash
./mvnw spring-boot:run
```

👉 Backend runs on: http://localhost:8080

---

# 🎨 Step 3: Frontend Setup

```bash
cd frontend
```

## Install dependencies

```bash
npm install
npm i react-router-dom
npm i axios
npm install tailwindcss @tailwindcss/vite
```

---

## 🔥 If project is not created yet (Vite + Tailwind setup)

```bash
npm create vite@latest
cd your-project-name
npm install
npm i react-router-dom
npm i axios
npm install tailwindcss @tailwindcss/vite
```



---

## ▶️ Run Frontend

```bash
npm run dev
```

👉 Frontend runs on: http://localhost:5173

---

# 🔐 API Configuration (IMPORTANT)

If your project uses AI or external APIs (like Gemini):

👉 Create `.env` file inside frontend:

```
VITE_API_BASE_URL=http://localhost:8080
VITE_AI_API_KEY=your_api_key_here
```

⚠️ Note:

* `.env` file GitHub pe push nahi hota
* Node modules bhi push nahi hote (use npm install)

---

# 🔑 Login Credentials

## Admin (Default)

| Field    | Value                                               |
| -------- | --------------------------------------------------- |
| Email    | [admin@prescripto.com] |
| Password | admin123                                            |

---

## Other Users

👉 Register as:

* Patient
* Doctor
* Caregiver

---

# 🧠 How It Works (Simple Flow)

1. User registers & logs in (JWT authentication)
2. Doctor creates prescription
3. Patient gets medicine schedule
4. Patient marks doses
5. System tracks adherence
6. Cron job marks missed doses automatically

---

# 📌 Important Notes

* Backend follows MVC Architecture (Controller → Service → Repository)
* Passwords are encrypted using BCrypt
* JWT is used for secure authentication
* Database is auto-managed using JPA (ddl-auto=update)

---

# 📜 License

This project is licensed under MIT License.

---

# 👨‍💻 Author

Developed during Infosys Springboard Internship Program.
