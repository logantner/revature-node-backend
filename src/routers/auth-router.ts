import { Router, Request, Response, request } from "express";
import { pool, quickQuery } from "../dbSupport/dbConnection"
import { QueryResult } from "pg";
import { verifyCookieCredentials, verifyAdmin } from "../middleware/auth-middleware";

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

/////////////////
// delete user //
/////////////////
authRouter.delete("/", [verifyCookieCredentials, verifyAdmin], async (req:Request, res:Response) => {
    if (await isValidUser(req, res)) {
        const q: QueryResult<any> | undefined = await quickQuery(pool.query(
            "delete from auth where id = $1",
            [req.body.user]
        ));

        if (q === undefined) {
            res.status(500);
            res.send({'msg': 'Request is valid but connection to database failed'});
            return;
        }

        res.sendStatus(204);
    }

    res.end();
})

///////////////////////////
// promote user to admin //
///////////////////////////
authRouter.patch("/promote/:username", [verifyCookieCredentials, verifyAdmin], async (req:Request, res:Response) => {
    const userName: string = req.params.username;
    const userQuery = await quickQuery(pool.query(
        "select * from auth where id = $1",
        [userName]
    ))

    if (userQuery === undefined) {
        res.status(500);
        res.send({'msg': 'Connection to authorization database was unsuccessful'});
        return;
    }

    if (userQuery.rows.length === 0) {
        res.status(404);
        res.send({'msg': 'User cannot be found'})
        return false;
    }

    const role: number = userQuery.rows[0].role_id;
    if (role === 1) {
        res.status(409);
        res.send({'msg': 'Admin cannot be promoted any further'})
        return false;
    }

    const alterQuery = await quickQuery(pool.query(
        "update auth set role_id = 1 where id = $1",
        [userName]
    ));

    if (alterQuery === undefined) {
        res.status(500);
        res.send({'msg': 'Connection to authorization database was unsuccessful'});
        return;
    }

    res.status(200)
    res.send({'msg': 'User has been promoted to admin'});
})


async function isValidUser(req:Request, res:Response) : Promise<boolean> {

    if (req.body.user === undefined) {
        res.status(400);
        res.send({'msg': 'Body is missing user field'})
        return false;
    }

    const q = await quickQuery(pool.query(
        "select id, role_id from auth", []
    ));

    if (q === undefined) {
        res.status(500);
        res.send({'msg': 'Connection to authorization database was unsuccessful'});
        return false;
    }

    const matchingRecord = q.rows.filter(row => row.id === req.body.user);
    if (matchingRecord.length === 0) {
        res.status(404);
        res.send({'msg': 'User cannot be found'})
        return false;
    } 
    if (matchingRecord[0].role_id === 1) {
        res.status(403);
        res.send({'msg': 'Administrators cannot be deleted at this level'})
        return false;
    }

    return true;
}

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