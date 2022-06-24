const router = require("express").Router();
const Course = require("../models").corseModel;
const courseValidation = require("../validation").courseValidation;

router.use((req, res, next) => {
  {
    console.log("A req is coming into api");
    next(); // remember to type the next to acces next middleware
  }
});

router.get("/", (req, res) => {
  //List out all the courses
  Course.find({})
    .populate("instructor", ["username", "email"]) // when we find data by _id but also get the data like email and username
    .then((course) => {
      res.send(course);
    })
    .catch(() => {
      res.status(500).send("Cannot get the course!");
    }); //return all the data once
});

router.get("/:_id", (req, res) => {
  //find the specific one course
  let { _id } = req.params;
  Course.findOne({ _id })
    .populate("instructor", ["emial"])
    .then((course) => {
      res.send(course);
    })
    .catch((e) => {
      res.send(e);
    });
});

router.post("/", async (req, res) => {
  // create a new course by the instructor
  const { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.message);

  let { title, description, price } = req.body;
  console.log(req.user);
  if (req.user.isStudent()) {
    return res.status(400).send("Only instructor can post a new course");
  }

  let newCourse = new Course({
    title,
    description,
    price,
    instructor: req.user._id,
  });

  try {
    await newCourse.save();
    res.status(200).send("New course has been post");
  } catch (err) {
    res.status(400).send("Posting error");
  }
});

router.patch("/:_id", async (req, res) => {
  //edit the specific course
  const { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.message);

  let { _id } = req.params;
  let course = await Course.findOne({ _id }); // remember to add await as we need to get the data back from the DB
  if (!course) {
    //Cannot find that course
    res.status(404);
    return res.json({ success: false, message: "Cannot find that course" });
  }

  if (course.instructor.equals(req.user._id) || req.user.isAdmin()) {
    Course.findOneAndUpdate({ _id }, req.body, {
      new: true,
      runValidators: true,
    })
      .then(() => {
        res.send("Course updated");
      })
      .catch((e) => {
        res.send({ success: false, message: e });
      });
    //instructor who can edit that course
  } else {
    res.status(403);
    return res.json({
      success: false,
      message: "Only instructor or admin can edit this course",
    });
  }
});

router.delete("/:_id", async (req, res) => {
  const { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.message);

  let { _id } = req.params;
  let course = await Course.findOne({ _id }); // remember to add await as we need to get the data back from the DB
  if (!course) {
    //Cannot find that course
    res.status(404);
    return res.json({ success: false, message: "Cannot find that course" });
  }
  if (course.instructor.equals(req.user._id) || req.user.isAdmin()) {
    Course.deleteOne({ _id })
      .then(() => {
        res.send("Course deleted");
      })
      .catch((e) => {
        res.send({ success: false, message: e });
      });
    //instructor who can edit that course
  } else {
    res.status(403);
    return res.json({
      success: false,
      message: "Only instructor or admin can delete this course",
    });
  }
});

module.exports = router;
