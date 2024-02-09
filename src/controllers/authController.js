const User = require("../models/users");
const TOKEN = require("../models/tokens");
const constants = require("../constants/constant.json");
const config = require("../configs/config.json");
const {
  validateFilter,
  createHashedPassword,
  generateAccessToken,
} = require("../utils/helper");

// ======================================= Users CRUD Sections =======================================

async function getFilteredUser(req, res) {
  let {
    filter = "{}",
    limit = 10,
    skip = 0,
  } = req?.query || { filter: "{}", limit: 10, skip: 0 };
  filter = validateFilter(filter);
  if (!filter) {
    return res.status(constants.status.code.BAD_REQUEST).json({
      status: constants.status.code.BAD_REQUEST,
      error: constants.status.message.BAD_REQUEST,
      data: {},
    });
  }
  try {
    const users = await User.find(filter).limit(limit).skip(skip).lean();
    if (users.length > 0) {
      return res.status(constants.status.code.SUCCESS).json({
        status: constants.status.code.SUCCESS,
        message: constants.status.message.SUCCESS,
        data: users,
      });
    } else {
      return res.status(constants.status.code.NOT_FOUND).json({
        status: constants.status.code.NOT_FOUND,
        message: constants.status.message.NOT_FOUND,
        data: {},
      });
    }
  } catch (error) {
    return res.status(constants.status.code.INTERNAL_SERVER_ERROR).json({
      status: constants.status.code.INTERNAL_SERVER_ERROR,
      message: constants.status.message.INTERNAL_SERVER_ERROR,
      data: error.message,
    });
  }
}

async function getSingleUser(req, res) {
  const identifier = req.params?.id;
  if (!identifier) {
    res.status(constants.status.code.BAD_REQUEST).json({
      status: constants.status.code.BAD_REQUEST,
      message: constants.status.message.BAD_GATEWAY,
      data: {},
    });
  }

  try {
    const user = await User.findById(identifier).lean();
    if (!user) {
      return res.status(constants.status.code.NOT_FOUND).json({
        status: constants.status.code.NOT_FOUND,
        NOT_FOUND: constants.status.message.NOT_FOUND,
        data: {},
      });
    }
    return res.status(constants.status.code.SUCCESS).json({
      status: constants.status.code.SUCCESS,
      message: constants.status.message.SUCCESS,
      data: user,
    });
  } catch (error) {
    console.log("Error while querying database", error.message);
    return res.status(constants.status.code.INTERNAL_SERVER_ERROR).json({
      status: constants.status.code.INTERNAL_SERVER_ERROR,
      message: constants.status.message.INTERNAL_SERVER_ERROR,
      data: {},
    });
  }
}

async function updateSingleUser(req, res) {
  const identifier = req.params?.id;
  if (!identifier) {
    res.status(constants.status.code.BAD_REQUEST).json({
      status: constants.status.code.BAD_REQUEST,
      message: constants.status.message.BAD_GATEWAY,
      data: {},
    });
  }

  const updateUserBody = req.body;
  const allowedFields = [
    "name",
    "phoneNumber",
    "age",
    "roles",
    "contactDetails",
    "contactDetails.email",
    "contactDetails.phoneNumber",
    "locationDetails",
    "locationDetails.countryName",
    "locationDetails.countryCode",
    "locationDetails.phoneCode",
    "locationDetails.area",
    "password",
    "statusId",
  ];
  let receivedFields = Object.keys(updateUserBody);
  receivedFields = receivedFields.filter((v) => allowedFields.includes(v));

  let updateObject = {};

  receivedFields.forEach((key) => {
    updateObject[key] = updateUserBody[key];
  });

  if (Object.keys(updateObject).length === 0) {
    return res.status(constants.status.code.BAD_REQUEST).json({
      status: constants.status.code.BAD_REQUEST,
      message: constants.status.message.BAD_REQUEST,
      data: {},
    });
  }
  try {
    const resp = await User.findOneAndUpdate(
      { _id: identifier },
      { $set: updateObject }
    );
    return res.status(constants.status.code.SUCCESS).json({
      status: constants.status.code.SUCCESS,
      message: constants.status.message.SUCCESS,
      data: resp,
    });
  } catch (error) {
    return res.status(constants.status.code.INTERNAL_SERVER_ERROR).json({
      status: constants.status.code.INTERNAL_SERVER_ERROR,
      message: constants.status.message.INTERNAL_SERVER_ERROR,
      data: error.message,
    });
  }
}

const addMultipleUsers = async (req, res) => {
  const users = req.body;
  if (!users || users.length == 0) {
    return res.status(constants.status.code.BAD_REQUEST).json({
      status: constants.status.code.BAD_REQUEST,
      message: constants.status.message.BAD_REQUEST,
      data: {},
    });
  }
  if (users && users.length > 0) {
    //Hashing Users password
    users.forEach((user) => {
      user.password = createHashedPassword(user.password);
    });

    try {
      const result = await User.insertMany(users);
      if (result.length > 0) {
        return res.status(constants.status.code.NO_CONTENT).json({
          status: constants.status.message.NO_CONTENT,
          message: constants.status.message.NO_CONTENT,
          docs: JSON.stringify(result),
        });
      } else {
        return res.status(constants.status.code.INTERNAL_SERVER_ERROR).json({
          status: constants.status.code.INTERNAL_SERVER_ERROR,
          message: constants.status.message.INTERNAL_SERVER_ERROR,
          data: {},
        });
      }
    } catch (error) {
      return res.status(constants.status.code.INTERNAL_SERVER_ERROR).json({
        status: constants.status.code.INTERNAL_SERVER_ERROR,
        message: constants.status.message.INTERNAL_SERVER_ERROR,
        data: error.message,
      });
    }
  }
};

const updateMultipleUsers = async (req, res) => {
  let filter = req.query?.filter;
  const updateUserBody = req.body;
  const allowedFields = [
    "name",
    "phoneNumber",
    "age",
    "roles",
    "contactDetails",
    "contactDetails.email",
    "contactDetails.phoneNumber",
    "locationDetails",
    "locationDetails.countryName",
    "locationDetails.countryCode",
    "locationDetails.phoneCode",
    "locationDetails.area",
    "password",
    "statusId",
  ];
  let receivedFields = Object.keys(updateUserBody);
  receivedFields = receivedFields.filter((v) => allowedFields.includes(v));
  filter = validateFilter(filter);
  if (!filter) {
    return res.status(constants.status.code.BAD_REQUEST).json({
      status: constants.status.code.BAD_REQUEST,
      error: constants.status.message.BAD_REQUEST,
      data: {},
    });
  }

  let updateObject = {};

  receivedFields.forEach((key) => {
    updateObject[key] = updateUserBody[key];
  });

  if (Object.keys(updateObject).length === 0) {
    return res.status(constants.status.code.BAD_REQUEST).json({
      status: constants.status.code.BAD_REQUEST,
      message: constants.status.message.BAD_REQUEST,
      data: {},
    });
  }

  try {
    const result = await User.updateMany(filter, { $set: updateObject });
    res.status(constants.status.code.SUCCESS).json({
      status: constants.status.code.SUCCESS,
      message: constants.status.message.SUCCESS,
      data: result,
    });
  } catch (error) {
    return res.status(constants.status.code.INTERNAL_SERVER_ERROR).json({
      status: constants.status.code.INTERNAL_SERVER_ERROR,
      message: constants.status.message.INTERNAL_SERVER_ERROR,
      data: error.message,
    });
  }
};

const deleteMultipleUsers = async (req, res) => {
  let filter = req.query?.filter;
  filter = validateFilter(filter);
  if (!filter) {
    return res.status(constants.status.code.BAD_REQUEST).json({
      status: constants.status.code.BAD_REQUEST,
      error: constants.status.message.BAD_REQUEST,
      data: {},
    });
  }

  try {
    const result = await User.deleteMany(filter);
    res.status(constants.status.code.NO_CONTENT).json({
      status: constants.status.code.NO_CONTENT,
      message: constants.status.message.NO_CONTENT,
      data: result,
    });
  } catch (error) {
    return res.status(constants.status.code.INTERNAL_SERVER_ERROR).json({
      status: constants.status.code.INTERNAL_SERVER_ERROR,
      message: constants.status.message.INTERNAL_SERVER_ERROR,
      data: error.message,
    });
  }
};

// ======================================= Authorization & Aunthentication Section =======================================

const authenticateUser = async (req, res) => {
  const { phoneNumber, password } = req.body;
  const mobileReg = /[0-9]{10}/g;
  //Check if invalid mobile
  if (!phoneNumber || !mobileReg.test(phoneNumber)) {
    return res.status(constants.status.code.BAD_REQUEST).json({
      status: "failed",
      message: "mobile is not valid",
      data: {},
    });
  }
  //Check if invalid password
  if (!password || password === "") {
    return res.status(constants.status.code.BAD_REQUEST).json({
      status: "failed",
      message: "password is empty",
      data: {},
    });
  }

  const user = await User.findOne({
    "contactDetails.phoneNumber": phoneNumber,
  });
  //user not found
  if (!user) {
    return res.status(constants.status.code.NOT_FOUND).json({
      status: "failed",
      message: "No such user found",
      data: {},
    });
  }

  // Comparing password for found user
  const comparePassword = createHashedPassword(password);

  if (comparePassword === user.password) {
    //Delete existing tokens if any
    try {
      await TOKEN.findOneAndDelete({
        identifier: user._id,
      });
    } catch (error) {
      console.log("Error while checking existing tokens", error.message);
    }

    //create JWT token for authenticated user
    const token = generateAccessToken(
      user._id,
      config.tokens.tokensecrete,
      config.tokens.expiry
    );
    const refreshToken = generateAccessToken(
      user._id,
      config.tokens.refreshtokensecrete
    );
    //Inserting token into database
    try {
      const resp = await TOKEN.create({
        identifier: user._id,
        token: token,
        refreshtoken: refreshToken,
      });
      return res.status(constants.status.code.SUCCESS).json({
        status: "success",
        message: "User Auntheticated successfully",
        data: resp,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(constants.status.code.INTERNAL_SERVER_ERROR).json({
        status: "failed",
        message: "Error while generating tokens",
        data: {},
      });
    }
  } else {
    return res.status(constants.status.BAD_REQUEST).json({
      status: "failed",
      message: "Password doesn't match.",
      data: {},
    });
  }
};

const getNewToken = async (req, res) => {
  const { token } = req.body;
  //Invalidate the blank or no tokens
  if (!token || token === "") {
    res.status(constants.status.BAD_REQUEST).json({
      status: "failed",
      message: "refresh token required",
      data: {},
    });
  }

  try {
    // Find existing refresh token if exists
    const tokenObj = await TOKEN.findOne({
      refreshtoken: token,
    });

    //generate new token if found one
    if (tokenObj && tokenObj?.token) {
      const newtoken = generateAccessToken(
        tokenObj.identifier,
        config.tokens.tokensecrete,
        config.tokens.expiry
      );

      // Updating new Token into database
      await TOKEN.findOneAndUpdate(
        {
          identifier: tokenObj.identifier,
        },
        {
          $set: {
            token: newtoken,
          },
        }
      );

      //share back new token
      return res.status(constants.status.code.SUCCESS).json({
        status: "success",
        message: "Fresh token generated",
        data: {
          token: newtoken,
        },
      });
    } else {
      //send no user found messsage
      return res.status(constants.status.code.BAD_REQUEST).json({
        status: "failed",
        message: "user already might have logged out",
      });
    }
  } catch (error) {
    console.log(
      "Error while fetching token details. Kindly relogin and get one"
    );
    return res.status(constants.status.code.INTERNAL_SERVER_ERROR).json({
      status: "failed",
      message: "Error while generating Tokens",
      data: {},
    });
  }
};

const deAuthenticateUser = async (req, res) => {
  const refreshtoken = req.body.token;

  if (!refreshtoken || refreshtoken === "") {
    return res.status(constants.status.code.BAD_REQUEST).json({
      status: "failed",
      message: "No user found for logout",
      data: {},
    });
  }

  try {
    await TOKEN.findOneAndDelete({
      refreshtoken: refreshtoken,
    });
    return res.status(constants.status.code.NO_CONTENT).json({
      status: "success",
      message: "user successfully logged out",
      data: {},
    });
  } catch (error) {
    console.log("Error while deleting tokens", error.message);
    return res.status(constants.status.code.INTERNAL_SERVER_ERROR).json({
      status: "failed",
      message: "Error while logging out",
      data: {},
    });
  }
};

module.exports = {
  getFilteredUser,
  addMultipleUsers,
  updateMultipleUsers,
  deleteMultipleUsers,
  getSingleUser,
  updateSingleUser,
  authenticateUser,
  getNewToken,
  deAuthenticateUser,
};
