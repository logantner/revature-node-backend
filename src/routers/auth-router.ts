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
        // else { res.status(500); }
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
authRouter.get("/status", async (req, res) => {

    if (req.session !== undefined && req.session.user !== undefined) {
        const qres = await singleQuery(res,
            "select * from auth where id = $1",
            [req.session.user]
        );

        if (qres !== undefined && qres.rows.length > 0) {
            res.send({
                'username': req.session.user, 
                'role': qres.rows[0].role_id
            });
        } 
        else {
            res.send({
                'username': req.session.user,
                'msg': 'Warning: Session username is invalid'
            });
        }
        
    } else {
        res.send({
            'username': '',
            'msg': 'Warning: Session data not found'
        })
    }
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
    // Check that username and password fields are included
    if (!(req.body.username && req.body.password)) {
        res.status(400);
        res.send({'msg': 'Must include username and password'});
        return false;
    }
    // Submit query to get auth user row
    const q = await singleQuery(res, 
        "SELECT id, password from auth where id = $1",
        [req.body.username]
    );

    // Exit if there was a syntax/connection issue
    if (q === undefined) {return false;}

    // Check that username was found and password matched
    if (q.rows.length === 0 || q.rows[0].password !== req.body.password) {
        res.status(401);
        res.send({'msg': 'Username or password is incorrect'});
        return false;
    }

    // All checks have passed--user can be authenticated
    return true;
}


export {authRouter, canBeAuthenticated};