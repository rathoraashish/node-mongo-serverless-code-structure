import { to, renderResponse, parseBody } from '../util/helper.js';
import { UserMgmtService } from '../services/UserService.js';

/**signup user */
const addUser = (event, context, callback) => {
  (async () => {
    let [err, response] = await to(new UserMgmtService().addUser(parseBody(event), event, context));
    renderResponse(err, response, callback);
  })();
}


export { addUser }