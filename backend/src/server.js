// Demo server for test.
import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
//const express = require('express');
//const connectDB = require('./config/db');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// Log the environment variables to verify they are loaded correctly
console.log("MONGO_URI:", !!process.env.MONGO_URI);
console.log("JWT_SECRET:", !!process.env.JWT_SECRET);

// Middleware to parse incoming JSON payloads
app.use(express.json());

//All auth routes will be prefixed with /api/auth
//This is called mounting the router. All routes defined in authRouter will be accessible under /api/auth.
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
// Call the db method
connectDB();

app.listen(PORT, () => {
    console.log(`Server executing live on port http://localhost:5000`);
});
