import { to, renderResponse, parseBody } from '../util/helper.js';
import { UserMgmtService } from '../services/UserService.js';
import { AuthService } from '../services/AuthService.js';

/**signup user */
const userAuthCheck = (event, context, callback) => {
  (async () => {
    new AuthService().userAuthCheck(event, context, callback);
  })();
}

/**signup user */
const addUser = (event, context, callback) => {
  (async () => {
    let [err, response] = await to(new UserMgmtService().addUser(parseBody(event), event, context));
    renderResponse(err, response, callback);
  })();
}

/**Login user */
const userLogin = (event, context, callback) => {
  (async () => {
    let [err, response] = await to(new UserMgmtService().loginUser(parseBody(event), event, context));
    renderResponse(err, response, callback);
  })();
}

/**Login user */
const getUser = (event, context, callback) => {
  (async () => {
    let [err, response] = await to(new UserMgmtService().getUser(parseBody(event), event, context));
    renderResponse(err, response, callback);
  })();
}

export { addUser,userLogin,getUser,userAuthCheck }