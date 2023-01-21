const appUtils = require("../util/appUtils");
const constants = require("../constant");
const { ProductsService } = require("../services").ProductsService;
const service = new ProductsService();

class ProductsController {
  constructor() { }

  /**
   * this method is used to get all the collection center
   * @param {*} req
   * @param {*} res
   */

  async searchExecutive(req, res) {
    try {
      const pService = await service.searchExecutive(req);
      return appUtils.successResponse(
        res,
        pService,
        constants.MESSAGES.success
      );
    } catch (error) {
      return appUtils.errorResponse(res, error, constants.code.error_code);
    }
  }
  
  async searchProducts(req, res) {
    try {
      const pService = await service.searchProducts(req);
      return appUtils.successResponse(
        res,
        pService,
        constants.MESSAGES.success
      );
    } catch (error) {
      return appUtils.errorResponse(res, error, constants.code.error_code);
    }
  }

  async addProducts(req, res) {
    try {
      const pService = await service.addProducts(req);
      return appUtils.successResponse(res, pService, constants.MESSAGES.success);
    } catch (error) {
      return appUtils.errorResponse(res, error, constants.code.error_code);
    }
  }

  async updateProducts(req, res) {
    try {
      const pService = await service.updateProducts(req);
      return appUtils.successResponse(res, pService, constants.MESSAGES.success);
    } catch (error) {
      return appUtils.errorResponse(res, error, constants.code.error_code);
    }
  }

  async deleteProducts(req, res) {
    try {
      const pService = await service.deleteProducts(req);
      return appUtils.successResponse(res, pService, constants.MESSAGES.success);
    } catch (error) {
      return appUtils.errorResponse(res, error, constants.code.error_code);
    }
  }
}

module.exports = { ProductsController };
