// import router
const router = require("express").Router();

// middleware
const auth = require("../middleware/auth");

// import todo controller
const { register, login, updateProfile } = require("../controller/user");

router.route("/register").post(register);
router.route("/login").post(auth, login);
router.route("/updateProfile").put(updateProfile);

module.exports = router;
