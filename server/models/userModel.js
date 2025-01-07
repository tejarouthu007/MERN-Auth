import mongoose from "mongoose";

const user_schema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isVerified: {type: Boolean, default: false},
    verifyOTP: {type: String, default: ""},
    verifyOTPExpire: {type: Number, default: 0},
    resetOTP: {type: String, default: ""},
    resetOTPExpire: {type: Number, default: 0},
});

const userModel = mongoose.models.user || mongoose.model('user',user_schema);

export default userModel;