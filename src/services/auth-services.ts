import { Router, Request, Response, request } from "express";
import "express-session"
import { QueryResult } from "pg";
import { pool, quickQuery } from "../dbSupport/dbConnection"

async function verifyCredentials(cookie: Express.Session | undefined, res: Response): Promise<number> {
    if (cookie === undefined || cookie.user === undefined || cookie.password === undefined) {
        res.status(401);
        res.json({'msg': 'Authentication failed: please log in to perform this request'});
        return -1;
    }

    let authQueryResult: QueryResult<any> | undefined = await quickQuery(pool.query(
        "select * from auth where auth.id = $1",
        [cookie.user]
    ));

    if (authQueryResult === undefined) {
        res.status(500);
        res.send({'msg': 'Authorizationn database connection was unsuccessful'});
        return -1;
    }

    let rows: any[] = authQueryResult.rows;
    if (rows.length === 0 || rows[0].password !== cookie.password) {
        res.status(401);
        res.send({'msg': 'Session data could not be verified. Please try logging in again.'});
        return -1;
    }

    return rows[0].role_id;
}

export {verifyCredentials}