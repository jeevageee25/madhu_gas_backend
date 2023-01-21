var Client = require('node-rest-client').Client;
var error = require('../models/Error');

module.exports = {
    verifyToken: function (req, callback) {

        var authResult = {};

        var output = {};
        var resArray = new Array();

        var token = req.headers["authorization"];

        if (token) {

            var args = {
                headers: { "Content-Type": "application/json", "authorization": token }
            };

            var client = new Client();

            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


            client.get(config.AuthService.url, args, function (data, response) {
                if (data.errors) {
                    authResult.statusCode = response.statusCode;
                    authResult.errors = data.errors;
                    callback(authResult);
                } else {

                    authResult.statusCode = response.statusCode;

                    authResult.LOGIN_ID = data.user.LOGIN_ID;
                    authResult.FIRSTNAME = data.user.FIRSTNAME;
                    authResult.LASTNAME = data.user.LASTNAME;
                    authResult.PHONE = data.user.PHONE;
                    authResult.EMAIL = data.user.EMAIL;
                    authResult.ROLES = data.user.ROLES;
                    //authResult.PRIVILEGES = data.user.PRIVILEGES;
                    
                    authResult.token = token;
                    callback(authResult);
                }

            });
        }
        else {
            authResult.statusCode = 404;
            authResult.errors = "No Token Provided";
            callback(authResult);
        }

    }
}

