# 🎬 Movie App - Technical Exam

โปรเจกต์นี้เป็นแอปพลิเคชันเว็บสำหรับจัดการ managing Movie records. ที่พัฒนาด้วย Next.js + TypeScript โดยรวมทั้ง Frontend และ Backend ไว้ในโปรเจกต์เดียว (Fullstack Monorepo Style)

---

## 📌 ภาพรวมโปรเจกต์

* พัฒนาโดยใช้ **Next.js (TypeScript)**
* รวมระบบ Frontend + Backend (API Routes / Server Actions)
* ใช้ **MongoDB** เป็นฐานข้อมูล
* มีระบบ Authentication ด้วย NextAuth
* มี Role-Based Access Control (RBAC)

---

## 🧰 Tech Stack

* Next.js
* TypeScript
* MongoDB
* NextAuth.js
* Docker
* Node.js

---

## ⚙️ วิธีติดตั้งและรันโปรเจกต์

### 1. เข้าโฟลเดอร์โปรเจกต์

```bash
cd Desktop/st-pretest
```

---

### 2. ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local`

```env
MONGODB_URI=mongodb://test:1234568@localhost:27017/movie-app?authSource=admin

NEXTAUTH_SECRET=NEXTKEY007

NEXTAUTH_URL=http://localhost:3000
```

> ⚠️ ตรวจสอบให้แน่ใจว่า port `27017` ของ MongoDB ไม่ถูกใช้งานโดย service อื่น

---

### 3. ติดตั้ง Dependencies

```bash
# npm
npm install

# yarn
yarn
```

---

### 4. รัน Docker (MongoDB)

```bash
docker-compose up -d
```

---

### 5. Restore Database

```bash
mongorestore --uri="mongodb://localhost:27017" ./dump
```

---

### 6. รันโปรเจกต์

```bash
# npm
npm run dev

# yarn
yarn dev
```

เปิดใช้งานที่:

```
http://localhost:3000
```

---

## 👤 บัญชีสำหรับทดสอบระบบ

### 🟢 Guest (เข้าดูได้เฉพาะ /movies)

Email: [Guest@test.co](mailto:Guest@test.co)
Password: 12345678

---

### 🟡 FloorStaff (ไม่สามารถลบข้อมูลได้)

Email: [FloorStaff@test.co](mailto:FloorStaff@test.co)
Password: 12345678

---

### 🟠 TeamLeader (ไม่สามารถลบข้อมูลได้)

Email: [TeamLeader@test.co](mailto:TeamLeader@test.co)
Password: 12345678

---

### 🔴 Manager (สิทธิ์เต็ม)

Email: [Manager@test.co](mailto:Manager@test.co)
Password: 12345678

---

## 📌 หมายเหตุ

* โปรเจกต์ต้องเชื่อมต่อ MongoDB ก่อนใช้งาน
* Docker ใช้สำหรับรันฐานข้อมูลเท่านั้น
* ตรวจสอบ port `27017` หากเกิดปัญหา

---

## 🚀 แนวคิดของระบบ

* ออกแบบเป็น Fullstack Application ในโปรเจกต์เดียว
* แยก logic ให้เหมาะสมและ maintain ได้ง่าย
* เน้น scalability และ clean architecture

---

## 📫 ผู้พัฒนา

[Nattawut Sarika](https://port.toramaru.cc/)
