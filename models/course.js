const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const courseSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  creatorId: {
    type: ObjectId,
    required: true,
  },
});

const Course = mongoose.model("courses", courseSchema);
module.exports = Course;
