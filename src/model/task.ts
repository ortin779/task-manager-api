import mongoose, {Schema} from "mongoose";
import {User} from "./user";

export interface ITask {
    [key: string]: any,

    description: string,
    completed: boolean,
    author: mongoose.Schema.Types.ObjectId
}

const taskSchema = new Schema<ITask>({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

export const Task = mongoose.model("Task", taskSchema)