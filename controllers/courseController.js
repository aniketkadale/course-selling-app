const Course = require("../models/course");
const Purchase = require("../models/purchases");

async function handleGetCoursePreview(req, res) {
    try {
        const courses = await Course.find({});
        if (!courses) {
            return res
                .status(404)
                .json({ message: "No courses available right now!" });
        }

        return res.status(200).json({ courses });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function handleCoursePurchase(req, res) {
    const userId = req.userId;
    const courseToPurchaseId = req.body.courseToPurchaseId;

    try {
        const purchasedCourse = await Purchase.create({
            courseId: courseToPurchaseId,
            userId: userId,
        });

        return res.status(201).json({
            message: "New course purchased",
            purchasedCourse: purchasedCourse,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { handleGetCoursePreview, handleCoursePurchase };