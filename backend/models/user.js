const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

//import mongoose unique validator as a third party package
//to add this validation logic for us.

/**
 * Unique does not validate input, only tags it!
 * Use mongoose unique validator as a plugin that will check data before saving it.
 */
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

//Use unique validator plugin
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
