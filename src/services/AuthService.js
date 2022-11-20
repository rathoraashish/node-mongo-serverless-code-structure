import * as dotenv from "dotenv";

export class AuthService {
  constructor() {
    dotenv.config();
  }

  async userAuthCheck(event, context, callback) {
    console.log("event", event);
    const token = event.headers.Authorization || event.headers.authorization;
    console.log("token", token);
    try {
      // Verify JWT
      const decoded = jwt.verify(token, process.env.EncryptionKEY);

      const user = decoded.data;
      console.log("user ** ", user);

      // console.log("user ** &&&&&&&&&&&&&&&&&&&& ", user);
      const userId = user.id;
      //   const authorizerContext = {
      //     user: JSON.stringify(user),
      //   };
      // Return an IAM policy document for the current endpoint
      const policyDocument = this.generatePolicy(
        userId,
        "Allow",
        event.methodArn
      );
      callback(null, policyDocument);
    } catch (e) {
      callback("Unauthorized"); // Return a 401 Unauthorized response
    }
  }

  generatePolicy(principalId, effect, resource) {
    const res = {};
    res.principalId = principalId;
    if (effect && resource) {
      const policyDocument = {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: effect,
            Resource: resource,
          },
        ],
      };
      res.policyDocument = policyDocument;
    }
    console.log("res>>>>>>>>>", res);
    return res;
  }
}
