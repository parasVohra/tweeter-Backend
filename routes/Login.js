const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const _ = require("lodash");

router.post("/", async (req, res) => {
  try {
    const sess = req.session;
    const { userName, password } = req.body;
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({
      userName: userName,
      password: password,
    });
    if (user) {
      console.log(user);
      sess.userName = userName;
      sess.password = password;
      console.log(req.session);
      res.send("you are logged In");
    } else {
      res.send("user not found");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = router;
