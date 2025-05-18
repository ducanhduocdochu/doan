const express = require("express");
const {
  getStudentViewCourseDetails,
  getAllStudentViewCourses,
  checkCoursePurchaseInfo,
  addFavoriteCourse,
  removeFavoriteCourse,
  getFavoriteCourses,
  getCartCourses,
  getPurchasedCourses,
  addToCart,
  removeFromCart,
} = require("../../controllers/student-controller/course-controller");
const authenticateMiddleware = require("../../middleware/auth-middleware");
const router = express.Router();

router.get("/get", getAllStudentViewCourses);
router.get("/get/details/:id", authenticateMiddleware, getStudentViewCourseDetails);
router.get("/purchase-info/:id/:studentId", checkCoursePurchaseInfo);
router.post("/favorite-course/add/:courseId", authenticateMiddleware, addFavoriteCourse);
router.delete("/favorite-course/remove/:courseId/", authenticateMiddleware, removeFavoriteCourse);
router.get("/favorite-courses", authenticateMiddleware, getFavoriteCourses);
router.get("/cart-courses", authenticateMiddleware, getCartCourses);
router.get("/purchased", authenticateMiddleware, getPurchasedCourses);
router.post("/cart-courses/add/:courseId", authenticateMiddleware, addToCart);
router.delete("/cart-courses/remove/:courseId", authenticateMiddleware, removeFromCart);


module.exports = router;
