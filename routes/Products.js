var express = require('express');
var router = express.Router();
var { ProductsController } = require('../controllers').ProductsController;
const middleware = require('../middleware/jwtHandler');
const validator = require('../middleware/SchemaValidator')
const schemas = require('../schemas').Products;
const controller = new ProductsController();


// EXECUTIVE SEARCH 

router.post('/executive/search', validator(schemas.searchExecutive, 'body'),
    controller.searchExecutive
);

// PRODUCTS 

router.post('/products/search', validator(schemas.searchProducts, 'body'),
    controller.searchProducts
);

router.post('/products/add', validator(schemas.addProducts, 'body'),
    controller.addProducts
);

router.post('/products/update', validator(schemas.updateProducts, 'body'),
    controller.updateProducts
);

router.delete('/products/delete/:_id', validator(schemas.delete, 'params'),
    controller.deleteProducts
);
module.exports = router;
