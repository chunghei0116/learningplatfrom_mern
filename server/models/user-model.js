const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, minlength: 3, maxlength: 50 },
  email: { type: String, required: true, minlength: 6, maxlength: 100 },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  role: {
    type: String,
    enum: ["student", "instructor"],
    required: true,
  },
  date: { type: Date, default: Date.now },
});

userSchema.methods.isStudent = function () {
  // error function may cause error must use fucntion
  return this.role == "student";
};

userSchema.methods.isInstructor = function () {
  return this.role == "instructor";
};

userSchema.methods.isAdmin = function () {
  return this.role == "admin";
};
/* ------Schema midlleware */
userSchema.pre("save", async function (next) {
  // everytime got save it check the password need to hash or not
  if (this.isModified("password") || this.isNew) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  } else {
    return next();
  }
});

userSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return cb(err, isMatch);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", userSchema);
