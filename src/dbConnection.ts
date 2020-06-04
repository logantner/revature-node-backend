import { Pool } from "pg";

const pool = new Pool({
    database: "nutrition",
    host: "java-react-200526.cdd3r37v89rz.us-east-2.rds.amazonaws.com",
    user: "postgres",
    password: "Boomer744!",
    port: 5432
});

export {pool};