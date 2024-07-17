const { logger } = require("../utils/logs");
function routeLogger(req, res, next) {
  logger.info(`${new Date().toGMTString()}-${req.path}-${req.method}`);
  next();
}

module.exports = { routeLogger };
