const express = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { userAuthentication } = require("../Middlewares/user.authentication");
const { UserModel } = require("../Models/users.model");
const UserRouter = express.Router();

UserRouter.post("/register", async (req, res) => {
  const { email, password } = req.body;
console.log(email,password);
  const user = await UserModel.find({ email });

  if (user.length === 0) {
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        res.status(400).send({ msg: "Something Went Wrong" });
      } else {
        try {
          const newUser = new UserModel({
            email,
            password: hash,
          });
          console.log(newUser);
          await newUser.save();
          res.status(200).send({ msg: "User Registration Suceessful" });
        } catch (e) {
          res.status(400).send({ msg: "Something Went Wrong" });
        }
      }
    });
  } else {
    res.status(200).send({ msg: "User already exist, Please login" });
  }
});

UserRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.find({ email });

  if (user.length > 0) {
    bcrypt.compare(password, user[0].password, async (err, result) => {
      if (result) {
        try {
          const token = jwt.sign(
            { userID: user[0]._id },
            process.env.userSecretKey
          );
          res.status(200).send({ msg: "Login Suceessful", token: token });
        } catch (e) {
          res.status(400).send({ msg: "Wrong Credentials", err: e.message });
        }
      } else {
        res
          .status(201)
          .send({ msg: "Something Went Wrong", error: "Wrong Password" });
      }
    });
  } else {
    res
      .status(200)
      .send({ msg: "User is not registered,Please register first" });
  }
});

UserRouter.get("/user", userAuthentication, async (req, res) => {
  const { userID } = req.body;
  // console.log(userID);
  try {
    const user = await UserModel.findOne({ _id: userID });
    res.status(200).send({ msg: "User Details", user: user });
  } catch (e) {
    res
      .status(200)
      .send({ msg: "User is not authenticated,Please login first" });
  }
});

UserRouter.get("/", async (req, res) => {
  const users = await UserModel.find();
  res.status(200).send({ msg: "Welcome to User API", totalusers: users });
});

module.exports = { UserRouter };
