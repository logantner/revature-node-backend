import express, { Application, Request, Response } from "express";
import session from "express-session";
import {authRouter} from "./routers/auth-router";
import searchRouter from "./routers/search-router";
import logRouter from "./routers/foodlog-router";
import {verifyCookieCredentials} from "./middleware/auth-middleware";

import cors from "cors"


declare global {
    namespace Express {
        interface Request {
            userType?: number
        }
    }
}

const app: Application = express();
const port = process.env.PORT || 8084;

// console.log(process.env);
app.use(cors());

app.use(express.json());
app.use(express.urlencoded());
app.use(session({ secret: "mySecret" }));

app.use("/auth", authRouter);
app.use("/search", searchRouter);

app.use(verifyCookieCredentials);

app.use("/log", logRouter);

app.listen(port, () => {
    console.log("Server started")
});

