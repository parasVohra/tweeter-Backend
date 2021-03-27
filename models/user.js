const mongoose = require("mongoose");
const yup = require("yup");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    trim: true,
    required: true,
    minlength: 3,
    maxLength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    maxLength: 255,
  },
});

const User = mongoose.model("User", UserSchema);

function validateUserSchema(User) {
  const schema = yup.object().shape({
    userName: yup.string().required().min(3).max(255),
    password: yup.string().required().max(255),
  });

  return schema.validate(User);
}

exports.validate = validateUserSchema;
exports.User = User;
