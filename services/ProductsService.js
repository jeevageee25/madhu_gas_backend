const db = require("../util/dbConnect");
const helpers = require("../util/Helpers");
const constants = require("../constant");
const _ = require("lodash");
const appUtils = require("../util/appUtils");
const mongodb = require("mongodb");
const { ServiceUtil } = require("./ServiceUtil");

class ProductsService {
  constructor() {
    this.serviceUtil = new ServiceUtil();
  }
 
  async searchProducts(req) {
    return await this.serviceUtil.search(req.body, constants.COLLECTIONS.PRODUCTS);
  }

  async addProducts(req) {
    return await this.serviceUtil.add(
      req.body,
      constants.COLLECTIONS.PRODUCTS,
      constants.MESSAGES.success,
      req
    );
  }

  async updateProducts(req) {
    return await this.serviceUtil.update(
      req.body,
      constants.COLLECTIONS.PRODUCTS,
      constants.MESSAGES.success,
      req
    );
  }

  async deleteProducts(req) {
    return await this.serviceUtil.delete(
      req.params,
      constants.COLLECTIONS.PRODUCTS,
      constants.MESSAGES.success
    );
  }

}

module.exports = { ProductsService };