import express, { Application, Request, Response } from "express";
import session from "express-session";
import authRouter from "./routers/auth-router";
import searchRouter from "./routers/search-router";


const app: Application = express();
const port = process.env.PORT || 8082; // If provided by the environment, grab it

app.use(express.json());
app.use(express.urlencoded());
app.use(session({ secret: "mySecret" })); // Encrypt/decrypt cookie data

app.get("/", (req: Request, res: Response) => {
    console.log("request made to server");
    res.send("Hello World");
})

app.use("/auth", authRouter);
app.use("/search", searchRouter);

app.listen(port, () => {
    console.log("Server started")
});

