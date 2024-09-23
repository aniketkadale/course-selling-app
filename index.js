require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT;
const userRouter = require("./routes/userRoutes");
const courseRouter = require("./routes/courseRoutes");
const adminRouter = require("./routes/adminRoutes");
const { connectToMongoDB } = require("./db");

app.use(bodyParser.json());

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/courses", courseRouter);

// first wait till the mongodb connection is established then start your server
async function main() {
  await connectToMongoDB(`${process.env.MONGO_URL}`).then(() =>
    console.log("MongoDB connected...")
  );

  app.listen(PORT, () => {
    console.log(`Server running on port:${PORT}`);
  });
}

main();
