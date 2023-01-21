let jwt = require('jsonwebtoken');

let checkToken = (req, res, next) => {
  let token = req.headers['x-access-token']; // Express headers are auto converted to lowercase
  console.log(token)
  
    // token = token.slice(7, token.length);

  if (token) {
    jwt.verify(token, config.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        req.decoded = decoded;
        console.log(req.decoded);
        next();
      }
    });
  } else {
    return res.status(400).json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};

module.exports = {
  checkToken: checkToken
}
