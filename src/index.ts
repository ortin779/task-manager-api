import express from "express";
import {connectToDatabase} from "./db/mongo";

const app = express()
const port = process.env.PORT || 3000
connectToDatabase('mongodb://localhost:27017/task-manager-api')

app.use(express.json())

app.post("/users",((req, res) => {
    console.log(req.body)
    res.send("Success")
}))

app.listen(port,()=>{
    console.log("Successfully Running on PORT : ",port)
})