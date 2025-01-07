import userModel from "../models/userModel.js";

export const getUserData = async(req,res)=> {
    try {
        const {userId} = req.body;
        const user = await userModel.findById(userId);

        if(!user) {
            return res.json({success: false, message: "No such user!"});
        }

        res.json({success: true, userData: {
                name: user.name,
                isVerified: user.isVerified
            }
        })
    } catch(err) {
        res.json({success: false, message: err.message});
    }
}