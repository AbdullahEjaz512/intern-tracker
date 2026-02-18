Markdown
# Intern Tracker (MERN Stack)

A full-stack application to track and manage intern applications. Features include a RESTful API, database persistence, and a responsive frontend with advanced filtering.

## 🚀 Live Demo
- **Frontend:** [https://intern-tracker-liard.vercel.app/]
- **Backend:** [https://intern-tracker.vercel.app]

## ✨ Features
- **CRUD Operations:** Create, Read, Update, and Delete interns.
- **Advanced Filtering:** Filter by Role (Frontend, Backend, Fullstack) and Status.
- **Search:** Real-time search by Name or Email.
- **Validation:** Server-side and client-side input validation.
- **Responsive UI:** Clean interface built with React and CSS.

## 🛠️ Tech Stack
- **Frontend:** React, Vite, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas)
- **Deployment:** Vercel

## ⚙️ Local Installation & Run Instructions

### Prerequisites
- Node.js installed
- MongoDB connection string (Atlas or Local)

### 1. Clone the Repository
```bash
git clone [https://github.com/AbdullahEjaz512/intern-tracker.git](https://github.com/AbdullahEjaz512/intern-tracker.git)
cd intern-tracker
2. Setup Backend
Navigate to the API directory:
```bash
cd api
npm install

Create a .env file in the api folder:

Code snippet
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/intern_tracker
Start the Server:

Bash
node index.js   # or 'npm start'
3. Setup Frontend
Open a new terminal:

Bash
cd client
npm install
npm run dev
The application will be available at http://localhost:5173.

Note for Reviewers:
This project is configured for deployment on Vercel. The api/index.js file exports the Express app for serverless execution.


### **Final Step: Push to GitHub**
1.  Create/Update the file `README.md` in your project folder.
2.  Paste the text above.
3.  Run:
    ```bash
    git add README.md
    git commit -m "Update README with run instructions"
    git push
    ```
