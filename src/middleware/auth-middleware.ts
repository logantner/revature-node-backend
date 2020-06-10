import { Router, Request, Response } from "express";
import "express-session"
import { QueryResult } from "pg";
import { singleQuery } from "../dbSupport/dbConnection"
// import { runInNewContext } from "vm";

async function verifyCookieCredentials(req: Request, res: Response, next:Function ) {
    const cookie: Express.Session | undefined = req.session;
    if (cookie === undefined || cookie.user === undefined || cookie.password === undefined) {
        res.status(401);
        res.send({'msg': 'Authentication failed: please log in to perform this request'});
        return;
    }

    const authQuery: QueryResult<any> | undefined = await singleQuery(res,
        "select * from auth where auth.id = $1",
        [cookie.user]
    );
    if (authQuery === undefined) { return; }

    let rows: any[] = authQuery.rows;
    if (rows.length === 0 || rows[0].password !== cookie.password) {
        res.status(401);
        res.send({'msg': 'Session data could not be verified. Please try logging in again.'});
        return;
    }

    req.userType = rows[0].role_id;
    next();
}

async function verifyIsAdmin(req: Request, res: Response, next:Function ) {
    const userType: number = req.userType || -1;

    if (userType !== 1) {
        res.status(403);
        res.send({'msg': 'Only administrators may perform this request'});
        return;
    }

    next();
}

async function verifyUserInDB(req: Request, res: Response, next:Function ) {
    const userName: string = req.body.user;

    const userQuery = await singleQuery(res,
        "select * from auth where id = $1",
        [userName]
    );
    if (userQuery === undefined) { return; }

    if (userQuery.rows.length === 0) {
        res.status(404);
        res.send({'msg': 'User cannot be found'})
        return;
    }

    const role: number = userQuery.rows[0].role_id;
    if (role === 1) {
        res.status(409);
        res.send({'msg': 'Username corresponds to admin'})
        return;
    }

    next();
}

export {verifyCookieCredentials, verifyIsAdmin, verifyUserInDB}