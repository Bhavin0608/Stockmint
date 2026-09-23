import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import addressRouter from "./routes/address.routes.js";
import categoryRouter from "./routes/category.routes.js";
import productRouter from "./routes/product.routes.js";
import inventoryRouter from "./routes/inventory.routes.js";
import reservationRouter from "./routes/reservation.routes.js";
import cartRouter from "./routes/cart.routes.js";
import orderRouter from "./routes/order.routes.js";
import adminOrderRouter from "./routes/adminorder.routes.js";
//test 
// import { expireReservations } from "./services/reservation.service.js";

// start a job to check for expired reservations and release them
import { startReservationExpiryJob } from "./jobs/reservation.job.js";

import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// cors is browser access policy.
// Enable CORS for requests from the frontend
// It sync the frontend and backend ports to avoid CORS issues. The frontend is running on port 5173 and the backend on port 5000. The credentials: true option allows cookies to be sent with requests, which is necessary for authentication.
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true,
}));
// Middleware to parse incoming JSON payloads
app.use(express.json());
app.use(cookieParser()); // it is use to convert browser cookies into a readable format for the server. it is used to read the refresh token from the cookie in the login route.

//All auth routes will be prefixed with /api/auth
//This is called mounting the router. All routes defined in authRouter will be accessible under /api/auth.
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/addresses', addressRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/reservations', reservationRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);
app.use('/api/admin/orders', adminOrderRouter);

// Error handling middleware
app.use(errorHandler);

// Call the db method
connectDB();

// Start the reservation expiry job
startReservationExpiryJob();

// await expireReservations();

app.listen(PORT, () => {
    console.log(`Server executing live on port http://localhost:${PORT}`);
});
