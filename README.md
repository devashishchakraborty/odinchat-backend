# OdinChat Backend

This is the **backend** for **OdinChat**, a real-time chat application built as part of [The Odin Project](https://www.theodinproject.com/) curriculum. It handles authentication, real-time communication using Socket.IO, and database operations for chat data and users.

> 🔗 [Frontend Repo](https://github.com/devashishchakraborty/odinchat)

---

## 🚀 Features

- 🔐 JWT-based user authentication
- 🧂 Secure password hashing with bcrypt
- 📡 Real-time messaging via Socket.IO
- 📁 REST API for users, messages, and profiles
- 🌐 CORS support for cross-origin frontend access

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **PostgreSQL** with **PrismaORM**
- **Socket.IO**
- **JWT and PassportJs** for authentication
- **bcrypt** for password encryption
- **dotenv** for environment variables

---


## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/devashishchakraborty/odinchat-backend.git
cd odinchat-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add:

```env
DATABASE_URL=
ACCESS_TOKEN_SECRET=
CLIENT_BASE_URL="http://localhost:5173"
```

### 4. Run the Server

```bash
node --watch .
```

The server will run on `http://localhost:3000` by default.

---

## 🔌 Socket.IO Overview

- Socket connection established after user login
- Handles:
  - Room joining
  - Real-time message broadcasting
  - User connect/disconnect tracking


## 🧠 Future Improvements

- Message persistence via Redis
- Rate limiting and security middleware
- Admin/moderator role support
- Message deletion/editing APIs


