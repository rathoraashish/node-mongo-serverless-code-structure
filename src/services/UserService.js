import db from '../model/index.js';
import { getDefaultResponse } from "../util/helper.js";
import { Codes, CONSTANTS } from "../util/SiteConfig.js";
import * as dotenv from "dotenv";
const Client = db.Client;

export class UserMgmtService {
    constructor() {
        dotenv.config();
    }

    /**
     *add new user 
     */
    async addUser(userReq, event, context) {

        let finalResponse = getDefaultResponse();
        // let loginUser = getAuthorizerUser(event);
        console.log("User request is", userReq);
        try {
            //check validation
            if (!userReq.name || !userReq.age || !userReq.technology) {
                finalResponse.message = CONSTANTS.REQUIRED_FIELDS_ARE_MISSING;
                finalResponse.code = Codes.BAD_REQUEST;
                return Promise.resolve(finalResponse);
            }

            const clientData = new Client({
                name: userReq.name,
                age: userReq.age,
                technology: userReq.technology
            });

            try {
                const data = await clientData.save()
                console.log("saveData::", data);
                finalResponse.code = Codes.OK;
                finalResponse.message = "User saved successfuly";
                return Promise.resolve(finalResponse);

            }
            catch (error) {
                console.log("error")
                finalResponse.code = Codes.BAD_REQUEST;
                finalResponse.message = "Error occured"
                return Promise.resolve(finalResponse);
            }
        } catch (e) {
            console.log("Error in  save user", e);
            return Promise.reject(e);
        }
    }

}