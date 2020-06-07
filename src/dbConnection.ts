import { Pool } from "pg";
import { QueryResult } from "pg";

const pool = new Pool({
    database: "nutrition",
    host: "java-react-200526.cdd3r37v89rz.us-east-2.rds.amazonaws.com",
    user: "postgres",
    password: "Boomer744!",
    port: 5432
});

async function quickQuery(myQuery: Promise<QueryResult<any>>): Promise<QueryResult<any> | undefined> {
    let client;
    try {
        client = await pool.connect();
        return await myQuery;
    } catch (err) {
        console.log(err);
        return;
    } finally {
        client && client.release();
    }
}

export {pool, quickQuery};