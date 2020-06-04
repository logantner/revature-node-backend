import { Router, Request, Response, request } from "express";
import { pool } from "../dbConnection"

const authRouter = Router();

authRouter.post("/login", async (req, res) => {
    if(await canBeAuthenticated(req)) {
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

async function canBeAuthenticated(req: Request): Promise<boolean> {
    let client;
    try {
        client = await pool.connect();
        const res = await pool.query(
            "SELECT id, password from auth where id = $1",
            [req.body.username]
        );
        return res.rows.length > 0 && res.rows[0].password === req.body.password ? true : false;
    } catch (err) {
        console.log(err);
        return false;
    } finally {
        client && client.release()
    }    
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