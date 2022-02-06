import {Router} from "express";
import {User} from "../model/user";
import bcrypt from 'bcrypt'

export const userRouter = Router();

userRouter.post("/users", async (req, res) => {
    const user = new User(req.body)
    try {
        user.password = await bcrypt.hash(user.password, 8);
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
        if(req.body.password){
            req.body.password = await bcrypt.hash(req.body.password, 8);
        }
        const user = await User.findByIdAndUpdate(userId, req.body, {new: true, runValidators: true});
        if (user) {
            return res.send(user)
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
