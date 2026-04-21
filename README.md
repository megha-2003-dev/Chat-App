## 🚀 Live Demo
👉 https://chat-app-megha-2003-devs-projects.vercel.app/


## 📌 Real-Time Chat Application

A real-time chat application built using React, Node.js, and Socket.IO that allows multiple users to communicate instantly.

### ✨ Features
- Real-time messaging using WebSockets
- Typing indicator
- Multi-user support
- Responsive UI with Tailwind CSS
- Deployed using Vercel (Frontend) and Render (Backend)

---

## 🛠 Tech Stack
- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express, Socket.IO
- Deployment: Vercel + Render


---

## 📸 Screenshots

### 🟢 Join Screen
User enters username to join the chat.

![Join Screen](./screenshots/join.png)

---

### 💬 Chat Interface
Real-time messaging between multiple users.

![Chat UI](./screenshots/chat.png)

---

### ✍️ Typing Indicator
Displays when another user is typing in real-time.

![Typing Indicator](./screenshots/typing.png)
---

## ⚙️ Installation & Setup

### Clone the repository

```
git clone https://github.com/megha-2003-dev/chat-app.git
cd chat-app
```

### Install dependencies

#### Client

```
cd client
npm install
```

#### Server

```
cd server
npm install
```

### Run the project

#### Start backend

```
cd server
node index.js
```

#### Start frontend

```
cd client
npm run dev
```

---

## 📌 How It Works

* Users connect through WebSockets using Socket.io
* Messages are sent to the server and broadcast to all connected clients
* Typing indicator is implemented using real-time events (`typing`, `stop_typing`)
* UI updates dynamically based on incoming events

---

## 🌱 Future Improvements

* Online users list
* Message persistence (database integration)
* Authentication system
* Improved mobile responsiveness

---

## 👩‍💻 Author

**Megha Sharma**

GitHub: https://github.com/megha-2003-dev

---

## ⭐ Support

If you found this project useful, consider giving it a star ⭐
