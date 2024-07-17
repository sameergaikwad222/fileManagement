const constants = require("../constants/constant.json");
var jwt = require("jsonwebtoken");
const config = require("../configs/config.json");
const { logger } = require("../utils/logs");

const checkAuthorization = function (req, res, next) {
  let token;
  const tokenPart = req.headers["apikey"];
  if (tokenPart && tokenPart !== "") {
    token = tokenPart.split(" ")[1];
  } else {
    token = undefined;
  }

  if (!token || token === "") {
    return res.status(constants.status.code.UNAUTHORIZED).json({
      status: "failed",
      message: "Unauthorized",
      data: {},
    });
  }
  try {
    const decoded = jwt.verify(token, config.tokens.tokensecrete);
    const identifier = decoded.identifier;
    req.headers.identifier = identifier;
    next();
  } catch (error) {
    logger.error(error.message);
    return res.status(constants.status.code.UNAUTHORIZED).json({
      status: "failed",
      message: "Unauthorized.Token Expired",
      data: {},
    });
  }
};

module.exports = { checkAuthorization };
