import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodeMailer.js";

export const register = async(req, res) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password) {
        return res.json({success: false, message: "Missing details!"});
    }

    try {
        const ex = await userModel.findOne({email});
        if(ex) {
            return res.json({success: false, message: "User already exists"});
        }

        const hashPassword = await bcrypt.hash(password,10);

        const user = new userModel({name, email, password: hashPassword});
        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_KEY, {expiresIn: '10d'});
        
        res.cookie('token',token, {
            httpOnly: true,
            secure: process.env.NODE_ENV==='production',
            sameSite: process.env.NODE_ENV==='production'? 'none': 'strict',
            maxAge: 10*24*60*60*1000
        });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome!",
            text: `Welcome!, Your account has been created with email ID: ${email}`
        };

        await transporter.sendMail(mailOptions);

        return res.json({success: true});
        
    } catch(err) {
        res.json({success: false, message: error.message});
    }
}


export const login = async(req,res) => {
    const {email,password} = req.body;
    
    if(!email || !password) {
        return res.json({success: false, message: "Missing Details!"});
    }
    
    try {
        const user = await userModel.findOne({email});
        if(!user) {
            return res.json({success: false, message: "Invalid email id!"});
        }
        const match = await bcrypt.compare(password, user.password);
        
        if(!match) {
            return res.json({success: false, message: "Invalid Password!"});
        }
        
        const token = jwt.sign({id: user._id}, process.env.JWT_KEY, {expiresIn: '10d'});
        
        res.cookie('token',token, {
            httpOnly: true,
            secure: process.env.NODE_ENV==='production',
            sameSite: process.env.NODE_ENV==='production'? 'none': 'strict',
            maxAge: 10*24*60*60*1000
        });

        return res.json({success: true});
        
    } catch(err) {
        return res.json({success: false, message: err.message});
    }
}

export const logout = async(req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV==='production',
            sameSite: process.env.NODE_ENV==='production'? 'none': 'strict',
        });
        return res.json({success: true, message: "Logged Out!"})
    }
    catch(err) {
        return res.json({success: false, message: err.message})
    }
}

export const sendOtp = async(req, res) => {
    try {
        const {userId} = req.body;
        const user = await userModel.findById(userId);

        if(user.isVerified) {
            return res.json({success: false, message: "Account verified already!"});
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOTP = otp;
        user.verifyOTPExpire = Date.now() + 24*60*60*1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification",
            text: `Your Otp is: ${otp}`
        };

        await transporter.sendMail(mailOptions);

        return res.json({success: true, message: "Verification OTP sent on Email!"});
    }
    catch(err) {
        return res.json({success: false, message: err.message})
    }
} 

export const verifyAccount = async(req,res) => {
    const {userId, otp} = req.body;

    if(!userId || !otp) {
        return res.json({success: false, message: "Missing details!"});
    }

    try {
        const user = await userModel.findById(userId);
        if(!user) {
            return res.json({success: false, message: "No such user!"})
        }

        if(user.verifyOTP==='' || user.verifyOTP!==otp) {
            return res.json({success: false, message: "Invalid OTP!"});
        }

        if(user.verifyOTPExpire < Date.now()) {
            return res.json({success: false, message:"OTP expired!"})
        }

        user.isVerified = true;
        user.verifyOTP = '';
        user.verifyOTPExpire = 0;

        await user.save();

        return res.json({success: true, message: "Account Verified Successfully!"});

    } catch(err) {
        return res.json({success: false, message: err.message});
    }
}

export const isAuthenticated = async (req,res) => {
    try {

        return res.json({success: true});
    } catch(err) {
        res.json({success: false, message: err.message});
    }
}

export const resetOtp = async(req,res) => {
    const {email} = req.body;
    if(!email) {
        return res.json({success: false, message: "Missing Email!"});
    }

    try {
        const user = await userModel.findOne({email});
        if(!user) {
            return res.json({success: false, message: "No such user!"});
        }
        
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        
        user.resetOTP = otp;
        user.resetOTPExpire = Date.now() + 15*60*1000;
        
        await user.save();
        
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset OTP",
            text: `Your Otp is: ${otp}`
        };

        await transporter.sendMail(mailOptions);
        
        return res.json({success: true, message: "OTP sent to your Email!"});
        
    } catch(err) {
        res.json({success: false, message: err.message})
    }
}

export const resetPassword = async(req,res) => {
    const {email, otp, newPassword} = req.body;
    
    if(!email || !otp ||!newPassword) {
        return res.json({success: false, message: "Missing Details!"});
    }
    
    try {
        const user = await userModel.findOne({email});
        if(!user) {
            return res.json({success: false, message: "No such user!"});
        }
        if(user.resetOTP==='' || user.resetOTP !== otp) {
            return res.json({success: false, message: "Invalid OTP!"});
        }
        if(user.resetOTPExpire < Date.now()) {
            return res.json({success: false, message: "OTP Expired!"});
        }

        const hashpass = await bcrypt.hash(newPassword, 10);
        user.password = hashpass;
        user.resetOTP = '';
        user.resetOTPExpire = 0;

        await user.save();

        return res.json({success: true, message:"Password reset successfully!"});
    } catch(err) {
        return res.json({success: false, message: err.message});
    }
}