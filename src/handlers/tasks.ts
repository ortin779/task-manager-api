import {Router} from "express";
import {Task} from "../model/task";
import {authentication} from "../middleware/authentication";

export const taskRouter = Router();

taskRouter.post("/tasks", authentication, async (req, res) => {
    const task = new Task({...req.body, author: req.user!._id});
    try {
        const createdTask = await task.save();
        res.status(201).send(createdTask)
    } catch (e) {
        res.status(400).send(e)
    }
})

taskRouter.get("/tasks", authentication, async (req, res) => {
    try {
        const tasks = await Task.find({author: req.user!._id});
        res.status(200).send(tasks)
    } catch (e) {
        res.status(400).send(e)
    }
})

taskRouter.get("/tasks/:taskId", authentication, async (req, res) => {
    const taskId = req.params.taskId;
    try {
        const task = await Task.findOne({_id: taskId, author: req.user!._id});
        if (task) {
            return res.status(200).send(task)
        }
        res.status(404).send({message: "No Task with given id"})
    } catch (e) {
        res.status(400).send(e)
    }
})

taskRouter.put("/tasks/:taskId", authentication, async (req, res) => {
    const taskId = req.params.taskId;
    const allowedUpdates = ["description", "completed"];
    const requestedUpdates = Object.keys(req.body);
    const isValidUpdateRequest = requestedUpdates.every((updateRequest) => allowedUpdates.includes(updateRequest));
    if (!isValidUpdateRequest) {
        return res.status(400).send({
            message: "Invalid Update Request"
        })
    }
    try {
        const task = await Task.findOne({_id: taskId, author: req.user!._id});
        if (task) {
            requestedUpdates.forEach((update) => task[update] = req.body[update]);
            await task.save();
            return res.status(200).send(task)
        }
        res.status(404).send({message: "No Task with given id"})
    } catch (e) {
        res.status(400).send(e)
    }
})

taskRouter.delete("/tasks/:taskId", authentication, async (req, res) => {
    const taskId = req.params.taskId;
    try {
        const deletedTask = await Task.findByIdAndDelete(taskId);
        if (deletedTask) {
            return res.status(200).send({
                message: "Deleted the task successfully",
                task: deletedTask
            })
        }
        res.status(400).send({
            message: "No task to delete, with the given ID"
        })
    } catch (e) {
        res.status(400).send(e)
    }
})
