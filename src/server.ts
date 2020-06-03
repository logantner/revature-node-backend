import express, { Application, Request, Response } from "express";
import session from "express-session";

import authRouter from "./routers/auth-router";

const app: Application = express();
const port = process.env.PORT || 8082; // If provided by the environment, grab it

app.get("/", (req: Request, res: Response) => {
    console.log("request made to server");
    res.send("Hello World");
})

app.use(express.json());
app.use(express.urlencoded());
app.use(session({ secret: "mySecret" })); // Encrypt/decrypt cookie data
app.use("/auth", authRouter);

app.listen(port, () => {
    console.log("Server started")
});
