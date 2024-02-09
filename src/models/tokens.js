const { Schema, default: mongoose } = require("mongoose");

const tokenSchema = new Schema(
  {
    identifier: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    refreshtoken: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("TOKEN", tokenSchema);
