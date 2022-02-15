import {Router} from "express";
import {authentication} from "../middleware/authentication";
import {User} from "../model/user";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
    try {
        const user = await User.findUserByCredentials(req.body.email, req.body.password);
        res.status(200).send({user, token: user.tokens[user.tokens.length - 1]})
    } catch (e) {
        res.status(400).send("Login failed")
    }

})



authRouter.post("/logout", authentication, async (req, res) => {
    try {
        const token = req.header("Authorization")!.replace("Bearer", "");
        const user = req.user;
        const index = user?.tokens.indexOf({token});
        user?.tokens.splice(index!, 1);
        await user!.save();
        res.status(200).send({user});
    } catch (e) {
        res.status(400).send("Login failed")
    }
})

authRouter.post("/logout-all", authentication, async (req, res) => {
    try {
        req.user!.tokens = [];
        await req.user?.save();
        res.status(200).send(req.user);
    } catch (e) {
        res.status(400).send("Login failed")
    }
})
