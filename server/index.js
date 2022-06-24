const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const port = 8080; //Server port
const authRoute = require("./routes").auth; // return a props called auth.
const courseRoute = require("./routes").course;
const passport = require("passport");
require("./config/passport")(passport); // parameter into that function
const cors = require("cors");

/* --------------Middleware---------------------- */
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // encoded with to req content
app.use(cors()); //multiple server handling
app.use(express.json()); // MAKE SURE your req.body can be read
app.use("/api/user", authRoute); //that path is for convenient
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRoute
); //need passport to protect the route as not everyone can access that path
/* --------------Datebase---------------------- */
mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Success connected");
  })
  .catch((e) => {
    console.log("Failed connection");
    console.log(e);
  });
/* --------------Routing---------------------- */

app.get("/", (req, res) => res.send("Hello World!"));

/* ------------------------------------ */
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
