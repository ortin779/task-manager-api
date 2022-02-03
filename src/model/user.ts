import mongoose, {Schema} from "mongoose";
import validator from "validator";

export interface IUser{
    name:string,
    email:string,
    password:string,
    age:number
}

const userSchema = new Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        trim:true,
        required:true,
        validate:(email:string)=>{
            return validator.isEmail(email)
        }
    },
    password:{
        type:String,
        trim:true,
        required:true,
        minlength:6,
        validate:(password:string)=>{
            if(password.toLowerCase().includes("password")){
                throw new Error("Password Can't be 'password'")
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate:(age:number)=>{
            if(age<0){
                throw new Error("Invalid Age value")
            }
        }
    }
})

export const User = mongoose.model<IUser>('User',userSchema)