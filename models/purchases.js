const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const purchaseSchema = mongoose.Schema({
  courseId: {
    type: ObjectId,
    required: true,
  },
  userId: {
    type: ObjectId,
    required: true,
  },
});

const Purchase = mongoose.model("purchases", purchaseSchema);
module.exports = Purchase;
