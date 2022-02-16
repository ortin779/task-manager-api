import express from "express";
import {connectToDatabase} from "./db/mongo";
import routes from "./handlers/index";

const app = express();
const port = process.env.PORT || 3000;
connectToDatabase("mongodb://localhost:27017/task-manager-api");

app.use(express.json());
app.use(routes);

app.listen(port, () => {
  console.log("Successfully Running on PORT : ", port);
});