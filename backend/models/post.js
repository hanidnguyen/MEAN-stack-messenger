const mongoose = require("mongoose");

/**
 * Creator user id property will not be given by the user,
 * instead we will acquire it backend when inferred from the given token from front end.
 */
const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Post", postSchema);
