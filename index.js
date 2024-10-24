const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
const url = "mongodb://localhost:27017/cbit";
mongoose.connect(url);
const con = mongoose.connection;
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rollNo: {
    type: Number,
    required: true,
  },
  isPassed: {
    type: Boolean,
    default: false,
  },
});
const Student = mongoose.model("Student", studentSchema);
con.on("open", () => {
  console.log("connected...");
});
app.listen(3000, () => {
  console.log("server started");
});
app.get("/students", async (req, res) => {
  console.log("Get called");
  try {
    const students = await Student.find({});
    return res.json(students);
  } catch (e) {
    console.error("Error while fetching the students", e);
  }
});

app.post("/students", async (req, res) => {
  console.log(req.body); // Log the request body
  const newStudent = new Student({
    name: req.body.name,
    rollNo: req.body.rollNo,
    isPassed: req.body.isPassed,
  });

  try {
    await newStudent.save(); // Save the new student to the database
    return res.json(newStudent); // Return the saved student as a response
  } catch (error) {
    console.error("Error while creating the student:", error);
    return res.json({ message: "Failed to create student" });
  }
});

app.patch("/students/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);

  const stu = await Student.findById({ _id: id });
  console.log(stu);

  if (stu) {
    const status = stu.isPassed;
    stu.isPassed = !status;
    await stu.save();
    return res.json(stu);
  } else {
    console.log("Student not found");
  }
});
app.delete("/students/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);

  const s = await Student.findByIdAndDelete({ _id: id });

  if (s) {
    return res.json(s);
  } else {
    console.log("No Student found with", id);
  }
});
