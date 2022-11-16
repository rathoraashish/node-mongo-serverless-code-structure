import * as dotenv from "dotenv";
import * as models from "../database/models.js";
import * as db from '../database/index.js';
import CryptoJS from 'crypto-js';

export class UserMgmtDao {
    constructor() {
        dotenv.config();
    }

    /***
     * Add new user
     * 
     */
    async saveUser(userReq) {
        let { first_name = null, last_name = null, email = null, phone_no = null, password = null, username = null } = userReq;
        let result;
        console.log("User requesttt is", userReq);
        try {
            if (password) {
                userReq.password = CryptoJS.SHA512(password, process.env.EncryptionKEY).toString();
            }

            //Change first letter to uppercase
            userReq.first_name = first_name.charAt(0).toUpperCase() + first_name.slice(1).toLowerCase();
            userReq.last_name = last_name.charAt(0).toUpperCase() + last_name.slice(1).toLowerCase();
            userReq.email = email.toLowerCase();

            await models.user
                .create(userReq)
                .then(async (success) => {
                    result = { code: 200, data: success, msg: 'success' }
                })
                .catch(async (error) => {
                    console.log("Mongo ERROR code is", error.code)
                    result = { code: 400, data: null, msg: 'error' }
                });
            return Promise.resolve(result);
        } catch (e) {
            return Promise.reject(e);
        } finally {
            //nothing to do
        }
    }

    /***
    * Login user
    * 
    */
    async loginUser(userReq) {

        let result;
        console.log("User requesttt is", userReq);
        try {
            userReq.password = CryptoJS.SHA512(userReq.password, process.env.EncryptionKEY).toString();

            await models.user
                .findOne({ $or: [{ email: userReq?.email_username }, { username: userReq?.email_username }] })
                .then((user) => {
                    user = user.toObject();
                    if (user && user != null) {
                        if (user?.password == userReq?.password) {
                            delete user.password;
                            console.log("user is", user);
                            result = { code: 200, data: user, msg: 'success' }
                        } else {
                            result = { code: 200, data: null, msg: 'invalid_cred' }
                        }
                    } else {
                        result = { code: 400, data: null, msg: 'not_found' }
                    }
                })
                .catch((error) => {
                    console.log("Mongo ERROR code is", error);
                    result = { code: 400, data: null, msg: 'not_found' }
                });
            return Promise.resolve(result);
        } catch (e) {
            return Promise.reject(e);
        } finally {
            //nothing to do
        }
    }
}
