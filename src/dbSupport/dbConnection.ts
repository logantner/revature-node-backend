import { Response } from "express";
import { Pool, QueryResult } from "pg";

const pool = new Pool({
    database: process.env.DB_NAME,
    host: process.env.AWS_POSTGRES,
    user: "postgres",
    password: process.env.DB_PASS,
    port: 5432
});

async function singleQuery(res: Response, qStr: string, qArgs: any[]): Promise<QueryResult<any> | undefined> {
    let client;
    try {
        client = await pool.connect();
        return await pool.query(qStr, qArgs);
    } catch (err) {
        console.log(err);
        res.status(500);
        res.send({'msg': 'Connection to database failed'});
        return;
    } finally {
        client && client.release();
    }
}

export {pool, singleQuery};