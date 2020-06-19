import { Router, Request, Response } from "express";
import { singleQuery } from "../dbSupport/dbConnection"
import { searchNames, dbCategories } from '../dbSupport/searchSupport'

const searchRouter = Router();

searchRouter.get("/units", async (req, res) => {
    const searchResult = await singleQuery(res, "select * from food_unit", []);
    if (searchResult === undefined) {return;}
    res.send(searchResult.rows);
});

searchRouter.get("/", async (req, res) => {
    let insertVals: string[] = [];
    const resData: any = {};
    let queryString: string = await buildQueryString(req, insertVals, resData);

    if (queryString !== ''){
        const searchResult = await singleQuery(res, queryString, insertVals);
        if (searchResult === undefined) {return;}

        resData['result'] = searchResult.rows;
    } else {
        res.status(400);
    }

    res.send(resData);
});

async function buildQueryString(req: any, insertVals: string[], resData: any): Promise<string> {
    let queryString: string = `select * from food`;

    // Check for and validate food category specification
    const userCat: string = req.query.cat;
    if (userCat) {
        if ( ! dbCategories.includes(userCat) ) {
            resData['msg'] = 'Request not processed--invalid category. Please consult documentation for supported categories.'
            return '';
        }
        insertVals.push(userCat);
        queryString += ` where category = $${insertVals.length}`;
    }

    // Check for and validate sort by specification
    if (req.query.sortby) {
        const sortby = req.query.sortby.toString();
        let parsedSortby: string | undefined = searchNames[sortby];
        if (parsedSortby === undefined) {
            resData['msg'] = 'Warning: Sort keyword not supported. Please consult documentation for supported sorting keywords.'
        } else {
            queryString += ` order by ${parsedSortby} desc`;
        }
    }

    // Check for and validate row limit specification
    const userLimit: string | undefined = req.query.limit;
    if (userLimit) {
        if (!isPositiveInt(userLimit)) {
            resData['msg'] = 'Request not processed. Limiting value must be a valid positive integer'
            return '';
        }
        insertVals.push(userLimit);
        queryString += ` limit $${insertVals.length}`;
    }

    return queryString;
}

function isPositiveInt(str: string): boolean {
    const val: number = Number(str);
    if (isNaN(val)) { return false; }
    const roundedVal: number = Math.floor(val)
    return (
        roundedVal !== Infinity && 
        String(roundedVal) === str && 
        roundedVal > 0
    );
}

export default searchRouter;