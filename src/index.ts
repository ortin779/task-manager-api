import express from "express";
import {connectToDatabase} from "./db/mongo";
import {User} from "./model/user";
import {Task} from "./model/task";

const app = express()
const port = process.env.PORT || 3000
connectToDatabase('mongodb://localhost:27017/task-manager-api')

app.use(express.json())

app.post("/users",((req, res) => {
    const user = new User(req.body)
    user.save().then((response)=>{
        res.status(201)
        res.send(response)
    }).catch((err)=>{
        res.status(400)
        res.send({
            "error":err
        })
    })
}))

app.get("/users", (req, res) => {
    User.find({}).then((users)=>{
        res.status(200).send(users)
    }).catch((error)=>{
        res.status(400);
        res.send({
            error:error
        })
    })
})

app.get("/users/:id",async (req, res) => {
    const userId = req.params.id;
    User.find({_id: userId}).then((user)=>{
        res.status(200).send(user)
    }).catch((error)=>{
        res.status(400);
        res.send({
            error:error
        })
    });
})

app.post("/tasks",(req, res) => {
    const task = new Task(req.body);
    task.save().then((response)=>{
        res.status(201);
        res.send(response);
    }).catch((error)=>{
        res.status(400);
        res.send({
            error:error
        })
    })
})

app.get("/tasks",(req, res) => {
    Task.find({}).then((tasks)=>{
        res.status(200).send(tasks)
    }).catch((error)=>{
        res.status(400).send(error)
    })
})

app.get("/tasks/:taskId",(req, res) => {
    const taskId = req.params.taskId;
    Task.find({_id:taskId}).then((task)=>{
        res.status(200).send(task)
    }).catch((error)=>{
        res.status(400).send(error)
    })
})

app.listen(port,()=>{
    console.log("Successfully Running on PORT : ",port)
})