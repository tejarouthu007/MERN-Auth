import jwt from "jsonwebtoken";

const userAuth = async (req,res,next) => {
    const {token} = req.cookies;

    if(!token) {
        return res.json({success: false, message: "Not Authorized, Login Again!"});
    }

    try {
        const tkn =  jwt.verify(token, process.env.JWT_KEY);
        if(tkn.id) {
            req.body.userId = tkn.id;
        }
        else {
            return res.json({success: false, message: "Not Authorized, Login Again!"})
        }
        next();
    } catch(err) {
        res.json({success: false, message: err.message});
    }
} 

export default userAuth;