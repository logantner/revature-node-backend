import express, { Application, Request, Response } from "express";
import session from "express-session";
import {authRouter} from "./routers/auth-router";
import searchRouter from "./routers/search-router";
import logRouter from "./routers/foodlog-router";
import {verifyCookieCredentials} from "./middleware/auth-middleware";

// import cors from "cors";

declare global {
    namespace Express {
        interface Request {
            userType?: number
        }
    }
}

const app: Application = express();
const port = process.env.PORT || 8083;

app.use(express.json());
app.use(express.urlencoded());
app.use(session({ 
    secret: "mySecret",
    cookie: {
        sameSite: 'none'
    }
}));

// app.use(cors({
//     credentials: true,
//     origin: "http://localhost:3000'"
// }));

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', "true");
    // Pass to next layer of middleware
    next();
});


app.use("/auth", authRouter);
app.use("/search", searchRouter);

app.use(verifyCookieCredentials);

app.use("/log", logRouter);

app.listen(port, () => {
    console.log("Server started")
});

