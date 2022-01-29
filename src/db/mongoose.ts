import mongoose,{Schema} from 'mongoose'

mongoose.connect('mongodb://localhost:27017/task-manager-api')

interface Task {
    description:string,
    isCompleted:boolean
}

const taskSchema = new Schema({
    description:{
        type:String
    },
    isCompleted:{
        type:Boolean
    }
})

const Task = mongoose.model<Task>('Task',taskSchema)

const task1 = new Task({
    description:"Task-1",
    isCompleted:false
})

task1.save().then((response)=>{
    console.log(response)
}).catch((error)=>{
    console.log("Error occurred while Saving the Task : ",error)
})