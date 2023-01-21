const Joi = require("joi");
const schemas = {
  delete: Joi.object({
    _id: Joi.string().required(),
  }),
  searchExecutive: Joi.object().keys({
    search_key: Joi.object().required(),
    page: Joi.number().optional(),
    perPage: Joi.number().optional(),
  }),
  searchProducts: Joi.object().keys({
    search_key: Joi.object().required(),
    page: Joi.number().optional(),
    perPage: Joi.number().optional(),
  }),
  addProducts: Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    category: Joi.string().required(),
  }),
  updateProducts: Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().optional(),
    price: Joi.number().optional(),
    category: Joi.string().optional(),
  }),
  searchOrders: Joi.object().keys({
    search_key: Joi.object().required(),
    page: Joi.number().optional(),
    perPage: Joi.number().optional(),
  }),
  createOrders: Joi.object({
    address1: Joi.string().optional(),
    address2: Joi.string().optional(),
    category: Joi.string().optional(),
    count: Joi.number().optional(),
    expected_delivery: Joi.string().optional(),
    first_name: Joi.string().optional(),
    last_name: Joi.string().optional(),
    phone: Joi.number().optional(),
    pincode: Joi.string().optional(),
    product: Joi.string().optional(),
  }),
  updateOrders: Joi.object({
    _id: Joi.string().required(),
    address1: Joi.string().optional(),
    address2: Joi.string().optional(),
    category: Joi.string().optional(),
    count: Joi.number().optional(),
    expected_delivery: Joi.string().optional(),
    first_name: Joi.string().optional(),
    last_name: Joi.string().optional(),
    phone: Joi.number().optional(),
    pincode: Joi.string().optional(),
    product: Joi.string().optional(),
  }),
}

module.exports = schemas;
