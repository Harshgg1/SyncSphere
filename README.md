# Realtime Chat with WebSockets & Redis

A horizontally scalable real-time chat application built with:

- Next.js (App Router)
- Native WebSockets (`ws`)
- Redis Pub/Sub
- TypeScript

This project demonstrates how to build a distributed real-time system without Socket.IO.

---

## 🚀 Architecture

Client (Next.js)
↓
WebSocket Server (Node.js)
↓
Redis Pub/Sub
↓
Multiple WS Instances (Scalable)


- WebSockets handle persistent client connections.
- Redis enables cross-server message broadcasting.
- System supports horizontal scaling without sticky sessions.

---

## 📦 Tech Stack

- Next.js 16
- Node.js
- ws
- Redis
- TypeScript

---

## 🛠️ How It Works

1. User joins a room via WebSocket.
2. Server subscribes to Redis channel for that room.
3. When a message is sent:
   - It is published to Redis.
   - All subscribed servers receive it.
   - Each server forwards it to connected clients.

This ensures scalability across multiple backend instances.

---

## ⚙️ Local Setup

### 1️⃣ Start Redis

Using Docker:

```bash
docker run -p 6379:6379 redis
2️⃣ Start WebSocket Server
cd ws-server
npm install
npm run dev
Runs on:

ws://localhost:8080
3️⃣ Start Frontend
From root:

npm install
npm run dev
Open:

http://localhost:3000
🧪 Testing
Open two browser tabs.

Create or join the same room.

Messages should sync in real-time.

📈 Scaling
To simulate multiple backend instances:

PORT=8080 npm run dev
PORT=8081 npm run dev
PORT=8082 npm run dev
Use a load balancer (e.g., Nginx) to distribute connections.

Redis handles cross-instance message broadcasting.

📌 Key Concepts Demonstrated
WebSocket lifecycle management

Pub/Sub architecture

Singleton pattern for Redis connection

Separation of transport vs message protocol

Horizontal scalability design