import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import 'dotenv/config';
import cnctDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 4000;
cnctDB();

app.use(express.json());
app.use(cookieParser());
const allowedOrigins = ['http://localhost:5173']
app.use(cors({origin: allowedOrigins, credentials: true}));


//api endpoints
app.get('/',(req, res)=> res.send("api working"));

app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);

app.listen(port, ()=> console.log(`port:${port}`));