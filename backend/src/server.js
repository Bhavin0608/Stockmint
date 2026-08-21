import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import addressRouter from "./routes/address.routes.js";
import cookieParser from "cookie-parser";
import categoryRouter from "./routes/category.routes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse incoming JSON payloads
app.use(express.json());
app.use(cookieParser()); // it is use to convert browser cookies into a readable format for the server. it is used to read the refresh token from the cookie in the login route.

//All auth routes will be prefixed with /api/auth
//This is called mounting the router. All routes defined in authRouter will be accessible under /api/auth.
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/addresses', addressRouter);
app.use('/api/categories', categoryRouter);

// Call the db method
connectDB();

app.listen(PORT, () => {
    console.log(`Server executing live on port http://localhost:5000`);
});
