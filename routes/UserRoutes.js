const express = require("express");
const authUser = require("../middleware/UserMiddleware")

const router = express.Router();

const { userLogin, userSignUp, userDetails, updateUser } = require("../controllers/UserControllers");

router.post("/login", userLogin);
router.post("/signup", userSignUp);
router.put("/update", authUser, updateUser);
router.get("/userdetails", authUser, userDetails);

module.exports = router;