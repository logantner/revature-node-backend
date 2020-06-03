import express, { Application, Request, Response } from "express";

const app: Application = express();
const port = process.env.PORT || 8082; // If provided by the environment, grab it

app.get("/", (req: Request, res: Response) => {
    console.log("request made to server");
    res.send("Hello World");
})



app.listen(port, () => {
    console.log("Server started")
});
