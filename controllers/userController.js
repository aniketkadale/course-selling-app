const User = require("../models/user");
const Purchase = require("../models/purchases");
const Course = require("../models/course");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWT_SECRET_USER = process.env.JWT_SECRET_USER;


async function handleUserSignup(req, res) {
  try {
    const { email, password, first_name, last_name } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email: email,
      password: hashedPassword,
      first_name: first_name,
      last_name: last_name,
    });

    return res
      .status(201)
      .json({ message: "New user created", userCreated: newUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(404).json({ error: "All fields are required" });
  }

  try {
    const findUser = await User.findOne({ email: email });

    if (findUser) {
      const isMatch = await bcrypt.compare(password, findUser.password);

      if (isMatch) {
        const token = jwt.sign(
          {
            id: findUser._id,
          },
          JWT_SECRET_USER
        );
        return res
          .status(200)
          .json({ message: "User logged in", token: token });
      } else {
        return res.status(403).json({ error: "Invalid credentials" });
      }
    } else {
      return res.status(403).json({ error: "User does not exists in our db" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleUserPurchases(req, res) {
  const userId = req.userId;

  try {
    const userPurchases = await Purchase.find({ userId });

    let purchasedCourseIds = [];

    for (let i = 0; i < userPurchases.length; i++) {
      purchasedCourseIds.push(userPurchases[i].courseId);
    }

    const coursesData = await Course.find({
      _id: { $in: purchasedCourseIds },
    });

    return res.status(200).json({
      message: "User purchases fetched",
      userPurchases,
      coursesData,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { handleUserSignup, handleUserLogin, handleUserPurchases };
