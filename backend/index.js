
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import authRoutes from "./routers/authroute.js";
import userRoutes from "./routers/userroute.js";
import postRoutes from "./routers/postroute.js";
import notificationRoutes from "./routers/notification.js";
import cors from 'cors';

import connectMongoDB from "./db/mongodb.js";

dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
	api_key: process.env.CLOUDNARY_API_KEY,
	api_secret: process.env.CLOUDNARY_API_SECRET,
});

const app = express();
const PORT =  process.env.PORT;
const __dirname = path.resolve(); // 2 step we do

const allowedOrigins = ["http://localhost:3000", "http://localhost:8080"];

app.use(cors({
	origin: (origin, callback) => {
		if (allowedOrigins.includes(origin) || !origin) { // Allow requests with no origin (e.g., Postman)
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true,
}));

app.use(express.json({ limit: "5mb" })); // to parse req.body
// limit shouldn't be too high to prevent DOS
app.use(express.urlencoded({ extended: true })); // to parse form data(urlencoded)

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/build"))); // step three build location

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html")); // step three build location
	});
}

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	connectMongoDB();
});
