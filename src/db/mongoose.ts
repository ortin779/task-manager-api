import mongoose from 'mongoose'

mongoose.connect('mongodb://localhost:27017/task-manager-api')

interface User{
    name:string,
    age:number
}

const userSchema = new mongoose.Schema<User>({
    name:{
        type:String
    },
    age:{
        type:Number
    }
})

const User = mongoose.model('User',userSchema)

const naresh = new User({name:"Naresh",age:22})

naresh.save().then((res)=>{
    console.log(res)
}).catch((err)=>{
    console.log("Error occurred while saving...",err)
})