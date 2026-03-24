Online_Medication_And_Prescription_Tracker

Team Members:
- Akshata Kapare
- Priyansh Patel
- Khushi Sharma
- Shreya

# 💊 Prescripto - Online Medication & Prescription Tracker

A comprehensive web-based application for managing prescriptions and medication schedules efficiently.

**Developed as part of Infosys Springboard Internship Program**

---

## 📖 About The Project

Patients currently manage prescriptions and medicines using paper records and memory, which often leads to loss of prescriptions, missed doses, and medication errors. **Prescripto** solves this by providing a centralized digital platform for managing prescriptions and medication schedules efficiently.

---

## ✨ Features

### For Patients
- View digital prescriptions
- Track daily medicine schedule (Morning/Evening/Night)
- Mark doses as Taken or Missed
- View health report with adherence statistics
- Book appointments with doctors

### For Doctors
- Create digital prescriptions with medicine dropdown
- View all patients list
- Track patient medication adherence
- Manage appointments

### For Caregivers
- View linked patient's details
- Monitor patient's daily medicine status
- View patient's prescriptions

### For Admin
- View all users (Patients, Doctors, Caregivers)
- View user details
- Delete users
- Dashboard with system statistics

### Automated Features
- Auto-mark missed doses using Cron scheduler
- Reminder alerts for pending medicines

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Java 21, Spring Boot 4.0.2, Spring Security, Spring Data JPA |
| **Frontend** | React 18, Vite, React Router, Axios, Tailwind CSS |
| **Database** | MySQL 8.0 |
| **Authentication** | JWT (JSON Web Token) |

---

## 🚀 Setup Instructions

### Prerequisites
- Java 21
- Node.js 18+
- MySQL 8.0
- Maven

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/prescripto.git
cd prescripto

### Step 2: Database Setup
SQL

CREATE DATABASE prescripto_db_main;

### Step 3: Backend Setup

Bash

cd backend


Update src/main/resources/application.properties:

properties

spring.datasource.url=jdbc:mysql://localhost:3306/prescripto_db_main
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
jwt.secret=prescripto_jwt_secret_key_2024_secure
jwt.expiration=86400000
server.port=8080
Run backend:

Bash

./mvnw spring-boot:run
Backend runs on: http://localhost:8080

### Step 4: Frontend Setup
Bash

cd frontend
npm install
npm run dev
Frontend runs on: http://localhost:5173

🔐 Login Credentials
Admin (Hardcoded)
Field	Value
Email	admin@prescripto.com
Password	admin123


### Other Users

Register through the application as Patient, Doctor, or Caregiver.
