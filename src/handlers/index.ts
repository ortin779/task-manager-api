import {userRouter} from "./users";
import {taskRouter} from "./tasks";
import {authRouter} from "./auth";

export default [
  userRouter,
  taskRouter,
  authRouter
];