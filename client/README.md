# 🚀 Intern Tracker System (MERN Stack)

A full-stack application designed to track intern applicants, manage their interview status, and record assessment scores. Built using the **MERN Stack** (MongoDB, Express.js, React, Node.js) as part of the Technical Assessment (Part 4).

![Project Status](https://img.shields.io/badge/Status-Completed-success)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue)

## 📋 Features

* **Create Interns:** Add new candidates with Name, Email, Role, Status, and Score.
* **Real-time Search:** Filter candidates instantly by name or email.
* **Status Management:** Track applicants through stages (Applied -> Interviewing -> Hired).
* **Data Persistence:** All data is stored persistently in MongoDB.
* **Responsive UI:** Clean, functional interface built with React + Vite.

---

## 🛠️ Tech Stack

### **Backend (Server)**
* **Node.js & Express:** RESTful API architecture.
* **MongoDB & Mongoose:** NoSQL database for flexible data schemas.
* **Cors:** Middleware for handling Cross-Origin Resource Sharing.

### **Frontend (Client)**
* **React (Vite):** Fast, modern frontend framework.
* **Axios:** HTTP client for API requests.
* **CSS3:** Custom styling for a clean layout.

---

## ⚙️ Installation & Setup

Follow these steps to run the application locally.

### **1. Prerequisites**
* Node.js (v14 or higher)
* MongoDB (Locally installed or Atlas URI)

### **2. Clone the Repository**
```bash
git clone [https://github.com/AbdullahEjaz512/intern-tracker.git](https://github.com/AbdullahEjaz512/intern-tracker.git)
cd intern-tracker

3. Backend SetupNavigate to the server directory and install dependencies:Bashcd server
npm install
Configuration:The application defaults to mongodb://127.0.0.1:27017/intern_tracker.If you are using MongoDB Atlas, create a .env file in the server folder:Code snippetMONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
Start the Server:Bashnpx nodemon index.js
# Output should confirm: "Server running on port 5000" and "MongoDB Connected"
4. Frontend SetupOpen a new terminal, navigate to the client directory, and install dependencies:Bashcd ../client
npm install
Start the Client:Bashnpm run dev
Access the application at http://localhost:5173.📡 API EndpointsMethodEndpointDescriptionGET/api/internsFetch all interns (supports ?q= for search).POST/api/internsCreate a new intern record.PATCH/api/interns/:idUpdate an intern's details.DELETE/api/interns/:idRemove an intern from the database.📂 Project StructureBashintern-tracker/
├── server/             # Backend Code
│   ├── index.js        # Main server file (API Routes & DB Config)
│   ├── package.json    # Backend dependencies
│   └── ...
├── client/             # Frontend Code
│   ├── src/
│   │   ├── App.jsx     # Main React Component (UI & Logic)
│   │   ├── main.jsx    # Entry point
│   ├── package.json    # Frontend dependencies
│   └── ...
└── README.md           # Documentation
📸 Screenshots👤
client\image.png
 Author: Abdullah Ejaz
 GitHub: AbdullahEjaz512
 Role: Technical Assessment Candidate