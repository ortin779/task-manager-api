import mongoose, {Model, Schema} from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IUser extends Document{
    [key:string]:any,
    name:string,
    email:string,
    password:string,
    age:number,
    tokens:{token:string}[]
}

interface ExcludedUserProps {
    password:string;
    tokens:string[]
}

export interface IUserModel extends Model<IUser>{
    findUserByCredentials(email:string,password:string):IUser;
    generateJwtToken():string;
    getPublicProfile():Exclude<IUser, ExcludedUserProps>
}

const userSchema:Schema<IUser,IUserModel> = new Schema<IUser,IUserModel>({
    name:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true,
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
    },
    tokens:[{
        token:{
            type:String
        }
    }]
})

userSchema.method("generateJwtToken",async function generateJwtToken(){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},"salt")
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token;
})

userSchema.method("toJSON",function (){
    const user = this
    const userObject = user.toObject();
    delete userObject.password
    delete userObject.tokens
    return userObject;
})

userSchema.static("findUserByCredentials",async function findUserByCredentials(email:string,password:string) {
    const user = await User.findOne({email});
    if(!user){
        throw new Error("Invalid Login, Please Try again")
    }
    const isPasswordMatched = await bcrypt.compare(password,user.password);
    if(!isPasswordMatched){
        throw new Error("Invalid Login, Please Try Again")
    }
    await user.generateJwtToken();
    return user;
})

userSchema.pre('save', async function (next){
    const user = this;
    if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next()
})

export const User = mongoose.model<IUser,IUserModel>('User',userSchema)