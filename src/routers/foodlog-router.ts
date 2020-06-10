import { Router, Request, Response, request, response } from "express";
import { singleQuery } from "../dbSupport/dbConnection"
import "express-session"
import { QueryResult } from "pg";
import moment from 'moment';
import { dbUnits } from "../dbSupport/searchSupport";


const logRouter = Router();

logRouter.get("/", async (req, res) => {
    let userName: string = req.session ? req.session.user : "";

    const result: QueryResult<any> | undefined = await singleQuery(res,
        `select fl.log_date, fl.food_id, f.name as food_name, fl.quantity, fl.unit  
        from food_log fl join food f on fl.food_id = f.id 
        where fl.user_id = $1
        order by fl.log_date desc`,
        [userName]
    );

    if (result !== undefined) {
        res.send(result.rows);
    }
    
});

logRouter.put("/", async (req, res) => {
    if (
        allFieldsIncluded(req, res) &&
        isValidDate(req, res) &&
        (await isValidFoodID(req, res)) &&
        isValidQuantity(req, res) &&
        isValidUnit(req, res)
    ) {
        const user: string = req.session ? req.session.user : "";
        const alterQuery = await singleQuery(res,
            `insert into food_log (user_id, log_date, food_id, quantity, unit) 
            values ($1, $2, $3, $4, $5)`,
            [user, req.body.date, req.body.food_id, req.body.quantity, req.body.unit]
        );
        
        if (alterQuery !== undefined) {
            res.status(201);
            res.send({'msg': 'New log has been archived'});
        }
    }
    

    res.send();
});

function allFieldsIncluded(req: Request, res: Response): boolean {
    if( req.body.date === undefined || 
        req.body.food_id === undefined || 
        req.body.quantity === undefined || 
        req.body.unit === undefined
    ) {
        res.status(401);
        res.send({'msg': "You must include a date, food_id, quantity and unit for this request"});
        return false;
    }
    return true;
}

function isValidDate(req: Request, res: Response): boolean {
    let date: moment.Moment = moment(req.body.date, "M/D/YYYY", true);
    if (!date.isValid() || date.isAfter(moment.now())) {
        res.status(401);
        res.send({'msg': `Date must be provided in the format MM/DD/YYYY and cannot be in the future`});
        return false;
    }
    else {
        return true;
    }
}

async function isValidFoodID(req: Request, res: Response): Promise<boolean> {
    const foodQuery = await singleQuery(res, "select id from food", []);
    if (foodQuery === undefined) { return false; }

    const foodIDs: number[] = foodQuery.rows.map((val) => {return parseInt(val.id)});
    const foodID: number = parseInt(req.body.food_id);

    if (!foodIDs.includes(foodID)) {
        res.status(401);
        res.send({'msg': 'food_id parameter is invalid. Consult the food database for valid IDs'});
        return false;
    }

    return true;
}

function isValidQuantity(req: Request, res: Response): boolean {
    if (isNaN(req.body.quantity) || Number(req.body.quantity) <= 0) {
        res.status(401);
        res.send({'msg': `The parameter 'quantity' must be a positive numerical value`});
        return false;
    }
    return true;
}

function isValidUnit(req: Request, res: Response): boolean {
    if (!dbUnits.includes(req.body.unit)) {
        res.status(401);
        res.send({'msg': `The value for parameter 'unit' is not supported. Please consult documentation for valid unit codes`});
        return false;
    }
    return true;
}


export default logRouter;