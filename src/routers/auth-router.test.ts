// import httpMocks from "node-mocks-http";
// // import { Pool, QueryResult } from "pg";
// import { Router, Request, Response, request } from "express";
// import { pool, singleQuery } from "../dbSupport/dbConnection"
// import { verifyCookieCredentials, verifyIsAdmin, verifyUserInDB } from "../middleware/auth-middleware";
// import { canBeAuthenticated } from "./auth-router";

// console.log(process.env.DB_NAME);

// async function baseQuery(q: string) {
    
//     let client;
//     try {
//         console.log('aksjhd')
//         client = await pool.connect();
//         let newq = pool.query(q);
//         console.log(newq);
//         return newq;
//     } catch (err) {
//         console.log(err);
//         return;
//     } finally {
//         client && client.release();
//     }
// }

// jest.mock("../dbSupport/dbConnection", () => {
//     return {
//         singleQuery: async (res: Response, qStr: string, qArgs: any[]) => {
//             // return baseQuery("select id, password from auth where id = sample1");
//             return await baseQuery("select * from auth");
//     }};
// });
  

// test('Login: body is missing field', () => {
//     const req = httpMocks.createRequest({
//         body: {"username": "sample1"}
//     });
//     const res = httpMocks.createResponse();
//     return expect(canBeAuthenticated(req, res)).resolves.toBeFalsy();
// });

// test('Login: success', () => {
//     const req = httpMocks.createRequest({
//         body: {"username": "sample1", "password": "password"}
//     });
//     const res = httpMocks.createResponse();
//     return expect(canBeAuthenticated(req, res)).resolves.toBeTruthy();
// });


