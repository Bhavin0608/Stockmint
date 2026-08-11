# Express and MongoDB Atlas Backend Server

A clean, structured Node.js starter backend application built with **Express** and connected to **MongoDB Atlas (Cloud)**. This project includes a modular database configuration setup.

---

## 🛠️ Project Prerequisites

Before you start, make sure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (includes npm)
* [Git](https://git-scm.com/)

---

## 🚀 Step-by-Step Local Setup

Follow these steps to set up and run this project on any computer:

### 1. Clone the Repository
Open your terminal or command prompt and run:
```bash
git clone https://github.com/Bhavin0608/Stockmint
cd backend
```

### 2. Install Project Dependencies
Install all required npm packages listed in the `package.json` file:
```bash
npm install

```

### 3. Configure Environment Variables
1. Create a new file named `.env` in the root directory of the project.
2. Open the `.env` file and add your configuration details:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
```
> ⚠️ **Important:** Replace `<username>` and `<password>` with your real MongoDB Atlas credentials. Never upload this `.env` file to GitHub!

### 4. Start the Server
Run the project locally using Node.js:
```bash
node server.js
```
Your terminal should print out:
* `Server executing live on port 5000`
* `☁️ MongoDB Atlas Connected: ...`

---

## 📁 Project Structure

```text
├── config/
│   └── db.js         # Modular database connection logic
├── .env              # Hidden environment credentials (git ignored)
├── .gitignore        # Prevents secret files from uploading to GitHub
├── package.json      # Project dependencies and configurations
└── server.js         # Main entry point for the Express server
```
