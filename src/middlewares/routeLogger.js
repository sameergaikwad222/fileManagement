function routeLogger(req, res, next) {
  console.log(`${new Date()}-${req.path}-${req.method}`);
  next();
}

module.exports = { routeLogger };
