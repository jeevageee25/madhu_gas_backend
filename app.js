
//##Load configuration
require("./config");

const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cors = require("cors");
  
const dbConnect = require('./util/dbConnect');
dbConnect.createCon();
 
const socket = require("socket.io");

const app = express();

// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//necessary for REST API
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(methodOverride("X-HTTP-Method-Override"));

//add CORS support
app.use(function (req, res, next) {
  console.log(" Adding the CORS support inside the initializing funtion ");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Authorization, x-access-token"
  );
  next();
});

 
 
require("./routes")(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    var output = {};
    output.error = err;
    output.message = err.message;
    res.status(500).json(output);
  });
}
 
app.use(function (err, req, res, next) {
  var output = {};
  output.message = err.message;

  res.status(500).json(output);
});
var port = process.env.PORT || 3000;
console.log(port);
var server = app.listen(port, function () {
  console.log("started on port : ", process.env.PORT);
  console.log("Environment : ", app.get("env"));
});

var io = socket(server);
 


module.exports = app;
