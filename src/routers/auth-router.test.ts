import httpMocks from "node-mocks-http";
import { Router, Request, Response, request } from "express";
import { canBeAuthenticated } from "./auth-router";


// async function baseQuery(q: string) {
//     let client;
//     try {
//         console.log(pool);
//         client = await pool.connect();
//         let newq = await pool.query(q);
//         console.log(newq);
//         return newq;
//     } catch (err) {
//         console.log(err);
//         return;
//     } finally {
//         client && client.release();
//     }
// }



  

test('Login: body is missing field', () => {
    const req = httpMocks.createRequest({
        body: {"username": "sample1"}
    });
    const res = httpMocks.createResponse();
    return expect(canBeAuthenticated(req, res)).resolves.toBeFalsy();
});

jest.mock("../dbSupport/dbConnection", () => {
    return {
        singleQuery: (res: Response, qStr: string, qArgs: any[]) => {
            return {
                rows: [{
                    username: 'sample1',
                    password: 'password'
                }]
            };
        }
    };
});

test('Login: success', async () => {
    

    const req = httpMocks.createRequest({
        body: {"username": "sample1", "password": "password"}
    });
    const res = httpMocks.createResponse();
    const actual = await canBeAuthenticated(req, res);
    return expect(actual).toBeTruthy();
});


