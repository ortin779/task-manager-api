import express from "express";
import {connectToDatabase} from "./db/mongo";
import {User} from "./model/user";
import {Task} from "./model/task";

const app = express()
const port = process.env.PORT || 3000
connectToDatabase('mongodb://localhost:27017/task-manager-api')

app.use(express.json())

app.post("/users", async (req, res) => {
    const user = new User(req.body)
    try {
        const savedUser = await user.save();
        res.status(201).send(savedUser);
    } catch (e) {
        res.status(400).send(e)
    }
})

app.get("/users", async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send(users)
    } catch (e) {
        res.status(400).send(e)
    }
})

app.get("/users/:id", async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (user) {
            return res.status(200).send(user)
        }
        res.status(404).send({message: "No User with given id"})
    } catch (e) {
        res.status(400).send(e)
    }
})

app.put("/users/:id",async (req, res) => {
    const userId = req.params.id;
    const allowedUpdates = ["name", "age", "password", "email"];
    const requestedUpdates = Object.keys(req.body);
    const isValidUpdate = requestedUpdates.every((update) => allowedUpdates.includes(update));
    if (!isValidUpdate) {
        return res.status(400).send({
            message: "Invalid Update request"
        })
    }
    try {
        const user = await User.findByIdAndUpdate(userId, req.body, {new: true, runValidators: true});
        if (user) {
            return res.send(user)
        }
        res.status(404).send('User not Found')
    } catch (e) {
        res.status(400).send(e)
    }
})

app.post("/tasks", async (req, res) => {
    const task = new Task(req.body);
    try {
        const createdTask = await task.save();
        res.status(201).send(createdTask)
    } catch (e) {
        res.status(400).send(e)
    }
})

app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.status(200).send(tasks)
    } catch (e) {
        res.status(400).send(e)
    }
})

app.get("/tasks/:taskId", async (req, res) => {
    const taskId = req.params.taskId;
    try {
        const task = await Task.findById(taskId);
        if (task) {
            return res.status(200).send(task)
        }
        res.status(404).send({message: "No Task with given id"})
    } catch (e) {
        res.status(400).send(e)
    }
})

app.put("/tasks/:taskId", async (req, res) => {
    const taskId = req.params.taskId;
    const allowedUpdates = ["description","completed"];
    const requestedUpdates = Object.keys(req.body);
    const isValidUpdateRequest = requestedUpdates.every((updateRequest)=>allowedUpdates.includes(updateRequest));
    if(!isValidUpdateRequest){
        return res.status(400).send({
            message:"Invalid Update Request"
        })
    }
    try {
        const task = await Task.findByIdAndUpdate(taskId,req.body,{new:true,runValidators:true});
        if (task) {
            return res.status(200).send(task)
        }
        res.status(404).send({message: "No Task with given id"})
    } catch (e) {
        res.status(400).send(e)
    }
})

app.listen(port, () => {
    console.log("Successfully Running on PORT : ", port)
})