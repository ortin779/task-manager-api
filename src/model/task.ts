import mongoose, {Schema} from "mongoose";

export interface ITask {
    [key: string]: any,
    description: string,
    completed: boolean
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
    }
})

export const Task = mongoose.model("Task", taskSchema)