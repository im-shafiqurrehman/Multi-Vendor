const express = require("express");
const app = express();
const ErrorMiddleWare = require("./middlewares/error");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "./config/.env" });
}


// Middleware (place before routes)
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(cookieParser());
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(express.json()); // Optional, can replace bodyParser.json() if preferred
// Serve static files from the uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes (place after middleware)
const user = require("./controllers/userController");
const shop = require("./controllers/shopController");
const product = require("./controllers/productController");
const event = require("./controllers/eventController");
const order = require("./controllers/orderController");
const coupon = require("./controllers/couponController");
const withdraw = require("./controllers/withdrawController");
const payment = require("./controllers/paymentController");

app.use("/api/v1/user", user);
app.use("/api/v1/shop", shop);
app.use("/api/v1/product", product);
app.use("/api/v1/event", event);
app.use("/api/v1/order", order);
app.use("/api/v1/coupon", coupon);
app.use("/api/v1/withdraw", withdraw);
app.use("/api/v1/payment", payment);

// Test route
app.use("/testing", (req, res) => {
  res.send("Hello World, it's working.");
});

// Error Middleware (place last)
app.use(ErrorMiddleWare);

module.exports = app;