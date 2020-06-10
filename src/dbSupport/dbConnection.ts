import { Response } from "express";
import { Pool, QueryResult } from "pg";

const pool = new Pool({
    // database: "nutrition",
    database: process.env.DB_NAME,
    // host: "java-react-200526.cdd3r37v89rz.us-east-2.rds.amazonaws.com",
    host: process.env.AWS_POSTGRES,
    user: "postgres",
    // password: "Boomer744!",
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