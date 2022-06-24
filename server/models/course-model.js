const mongoose = require("mongoose");
const bcrypt = require * "bcrypt";

const courseSchema = new mongoose.Schema({
  id: { type: String },
  title: { type: String, required: true },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  students: { type: [String], default: [] },
});

module.exports = mongoose.model("Course", courseSchema);
