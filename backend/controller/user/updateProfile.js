const bigPromise = require("../../middleware/bigPromise");
const User = require("../../model/user");

const updateProfile = bigPromise(async (req, res) => {
  const { _id, name, password } = req.body;

  if (!name && !password) {
    console.log("nothing to update profile", !(name && email && password));
    return res.status(400).json({
      success: false,
      message: "nothing anil update profile",
    });
  }
  if (password) {
    if (!(password.length >= 6)) {
      return res.status(400).json({
        success: false,
        message: "Password should more than 6 character",
      });
    }
  }

  try {
    let user;
    if (name && password && password.length >= 6) {
      console.log("im here");
      user = await User.findOne({ _id }).select(["name", "password"]);
      user.name = name;

      if (await user.isValidPassword(password)) {
        return res.status(404).json({
          success: false,
          message: "Please enter new password",
        });
      } else user.password = password;

      await user.save();
      user.password = undefined;
    } else if (name) {
      user = await User.findByIdAndUpdate(_id, { name });
    } else if (password && password.length.length >= 6)
      if (user.name !== name) {
        user = await User.findOne({ _id }).select("password");

        if (await user.isValidPassword(password)) {
          return res.status(404).json({
            success: false,
            message: "Please enter new password",
          });
        } else user.password = password;

        await user.save();
        user.password = undefined;
      }
    await user.save();
    user.password = undefined;
    res.status(201).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.log("error while updating profile: ", error);
    res.status(500).json({
      success: false,
      validMessage: error.message,
      message: "error while updating profile",
    });
  }
});

module.exports = updateProfile;
