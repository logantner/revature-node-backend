import { Router, Request, Response } from "express";
import "express-session"
import { QueryResult } from "pg";
import { pool, quickQuery } from "../dbSupport/dbConnection"
// import { runInNewContext } from "vm";

async function verifyCookieCredentials(req: Request, res: Response, next:Function ) {
    const cookie: Express.Session | undefined = req.session;
    if (cookie === undefined || cookie.user === undefined || cookie.password === undefined) {
        res.status(401);
        res.send({'msg': 'Authentication failed: please log in to perform this request'});
        return;
    }

    let authQueryResult: QueryResult<any> | undefined = await quickQuery(pool.query(
        "select * from auth where auth.id = $1",
        [cookie.user]
    ));

    if (authQueryResult === undefined) {
        res.status(500);
        res.send({'msg': 'Connection to authorization database was unsuccessful'});
        return;
    }

    let rows: any[] = authQueryResult.rows;
    if (rows.length === 0 || rows[0].password !== cookie.password) {
        res.status(401);
        res.send({'msg': 'Session data could not be verified. Please try logging in again.'});
        return;
    }

    req.userType = rows[0].role_id;
    next();
}

async function verifyAdmin(req: Request, res: Response, next:Function ) {
    const userType: number = req.userType || -1;

    if (userType !== 1) {
        res.status(403);
        res.send({'msg': 'Only administrators may perform this request'});
        return;
    }

    next();
}

export {verifyCookieCredentials, verifyAdmin}