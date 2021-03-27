const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const _ = require("lodash");

router.post("/", async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return console.log(err);
      }
      console.log(req.session);
      res.send("logged out");
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = router;
