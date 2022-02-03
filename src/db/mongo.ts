import mongoose from "mongoose";
export const connectToDatabase = (connectionString:string)=>{
    mongoose.connect(connectionString)
}