import mongoose, {Schema} from 'mongoose'
import validator from "validator";
import {ITask, IUser} from "../model/models";

mongoose.connect('mongodb://localhost:27017/task-manager-api')


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

const User = mongoose.model<IUser>('User',userSchema)

// const naresh = new User({
//     name:"Naresh",
//     email:"naresh@email.com",
//     password:"hello there"
// })
//
// naresh.save().then((response)=>{
//     console.log(response)
// }).catch((error)=>{
//     console.log("Error occurred while Saving the User : ",error)
// })

const taskSchema = new Schema<ITask>({
    description:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    }
})

const Task = mongoose.model("Task",taskSchema)

const newTask = new Task({
    description:"This is my new Task"
})

newTask.save().then((response)=>{
    console.log(response)
}).catch((error)=>{
    console.log("Error occurred : ",error)
})