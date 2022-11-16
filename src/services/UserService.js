import { getDefaultResponse, isValidString } from "../util/helper.js";
import { UserMgmtDao } from "../daos/UserMgmtDao.js";
import { Codes, CONSTANTS } from "../util/SiteConfig.js";
import * as dotenv from "dotenv";
import jwt from 'jsonwebtoken';

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
        // console.log("User request is", userReq);
        try {
            //check validation
            if (!userReq.first_name || !userReq.last_name || !userReq.email || !isValidString(userReq.email) || !userReq.password || !isValidString(userReq.password) || !userReq.username) {
                finalResponse.message = CONSTANTS.REQUIRED_FIELDS_ARE_MISSING;
                finalResponse.code = Codes.BAD_REQUEST;
                return Promise.resolve(finalResponse);
            }

            let result = await new UserMgmtDao().saveUser(userReq);
            console.log("REsult from DAo is", result);

            if (result && result.code == 200 && result.msg == 'success') {
                finalResponse.data = result.data;
            } else {
                finalResponse.message = CONSTANTS.SOMETHING_WENT_WRONG;
                finalResponse.code = Codes.BAD_REQUEST;
            }
            return Promise.resolve(finalResponse);
        } catch (e) {
            console.log("Error in  save user", e);
            return Promise.reject(e);
        }
    }

    /** 
     * Login user
    */
    async loginUser(userReq, event, context) {

        let finalResponse = getDefaultResponse();
        // let loginUser = getAuthorizerUser(event);
        // console.log("User request is", userReq);
        try {
            //check validation
            if (!userReq.email_username || !userReq.password) {
                finalResponse.message = CONSTANTS.REQUIRED_FIELDS_ARE_MISSING;
                finalResponse.code = Codes.BAD_REQUEST;
                return Promise.resolve(finalResponse);
            }

            let result = await new UserMgmtDao().loginUser(userReq);
            // console.log("REsult from DAo is", result);

            if (result && result.code == 200 && result.msg == 'success') {
                let tokenData = { 'id': result.data._id, 'email': result.data.email }
                console.log("Token Data", tokenData);
                let token = jwt.sign({
                    data: tokenData
                }, process.env.EncryptionKEY);

                let userData = result.data;
                console.log("USER DATA",userData);
                userData.auth_token = token;

                finalResponse.data = {"userData":userData}
            } else if(result && result.code == 200 && result.msg == 'invalid_cred') {
                finalResponse.message = CONSTANTS.INCORRECT_EMAIL_PASSWORD;
                finalResponse.code = Codes.UNAUTHORIZED;
            } else {
                finalResponse.message = CONSTANTS.USER_NOT_FOUND;
                finalResponse.code = Codes.NOT_FOUND;
            }

            return Promise.resolve(finalResponse);
        } catch (e) {
            console.log("Error in  save user", e);
            return Promise.reject(e);
        }
    }

}