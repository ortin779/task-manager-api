import {IUser} from "../../src/model/user";

declare global{
    namespace Express{
        interface Request{
            user:IUser
        }
    }
}