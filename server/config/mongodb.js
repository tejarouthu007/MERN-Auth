import mongoose from "mongoose"

const cnctDB = async()=> {
    mongoose.connection.on('connected', ()=>{
        console.log("DB connected");
    });
    await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`);
};

export default cnctDB;