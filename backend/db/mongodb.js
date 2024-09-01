import  mongoose from "mongoose";

const connectMongoDB = async() =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected");

    }catch(error){
        console.log(`Error Connection To MongoDB: ${error.message}`);
        process.exit(1);
    }
}


export default  connectMongoDB;
//