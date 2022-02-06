import {Router} from "express";
import {User} from "../model/user";

export const userRouter = Router();

userRouter.post("/users", async (req, res) => {
    const user = new User(req.body)
    try {
        const savedUser = await user.save();
        res.status(201).send(savedUser);
    } catch (e) {
        res.status(400).send(e)
    }
})

userRouter.get("/users", async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send(users)
    } catch (e) {
        res.status(400).send(e)
    }
})

userRouter.get("/users/:id", async (req, res) => {
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

userRouter.put("/users/:id", async (req, res) => {
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
        const user = await User.findById(userId);
        if (user) {
            requestedUpdates.forEach((update) => user[update] = req.body[update])
            const savedUser = await user.save()
            return res.send(savedUser)
        }
        res.status(404).send('User not Found')
    } catch (e) {
        res.status(400).send(e)
    }
})

userRouter.delete("/users/:id", async (req, res) => {
    const userId = req.params.id;
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (deletedUser) {
            return res.send({
                message: "Deleted user Successfully",
                user: deletedUser
            })
        }
        res.status(404).send({message: "User not Found"})
    } catch (e) {
        res.status(400).send(e)
    }
})
