import { Router, Request, Response, request } from "express";

const authRouter = Router();

const users = {"admin": "pass"};


authRouter.post("/login", (req, res) => {
    console.log(req.body);
    if(canBeAuthenticated(req)) {
        if (req.session) {
            req.session.user = "admin";
        } 
        else {
            res.status(500);
        }
    } 
    else {
        res.status(401);
    }
    res.end();
});

function canBeAuthenticated(req: Request): boolean {
    if (req.body.username === "admin" && req.body.password === "pass") {
        return true;
    }
    return false;
}

authRouter.get("/status", (req, res) => {
    console.log("current session data:");
    console.log(req.session);
    res.end();
});

authRouter.get("/logout", (req, res) => {
    if (req.session) {
        req.session.user = undefined;
    }
    res.end();
});

export default authRouter;