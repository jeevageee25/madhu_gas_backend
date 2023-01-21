let randomstring = require("randomstring");

const errorResponse = async (res, error, errorCode) => {
  console.error(error);
  console.log("Error:" + JSON.stringify(error));
  let response = {};
  response.message = error;
  response.stack = error.slack;
  response.errorCode = errorCode;
  response.status = errorCode;
  res.status(response.status).send(response);
};

const successResponse = async (res, params, message) => {
  let response = {};
  if (params && params[0] && params[0].data) {
    response = { ...params[0] };
  } else if ("undefined" != typeof params.ops) {
    response.data = params.ops;
  } else if (params && params['respData']) {
    response = { ...params['respData'] };
  }  else {
    response.data = params;
  }

  response.message = message;
  response.status = 200;
  res.status(response.status).send(response);
};

const padToFour = (number) => {
  console.log("number", number);
  if (number <= 9999) {
    number = ("0000" + number).slice(-4);
  }
  return number;
};

/*
 * function to generate  key
 */
const randomNumber = async () => {
  // Generate Random Number
  const number = randomstring.generate({
    charset: "numeric",
    length: 6,
    numeric: true,
    letters: true,
    special: false,
    exclude: ["0"],
  });
  return number;
};

module.exports = {
  errorResponse,
  successResponse,
  randomNumber,
  padToFour,
};
