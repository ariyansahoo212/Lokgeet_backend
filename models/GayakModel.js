const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    tradition: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    fees: {
      type: Number,
      required: true,
    },
    isGayak: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Gayak = mongoose.model("Gayak", schema);

module.exports = Gayak;
