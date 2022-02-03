import express from "express";

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post("/users",((req, res) => {
    console.log(req.body)
    res.send("Success")
}))

app.listen(port,()=>{
    console.log("Successfully Running on PORT : ",port)
})