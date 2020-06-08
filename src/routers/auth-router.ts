import { Router, Request, Response, request } from "express";
import { pool, quickQuery } from "../dbSupport/dbConnection"

const authRouter = Router();

/////////////////////
// logging in user //
/////////////////////
authRouter.post("/login", async (req, res) => {
    if(await canBeAuthenticated(req)) {
        if (req.session) { 
            req.session.user = req.body.username; 
            req.session.password = req.body.password; 
        } 
        else { res.status(500); }
    } 
    else { res.status(401); }
    res.end();
});

///////////////////////
// register new user //
///////////////////////
authRouter.post("/register", async (req, res) => {
    if (!(req.body.username && req.body.password)) {
        res.sendStatus(400);
        return;
    }

    let result = await quickQuery(pool.query(
        "select id from auth where id = $1",
        [req.body.username]
    ));

    if (result === undefined) {
        res.sendStatus(400);
        return;
    } 
    else if (result && result.rows.length > 0) {
        res.status(409);
    }
    // else if () {
    // PW rules
    // }
    else {
        quickQuery(pool.query(
            "insert into auth values ($1, $2, 2)",
            [req.body.username, req.body.password]
        ))
        res.status(201);
    }
    res.end();
});


////////////////////////
// check login status //
////////////////////////
authRouter.get("/status", (req, res) => {
    console.log("current session data:");
    console.log(req.session);
    res.end();
});


/////////////////
// logout user //
/////////////////
authRouter.get("/logout", (req, res) => {
    if (req.session) {
        req.session.user = undefined;
    }
    res.end();
});

async function canBeAuthenticated(req: Request): Promise<boolean> {
    if (!(req.body.username && req.body.password)) {
        return false;
    }

    const res = await pool.query(
        "SELECT id, password from auth where id = $1",
        [req.body.username]
    );

    return res.rows.length > 0 && res.rows[0].password === req.body.password ? true : false;  
}


export default authRouter;