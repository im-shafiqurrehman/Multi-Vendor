const express = require("express");
const path = require("path");
const ErrorHandler = require("../utils/ErrorHandler");
const { upload } = require("../utils/multer.js");
const User = require("../model/userModel.js");
const catchAsyncError = require("../middlewares/catchAsyncError.js");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendToken = require("../utils/jwtToken");
const sendMail = require("../utils/sendEmail.js");
const { isAuthenticated } = require("../middlewares/auth.js");
const router = express.Router();


//craete_user Route
router.post("/create-user", upload.single("file"), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    //All fields are required
    if (!name || !email || !password) {
      return next(new ErrorHandler("All Fields Are Required!", 400));
    }

    const userEmail = await User.findOne({ email });
    // if the user Email already found in our DataBase
    if (userEmail) {
      //the file should also be deleted from server
      const filename = req.file.filename;
      const filePath = `uploads/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            message: "Error Deleting Files",
          });
        }
      });

      return next(new ErrorHandler("User Already Exist", 409));
    }

    //if not then we will create a new User

    const filename = req.file.filename;
    const fileURL = path.join(filename);
    const user = {
      name,
      email,
      password,
      avatar: fileURL,
    };
    const activationToken = createActivationToken(user);
    const activationUrl = `http://localhost:8000/activation/${activationToken}`;
    try {
      await sendMail({
        email: user.email,
        subject: "Activate Your Account!",
        emailMessage: `Hello!\n Dear ${user.name}\n Please click on the link below to activate your account \n${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        emailMessage: `Please check your email:-${user.email} to activate your account!`,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    next(new ErrorHandler(error.message, 400));
  }
});
//create activation Token (Function)
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};
//activate user Route
router.post(
  "/activation",
  catchAsyncError(async (req, res, next) => {
    try {
      const { activation_token } = req.body;
      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );
      if (!newUser) {
        next(new ErrorHandler("Invalid Token", 400));
      }
      const { name, email, password, avatar } = newUser;
      let user = await User.findOne({ email });
      if (user) {
        return next(new ErrorHandler("User already exists", 400));
      }

      user = await User.create({
        name,
        email,
        password,
        avatar,
      });
      sendToken(user, 201, res);
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }
  })
);
//login_user Route
router.post(
  "/login-user",
  catchAsyncError(async (req, res, next) => {
    try {
      let { email, password } = req.body;
      if (!email || !password)
        return next(new ErrorHandler("All Fileds are required!", 500));
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return next(new ErrorHandler("User Does't Exist!", 400));
      }
      const ValidPassword = await user.comparePassword(password);
      if (!ValidPassword) {
        return next(
          new ErrorHandler("Please,Provide the correct information!", 400)
        );
      }
      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);



//load User Route
router.get(
  "/get-user",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return next(new ErrorHandler("User does'nt exist!", 400));
      }
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


// Logout User
router.get(
  "/logout",
  isAuthenticated,
  catchAsyncError(async (reeq, res, next) => {
    try {
      res.cookie("token", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
      res.status(201).json({
        success: true,
        message: "Logout Successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
module.exports = router;