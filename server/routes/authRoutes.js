import express from "express";
import { isAuthenticated, login, logout, register, resetOtp, resetPassword, sendOtp, verifyAccount } from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();
authRouter.post('/register', register); 
authRouter.post('/login', login); 
authRouter.post('/logout', logout); 
authRouter.post('/get-otp', userAuth, sendOtp);
authRouter.post('/verify-account', userAuth, verifyAccount);
authRouter.get('/is-auth', userAuth, isAuthenticated);
authRouter.post('/get-reset-otp', resetOtp);
authRouter.post('/reset-password', resetPassword);

export default authRouter;