import {Router} from "express";
import {Task} from "../model/task";

export const taskRouter = Router();

taskRouter.post("/tasks", async (req, res) => {
    const task = new Task(req.body);
    try {
        const createdTask = await task.save();
        res.status(201).send(createdTask)
    } catch (e) {
        res.status(400).send(e)
    }
})

taskRouter.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.status(200).send(tasks)
    } catch (e) {
        res.status(400).send(e)
    }
})

taskRouter.get("/tasks/:taskId", async (req, res) => {
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

taskRouter.put("/tasks/:taskId", async (req, res) => {
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
        const task = await Task.findByIdAndUpdate(taskId, req.body, {new: true, runValidators: true});
        if (task) {
            return res.status(200).send(task)
        }
        res.status(404).send({message: "No Task with given id"})
    } catch (e) {
        res.status(400).send(e)
    }
})

taskRouter.delete("/tasks/:taskId", async (req, res) => {
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
