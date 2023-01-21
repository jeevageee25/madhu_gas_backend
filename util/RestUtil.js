var Client = require('node-rest-client').Client;
var error = require('../models/Error');


module.exports = {
    GetRestRes: function (url, args, callback) {
        var output = {};
        var resArray = new Array();

        var client = new Client();

        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

        client.get(url, args, function (data, response) {
            if (response.statusCode === 200) {
                output.data = data;
            }
            else {
                resArray.push(data.errors);
                output.errors = resArray;
            }
            callback(response.statusCode, output);
        });

    },

    PostRestRes: function (url, args, callback) {
        var output = {};
        var resArray = new Array();

        var client = new Client();

        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

        client.post(url, args, function (data, response) {
            if (response.statusCode === 200) {
                output.data = data;
            }
            else {
                //resArray.push(data.VZTaskFault);
                output.error = data;
            }
            callback(response.statusCode, output);
        });

    }
}