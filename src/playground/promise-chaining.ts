import {connectToDatabase} from "../db/mongo"
import {Task} from "../model/task";

connectToDatabase("mongodb://localhost:27017/task-manager-api")

Task.findByIdAndRemove("61fc0ea4963025ee27dd1214").then(() => {
    return Task.countDocuments({completed: false})
}).then((incompleteTasks) => {
    console.log(incompleteTasks)
})


const deleteTaskAndFindIncompleteTasks = async (taskId:string) => {
    await Task.findByIdAndDelete(taskId);
    return Task.countDocuments({completed: false});
}

deleteTaskAndFindIncompleteTasks("61fd4a525d47cdff97d9056f").then((count)=>{
    console.log("count",count)
}).catch((err)=>{
    console.log("Error",err)
})