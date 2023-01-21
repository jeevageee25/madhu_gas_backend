const util = require("util");
const MongoClient = require("mongodb").MongoClient;
let _db;
let _masterDb;
let _dataLake;

module.exports = {
  connectToServer: function (callback) {
    this.connectDb(callback);
    this.connectDataLake(callback);
  },
  connectDb: function (callback) {
    MongoClient.connect(
      config.Database.DFARM.connectString,
      { poolSize: 20, useNewUrlParser: true },
      function (err, client) {
        _db = client.db(config.Database.DFARM.dbName);
        //console.log("_db:" + util.inspect(_db));
        _masterDb = client.db(config.Database.DFARM.masterDB);
        return callback(err);
      }
    );
  },
  connectDataLake: function (callback) {
    MongoClient.connect(
      config.Database.DataLake.connectString,
      { poolSize: 20, useNewUrlParser: true },
      function (err, client) {
        _dataLake = client.db(config.Database.DataLake.dbName);
        return callback(err);
      }
    );
  },
  getMasterDb: function () {
    return _masterDb;
  },

  getDb: function () {
    return _db;
  },

  getDataLake: function () {
    return _dataLake;
  },

  createCon: function () {
    console.log("createCon");
    this.connectToServer(function (err, client) {
      if (err) {
        let connError = new Error(
          500,
          "Error connecting to database",
          err
        );
        errors.push(connError);
        output.errors = errors;
        res.status(connError.status).json(output);
      } else {
        console.log("connection established");
      }
    });
  },
};
