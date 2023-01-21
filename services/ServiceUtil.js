"use strict";

const db = require("../util/dbConnect");
const mongodb = require("mongodb");
const helpers = require("../util/Helpers");
const appUtils = require('../util/appUtils');
class ServiceUtil {
  constructor() {}
  async add(params, collection, message, req) {
    let output = {};
    let currentDate = new Date();
    let vDb = db.getDb();
    // let user = helpers.GetUserIDFromToken(req);

    params.created_by = '';
    params.created_date = currentDate;
    params.modified_date = currentDate;
    params.modified_by = '';

    let res = await vDb.collection(collection).insertOne(params);
    let ops = res.ops[0];

    output.message = message;
    output._id = ops._id;
    return output;
  }

  async addMany(params, collection, message, req) {
    let output = {};
    // let params = req.body;
    let currentDate = new Date();
    // currentDate = new Date(currentDate.toLocaleString());
    let user = helpers.GetUserIDFromToken(req);
    let vDb = db.getDb();
    let alldata;
    if (params && params.length > 0) {
      params = params.map((item) => {
        item.created_by = user;
        item.created_date = currentDate;
        item.modified_date = currentDate;
        item.modified_by = user;
        return item;
      });
      alldata = await vDb.collection(collection).insertMany(params);
    }

    output.message = message;
    output.list = alldata.ops 
    return output;
  }

  async update(params, collection, message, req) {
    let output = {};
    let currentDate = new Date();
    params.modified_date = currentDate;
    // let user = helpers.GetUserIDFromToken(req);
    params.modified_by = '';
    let query = {
      _id: mongodb.ObjectID(params._id),
    };
    delete params["_id"];
    await db.getDb().collection(collection).updateOne(query, {
      $set: params,
    });
    output.message = message;
    return output;
  }

  async updateMany(params, collection, message, req) {
    let output = {};
    // let params = req.body;
    let currentDate = new Date();
    currentDate = new Date(currentDate.toLocaleString());
    let user = helpers.GetUserIDFromToken(req);
    let vDb = db.getDb();

    if (params && params.length > 0) {
      for (let item of params) {
        let query = {
          _id: mongodb.ObjectID(item._id),
        };
        item.modified_date = currentDate;
        item.modified_by = user;
        delete item["_id"];

        await vDb.collection(collection).updateOne(query, {
          $set: item,
        });
      }
    }
    output.message = message;
    return output;
  }

  async addBatch(params, collection, message, req,name) {
    let output = {};
    let currentDate = new Date();
    // currentDate = new Date(currentDate.toLocaleString());
    let vDb = db.getDb();
    let user = helpers.GetUserIDFromToken(req);
    let code=name + currentDate.getFullYear() + (currentDate.getMonth() + 1) + currentDate.getDate()
    let data = await vDb
      .collection(collection)
      .find({
        code:code,
        main_id:params.main_id
      }).toArray();

    let last_num;
    if (data.length > 0) {
      last_num = (data.length + 1 < 10 ? "0" + (data.length + 1) : data.length + 1);
    } else {
      last_num = "01";
    }
    params.batch_id = code +"-"+ last_num;
    params.code = code;
    params.batch_status = 'Pending';
    params.last_number = last_num;
    params.created_by = user;
    params.created_date = currentDate;
    params.modified_date = currentDate;
    params.modified_by = user;

    let res = await vDb.collection(collection).insertOne(params);
    let ops = res.ops[0];

    output.message = message;
    output._id = ops._id.toString();
    output.batch_id = params.batch_id;
    return output;
  }

  async search(params, collection, aggregate) {
    let search_key = params.search_key;
    if (!aggregate) aggregate = [{ $match: search_key }];
    else aggregate.unshift({ $match: search_key });

    this.addSorting(aggregate);
    this.addPagination(params, aggregate);
    return await db
      .getDb()
      .collection(collection)
      .aggregate(aggregate)
      .toArray();
  }
  async searchAdmin(params, collection, aggregate) {
    let search_key = params.search_key;
    if (!aggregate) aggregate = [{ $match: search_key }];
    else aggregate.unshift({ $match: search_key });

    this.addSorting(aggregate);
    this.addPagination(params, aggregate);
    return await db
      .getMasterDb()
      .collection(collection)
      .aggregate(aggregate)
      .toArray();
  }

  async delete(params, collection, message) {
    let output = {};

    let _id = params._id;
    let vDb = db.getDb();

    let query = { _id: mongodb.ObjectID(_id) };
    await vDb.collection(collection).deleteOne(query);
    output.message = message;
    return output;
  }
  async deleteBySearch(params, collection, message) {
    let output = {};

    let vDb = db.getDb();
    await vDb.collection(collection).deleteMany(params);
    output.message = message;
    return output;
  }

  async deleteWithLookup(
    params,
    collection,
    message,
    lookupCollection,
    lookupKey,
    errMessage
  ) {
    let _id = params._id;
    let vDb = db.getDb();

    let query = {};
    query[lookupKey] = _id;
    let docs = await vDb.collection(lookupCollection).find(query).toArray();
    if (docs && docs.length > 0) {
      throw new Error(errMessage);
    } else {
      return await this.delete(params, collection, message);
    }
  }

  async deleteMany(params, collection, message) {
    let output = {};
    let vDb = db.getDb();

    let idDelete = [];
    params._ids.forEach(function (item) {
      idDelete.push(mongodb.ObjectID(item));
    });
    await vDb.collection(collection).deleteMany({ _id: { $in: idDelete } });
    output.message = message;
    return output;
  }

  addSorting(aggregate) {
    aggregate.push({ $sort: { _id: -1 } });
  }

  //##addPagination function is recommended
  //## If addPagination function is not working then use addPagination2 function.
  addPagination(params, aggregate) {
    let perPage = 10;
    let page = 1;
    if (params.page) page = Math.max(1, parseInt(params.page));
    if (params.perPage) perPage = parseInt(params.perPage);
    let skip = perPage * (page - 1);
    if (
      typeof params.page != "undefined" &&
      typeof params.perPage != "undefined"
    ) {
      aggregate.push({
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: page } }],
          data: [{ $skip: skip }, { $limit: perPage }],
        },
      });
    } else {
      aggregate.push({
        $facet: {
          metadata: [{ $count: "total" }],
          data: [],
        },
      });
    }
  }
  //##addPagination function is recommended
  //## If addPagination function is not working then use addPagination2 function.
  addPagination2(params, aggregate) {
    let perPage = 10;
    let page = 1;
    if (params.page) page = Math.max(1, parseInt(params.page));
    if (params.perPage) perPage = parseInt(params.perPage);
    let skip = perPage * (page - 1);
    if (
      typeof params.page != "undefined" &&
      typeof params.perPage != "undefined"
    ) {
      aggregate.push(
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            data: { $push: "$$ROOT" },
          },
        },
        {
          $project: {
            _id: 0,
            metadata: [{ total: "$total", page: page }],
            data: { $slice: ["$data", skip, perPage] },
          },
        }
      );
    } else {
      aggregate.push(
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            data: { $push: "$$ROOT" },
          },
        },
        {
          $project: {
            _id: 0,
            data: 1,
            metadata: [{ total: "$total" }],
          },
        }
      );
    }
  }
  async addOrder(params, collection, message, req,name) {
    let output = {};
    let currentDate = new Date();
   // currentDate = new Date(currentDate.toLocaleString());
    let vDb = db.getDb();
    let user = helpers.GetUserIDFromToken(req);
    let order_id = name;
    let data = await vDb
      .collection(collection)
      .find({})
      .sort({ _id: -1 })
      .limit(1)
      .toArray();
    let last_num;
    if (data.length > 0) {
      last_num = Number(data[0].last_number || 0) + 1;
    } else {
      last_num = 1;
    }
    params.order_id = order_id + appUtils.padToFour(last_num);
    params.last_number = last_num;
    params.created_by = user;
    params.created_date = currentDate;
    params.modified_date = currentDate;
    params.modified_by = user;

    let res = await vDb.collection(collection).insertOne(params);
    let ops = res.ops[0];

    output.message = message;
    output._id = ops._id.toString();
    output.order_id = params.order_id;
    return output;
  }

  async getData(query,collection,selectedKeys) {
    let vDb = db.getDb();
    return await vDb.collection(collection).find(query,selectedKeys).toArray();
  }

  async searchById(id, collection) {
    let query = id.map(i=>{
      return mongodb.ObjectID(i)
    });

    return await db
      .getDb()
      .collection(collection)
      .find({_id:{$in:query}})
      .toArray();
  }
}

module.exports = { ServiceUtil };
