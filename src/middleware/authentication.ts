import {NextFunction, Response} from "express";
import jwt from "jsonwebtoken";
import {User} from "../model/user";
import {RequestWithUser} from "../model/customRequest";

export const authentication = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const bearer_token = req.header("Authorization");
        const jwt_token = bearer_token?.substr(7);
        const is_valid_token = jwt_token && jwt.verify(jwt_token, 'salt')
        const payload = is_valid_token && jwt.decode(jwt_token, {json: true});
        const user = payload && await User.findOne({_id: payload._id,"tokens.token":jwt_token});
        if (!user) {
            throw new Error("Invalid Token")
        }
        req.user = user;
        next()
    } catch (e) {
        res.status(401).send({error: "Authentication Failed"})
    }
}