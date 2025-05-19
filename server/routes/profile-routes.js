const express = require("express");
const { getUserById, updateUserInfo } = require("../controllers/profile-controller");
const authenticate = require("../middleware/auth-middleware");
const router = express.Router();


router.get("/get-user/:id", getUserById); 
router.put("/update-user", authenticate, updateUserInfo); 

module.exports = router;
