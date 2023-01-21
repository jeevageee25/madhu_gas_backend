const Joi = require("joi");
const schemas = {
  delete: Joi.object({
    _id: Joi.string().required(),
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
};

module.exports = schemas;
