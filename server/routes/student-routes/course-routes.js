const express = require("express");
const {
  getStudentViewCourseDetails,
  getAllStudentViewCourses,
  checkCoursePurchaseInfo,
  addFavoriteCourse,
  removeFavoriteCourse,
} = require("../../controllers/student-controller/course-controller");
const authenticateMiddleware = require("../../middleware/auth-middleware");
const router = express.Router();

router.get("/get", getAllStudentViewCourses);
router.get("/get/details/:id", authenticateMiddleware, getStudentViewCourseDetails);
router.get("/purchase-info/:id/:studentId", checkCoursePurchaseInfo);
router.post("/favorite-course/add/:courseId", authenticateMiddleware, addFavoriteCourse);
router.delete("/favorite-course/remove/:courseId/", authenticateMiddleware, removeFavoriteCourse);

module.exports = router;
