const express = require("express");
const {
  registerUser,
  loginUser,
  registerInstructor,
  verifyEmail
} = require("../../controllers/auth-controller/index");
const authenticateMiddleware = require("../../middleware/auth-middleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/register/instructor", registerInstructor);
router.post("/login", loginUser);
router.get("/verify-email", verifyEmail);
router.get("/check-auth", authenticateMiddleware, (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    data: {
      user,
    },
  });
});

module.exports = router;
