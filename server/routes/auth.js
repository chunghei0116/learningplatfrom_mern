const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValadation = require("../validation").loginValadation;
const User = require("../models").userModel;
const JWT = require("jsonwebtoken");

router.use((req, res, next) => {
  console.log("A req is coming.");
  next();
});

router.get("/testAPI", (req, res) => {
  const msgObj = {
    message: "Test API is working.",
  };
  return res.json(msgObj);
});

router.post("/register", async (req, res) => {
  //check the validation of the data
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.message);
  }
  //check user exists
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).send("Email has already been registered.");

  const newUser = new User({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    role: req.body.role,
  });
  try {
    const savedUser = await newUser.save();
    res.status(200).send({
      msg: "success",
      savedObject: savedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send("User not saved.");
  }
});

router.post("/login", (req, res) => {
  //check validation of the data
  const { error } = loginValadation(req.body);
  if (error) return res.status(400).send(error.message);

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      res.status(400).send(err);
    }
    if (!user) {
      res.status(401).send("User not found.");
    } else {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch) {
          if (err) {
            res.status(400).send(err);
          }
          const tokenObject = { _id: user._id, email: user.email };
          const token = JWT.sign(tokenObject, process.env.PASSPORT_SECRET);
          res.send({ success: true, token: "JWT " + token, user });
        } else {
          console.log(err);
          res.status(401).send("Wrong password");
        }
      });
    }
  });
});

module.exports = router;
