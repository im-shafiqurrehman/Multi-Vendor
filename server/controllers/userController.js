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
        emailMessage: `Hello!\n Dear ${user.name}\n Please click on the link below to activate your account \n${activationUrl}\n\nThis link will expire in 5 minutes. If you didn't request this, please ignore this email.\n\nBest regards,\n Half-attire `,
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



// Send-activation-link Route
router.post("/send-activation-link", async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next(new ErrorHandler("Email is required!", 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Generate activation token
    const activationToken = jwt.sign(
      { id: user._id },
      process.env.ACTIVATION_SECRET,
      { expiresIn: "10m" } // 10 minutes expiry
    );

    // Save token to user (using new fields to distinguish from reset)
    user.activationToken = activationToken;
    user.activationExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes in milliseconds
    await user.save();

    const activationUrl = `http://localhost:8000/verify-email/${activationToken}`;

    try {
      await sendMail({
        email: user.email,
        subject: "Verify Your Email",
        emailMessage: `Hello ${user.name},\n\nPlease click the link below to verify your email and proceed with resetting your password:\n\n${activationUrl}\n\nThis link will expire in 10 minutes. If you didn't request this, please ignore this email.\n\nBest regards,\n Half-Attire`,
      });

      res.status(200).json({
        success: true,
        message: `Activation link sent to ${user.email}`,
      });
    } catch (error) {
      user.activationToken = undefined;
      user.activationExpiry = undefined;
      await user.save();
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});


router.get("/verify-email/:token", async (req, res, next) => {
  try {
    const { token } = req.params;
    console.log("Received Token:", token);

    const decoded = jwt.verify(token, process.env.ACTIVATION_SECRET);
    console.log("Decoded Token:", decoded);
    const userId = decoded.id;

    console.log("Searching for user with ID:", userId);
    const user = await User.findOne({
      _id: userId,
      activationToken: token,
      activationExpiry: { $gt: Date.now() },
    });
    console.log("User from DB:", user);

    if (!user) {
      return next(new ErrorHandler("Invalid or expired activation token", 400));
    }

    user.activationToken = undefined;
    user.activationExpiry = undefined;
    await user.save();
    console.log("User after update:", user);

    // Attempt to redirect
    const redirectUrl = `http://127.0.0.1:3000/reset-password?token=${token}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Error in verify-email:", error.message);
    // Fallback: Return JSON with redirect URL if redirect fails
    res.status(200).json({
      success: true,
      message: "Email verified. Please navigate to the following URL to reset your password.",
      redirectUrl: `http://127.0.0.1:3000/reset-password?token=${token}`,
    });
  }
});


router.get("/get-email-by-token/:token", async (req, res, next) => {
  try {
    const { token } = req.params;

    // Verify the token
    const decoded = jwt.verify(token, process.env.ACTIVATION_SECRET);
    const userId = decoded.id;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    res.status(200).json({
      success: true,
      email: user.email,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});


router.post("/set-new-password", async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return next(new ErrorHandler("Email and new password are required", 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});



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


