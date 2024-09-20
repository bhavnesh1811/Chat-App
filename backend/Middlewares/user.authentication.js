const jwt = require("jsonwebtoken");
const { UserModel } = require("../Models/users.model");
require("dotenv").config();
const userAuthentication = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, process.env.userSecretKey, (err, decoded) => {
      if (decoded) {
        req.body.userID = decoded.userID;
        console.log("check");
        next();
      } else {
        res.status(403).send({ msg: "User Authorization Error" });
      }
    });
  } else {
    res.status(403).send({ msg: "Invalid Token" });
  }
};

const getUser = async (token) => {
  console.log(token);
  if (token) {
    return jwt.verify(
      token,
      process.env.userSecretKey,
      async (err, decoded) => {
        if (decoded) {
          const user = await UserModel.findOne({ _id: decoded.userID });
          // console.log(decoded);
          return user;
        } else {
          console.log({ msg: "User Banned" });
        }
      }
    );
  }
};

module.exports = { userAuthentication, getUser };
