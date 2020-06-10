import { Router, Request, Response, request } from "express";
import { pool, singleQuery } from "../dbSupport/dbConnection"
import { verifyCookieCredentials, verifyIsAdmin, verifyUserInDB } from "../middleware/auth-middleware";

const authRouter = Router();

/////////////////////
// logging in user //
/////////////////////
authRouter.post("/login", async (req, res) => {
    if(await canBeAuthenticated(req, res)) {
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
    if (req.body.username === undefined || req.body.password === undefined) {
        res.status(400);
        res.send({'msg': 'Missing username or password fields'});
        return;
    }

    let selectQuery = await singleQuery(res,
        "select id from auth where id = $1",
        [req.body.username]
    );

    if (selectQuery !== undefined && selectQuery.rows.length > 0) {
        res.status(409);
        res.send({'msg': 'Username already exists'});
    }

    else {
        singleQuery(res,
            "insert into auth values ($1, $2, 2)",
            [req.body.username, req.body.password]
        );
        res.status(201);
        res.send({'msg': 'Account has been registered successfully'})
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

/////////////////
// delete user //
/////////////////
authRouter.delete("/delete", [verifyCookieCredentials, verifyIsAdmin, verifyUserInDB], async (req:Request, res:Response) => {
    await singleQuery(res,
        "delete from auth where id = $1",
        [req.body.user]
    );

    res.status(202);
    res.send({'msg': 'User account and logs have been deleted'});
})

///////////////////////////
// promote user to admin //
///////////////////////////
authRouter.post("/promote", [verifyCookieCredentials, verifyIsAdmin, verifyUserInDB], async (req:Request, res:Response) => {
    const alterQuery = await singleQuery(res,
        "update auth set role_id = 1 where id = $1",
        [req.body.user]
    );

    if (alterQuery !== undefined){    
        res.status(200)
        res.send({'msg': 'User has been promoted to admin'});
    }
})


async function canBeAuthenticated(req: Request, res:Response): Promise<boolean> {
    if (!(req.body.username && req.body.password)) {
        return false;
    }

    // const q = await pool.query(
    //     "SELECT id, password from auth where id = $1",
    //     [req.body.username]
    // );

    const q = await singleQuery(res, 
        "SELECT id, password from auth where id = $1",
        [req.body.username]
    );
    // console.log(q);
    return true;
    // if (q === undefined) {return false;}

    // return q.rows.length > 0 && q.rows[0].password === req.body.password ? true : false;  
}


export {authRouter, canBeAuthenticated};