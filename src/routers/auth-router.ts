import { Router, Request, Response, request } from "express";
import { Pool, Client } from "pg";

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
    const pool = new Pool({
        database: "postgres",
        host: "java-react-200526.cdd3r37v89rz.us-east-2.rds.amazonaws.com",
        user: "postgres",
        password: "Boomer744!",
        port: 5432
    });

    pool.connect(err => {
        if (err) { console.error('connection error:', err.stack) }
    });

    const res = await pool.query(
        `SELECT username, pass from nutrition_auth where username='${req.body.username}';`
    );

    let isValid: boolean;
    if (res.rows.length > 0 && res.rows[0].pass === req.body.password) {
        isValid = true;
    } else {
        isValid = false;
    }

    pool.end();
    return isValid;
    
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