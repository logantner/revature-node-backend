import { Router, Request, Response, request } from "express";
import { pool, quickQuery } from "../dbSupport/dbConnection"
import { verifyCredentials } from "../services/auth-services"
import "express-session"
import { QueryResult } from "pg";
// import { quickQuery } from "../dbSupport/dbConnection";
// import { QueryResult } from "pg";

const logRouter = Router();

logRouter.get("/", async (req, res) => {
    const userType: number = await verifyCredentials(req.session, res);

    if (userType === -1) {
        return;
    }
    let userName: string = req.session ? req.session.user : "";

    const result: QueryResult<any> | undefined = await quickQuery(pool.query(
        `select fl.log_date, fl.food_id, f.name as food_name, fl.quantity, fl.unit  
        from food_log fl join food f on fl.food_id = f.id 
        where fl.user_id = $1
        order by fl.log_date desc`,
        [userName]
    ));

    if (result === undefined) {
        res.status(500);
        res.send({'msg': 'Food log database connection was unsuccessful'});
        return;
    }

    res.send(result.rows);
});

logRouter.post("/", async (req, res) => {
    res.send();
});



export default logRouter;