import {Router} from "express";
import {User} from "../model/user";
import {authentication} from "../middleware/authentication";
import {RequestWithUser} from "../model/customRequest";

export const userRouter = Router();

userRouter.post("/users", async (req, res) => {
    const user = new User(req.body)
    try {
        const savedUser = await user.save();
        const token = await user.generateJwtToken();
        res.status(201).send({user:savedUser,token:token});
    } catch (e) {
        res.status(400).send(e)
    }
})

userRouter.get("/users/me",authentication, async (req:RequestWithUser, res) => {
    try {
        const user = req.user;
        res.status(200).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

userRouter.put("/users/me",authentication, async (req:RequestWithUser, res) => {
    const allowedUpdates = ["name", "age", "password", "email"];
    const requestedUpdates = Object.keys(req.body);
    const isValidUpdate = requestedUpdates.every((update) => allowedUpdates.includes(update));
    if (!isValidUpdate) {
        return res.status(400).send({
            message: "Invalid Update request"
        })
    }
    try {
        const user = req.user;
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

userRouter.delete("/users/me",authentication, async (req:RequestWithUser, res) => {
    try {
        const deletedUser = req.user;
        await req.user?.remove();
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

userRouter.post("/users/login", async (req, res) => {
    try {
        const user = await User.findUserByCredentials(req.body.email,req.body.password);
        res.status(200).send({user,token:user.tokens[user.tokens.length-1]})
    } catch (e) {
        res.status(400).send("Login failed")
    }

})

userRouter.post("/users/logout",authentication, async (req:RequestWithUser, res) => {
    try {
        const token = req.header("Authorization")!.replace("Bearer","");
        const user = req.user;
        const index = user?.tokens.indexOf({token});
        user?.tokens.splice(index!,1);
        await user!.save();
        res.status(200).send({user});
    } catch (e) {
        res.status(400).send("Login failed")
    }
})

userRouter.post("/users/logout-all",authentication, async (req:RequestWithUser, res) => {
    try {
        req.user!.tokens = [];
        await req.user?.save();
        res.status(200).send(req.user);
    } catch (e) {
        res.status(400).send("Login failed")
    }
})


