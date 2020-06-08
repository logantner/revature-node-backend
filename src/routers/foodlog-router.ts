import { Router, Request, Response, request } from "express";
// import { pool, quickQuery } from "../dbSupport/dbConnection"
import { verifyCredentials } from "../services/auth-services"
import "express-session"
// import { QueryResult } from "pg";

const logRouter = Router();

logRouter.get("/", async (req, res) => {
    const userType: number = await verifyCredentials(req.session, res);

    if (userType === -1) {
        return;
    }

    

    res.send();
});

logRouter.post("/", async (req, res) => {
    res.send();
});



export default logRouter;