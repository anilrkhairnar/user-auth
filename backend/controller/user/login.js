const bigPromise = require("../../middleware/bigPromise");
const User = require("../../model/user");

const login = bigPromise(async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      const token = user.getJwtToken();

      return res.status(200).json({
        success: true,
        user,
        token,
        message: "user logged in successfully",
      });
    } else {
      const { email, password } = req.body;

      if (!(email && password)) {
        return res.status(400).json({
          success: false,
          message: "all fields are required",
        });
      }

      if (typeof email !== "string" && typeof password !== "string") {
        return new Error("all fields needs to be in string format");
      }

      const user = await User.findOne({ email }).select("password");
      // .select("name")

      if (!user) {
        new Error("User doesn't exist");
        return res.status(500).json({
          success: false,
          message: "User doesn't exist",
        });
      }

      if (!(await user.isValidPassword(password))) {
        new Error("Wrong Password");
        return res.status(500).json({
          success: false,
          message: "Wrong Password",
        });
      }

      user.password = undefined;
      const token = user.getJwtToken();

      res.status(200).json({
        success: true,
        user,
        token,
        message: "user logged in successfully",
      });
    }
  } catch (error) {
    new Error("error while login user");
    console.log(error);
    res.status(500).json({
      success: false,
      message: "error while login user",
    });
  }
});

module.exports = login;
