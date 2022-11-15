import { CONSTANTS, Codes } from "../util/SiteConfig.js";

/** check the string valid or not */
export const isValidString = (str) => {
  if (str && str != 'null' && str != 'NULL' && str != null && str.trim() != '')
    return true;
  else
    return false
}

export function renderResponse(err, res, callback) {
  console.log("helper ts render");
  let response = {};
  if (err) {
    // console.log("err renderResponse", err);
    response = {
      message: err.message,
      code: err.code || 500,
      data: null
    };
  } else {
    response = {
      message: res.message,
      code: res.code || 200,
      data: res.data || null
    };
  }
  
  return callback(null, {
    statusCode: response.code || 500,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": false
    },
    body: JSON.stringify(response)
  })
}


// to.js
export function to(promise) {
  return promise.then(data => {
    return [null, data];
  })
    .catch(err => [err]);
}

/** get detault response */
export function getDefaultResponse() {
  return {
    message: CONSTANTS.SUCCESS,
    code: Codes.OK,
    data: null,
  };
}

export function parseBody(event) {
  // console.log("event",event);

  let data = {};
  if (event.body !== null && event.body !== undefined) {
    let body;
    try {
      body = JSON.parse(event.body)

    } catch (e) {
      body = event.body
      console.log(e)
    }
    // if (body.data)
    //   data = body.data;
    data = body;
  }
  if (data) {
    try {
      data._user_date_time = getUserLocalDateTime(event.headers.tz);
      data._tz = event.headers.tz || '+00:00';

    } catch (e) {
    }
  }
  return data;

}

export function getUserLocalDateTime(tz) {

  let utcdate = moment.utc();

  if (tz) {

    utcdate.utcOffset(tz);
    let sign = tz.indexOf("+") > -1 ? '-' : '+';
    let factors = tz.substring(1).split(":");
    let hours = sign + factors[0];
    let minutes = sign + factors[1];
    utcdate.add(Number(hours), 'hours')
      .add(Number(minutes), 'minutes')
  }
  // console.log("date",utcdate);
  return utcdate.format(CONSTANTS.MYSQL_DATE_TIME_FORMAT);
}

export async function EmailSend(param){
  var aws = require('aws-sdk');
  var ses = new aws.SES();
  var nodemailer = require('nodemailer');
  var smtpTransport = require('nodemailer-smtp-transport');

  /* var transport = nodemailer.createTransport("SMTP", { // Yes. SMTP!
    host: "email-smtp.eu-west-1.amazonaws.com", // Amazon email SMTP hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    auth: {
        user: "Your Amazon SMTP User", // Use from Amazon Credentials
        pass: "Your Amazon SMTP Pass" // Use from Amazon Credentials
    }
}); */

  var transporter = nodemailer.createTransport(({
    host: process.env.email_host,
    port: process.env.port,
    auth: {
      user: process.env.email_user,
      pass: process.env.email_pass
    }
  }));

  return new Promise((acc, rej) => {

    let data = param;
    let err;

    let result;

    var mailOptions = {
      from: process.env.email_from,
      to: data.to,
      subject: data.subject,
      html: data.html
    };

    console.log("mail options", mailOptions)
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return rej(error);
      } else {
        console.log(info);
        return acc(1);
      }
    });
  }).catch((err) => {
    console.log("Error in sending mail", err)
    return Promise.reject(err);
  });


}

export function isUrl(str){
  try {
    if (new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(str)) {
      return true;
    } else {
      return false;
    }

  } catch (e) {
    return false;
  }
}
