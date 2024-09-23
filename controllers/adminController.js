const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/admin");
const Course = require("../models/course");
const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN;

async function handleAdminSignup(req, res) {
    try {
        const { email, password, first_name, last_name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await Admin.create({
            email: email,
            password: hashedPassword,
            first_name: first_name,
            last_name: last_name,
        });

        return res
            .status(201)
            .json({ message: "New admin created", newAdmin: newAdmin });
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function handleAdminLogin(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(404).json({ error: "All fields are required" });
    }

    try {
        const findAdmin = await Admin.findOne({ email: email });

        if (findAdmin) {
            const isMatch = await bcrypt.compare(password, findAdmin.password);

            if (isMatch) {
                const token = jwt.sign(
                    {
                        id: findAdmin._id,
                    },
                    JWT_SECRET_ADMIN
                );

                return res
                    .status(200)
                    .json({ message: "Admin logged in", token: token });
            } else {
                return res.status(403).json({ error: "Invalid credentials" });
            }
        } else {
            return res.status(403).json({ error: "Admin does not exists in our db" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function handleCreateCourse(req, res) {
    const adminId = req.userId;
    const { title, description, price, imageUrl } = req.body;

    if (!title || !description || !price || !imageUrl) {
        return res.status(404).json({ error: "All fields are required" });
    }

    try {
        const course = await Course.create({
            title: title,
            description: description,
            price: price,
            imageUrl: imageUrl,
            creatorId: adminId,
        });

        return res
            .status(201)
            .json({ message: "New course created", courseId: course._id });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function handleUpdateCourse(req, res) {
    const adminId = req.userId;
    const { title, description, price, imageUrl, courseId } = req.body;

    if (!title || !description || !price || !imageUrl || !courseId) {
        return res.status(404).json({ error: "All fields are required" });
    }

    try {
        const course = await Course.findOneAndUpdate(
            {
                _id: courseId,
                creatorId: adminId,
            },
            {
                title: title,
                description: description,
                imageUrl: imageUrl,
                price: price,
            }
        );

        return res
            .status(201)
            .json({ message: "Course updated", courseId: course._id });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function handleGetBulkCourses(req, res) {
    const adminId = req.userId;
    // console.log(adminId);

    try {
        const adminCourses = await Course.find({
            creatorId: adminId,
        });

        if (!adminCourses || adminCourses.length === 0) {
            return res.status(400).json({ message: "Admin has no courses" });
        }

        return res
            .status(200)
            .json({ message: "Admin courses fetched", adminCourses });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { handleAdminSignup, handleAdminLogin, handleCreateCourse, handleUpdateCourse, handleGetBulkCourses };