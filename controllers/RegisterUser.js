const { User, validate } = require("../models/user");
const _ = require("lodash");

export const registerUser = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ userName: req.body.userName });
    if (user) return res.status(400).send("User already registered");

    user = new User(_.pick(req.body, ["userName", "password"]));
    user.save().then((r) => {
      console.log(r);
      res.send(r);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};
