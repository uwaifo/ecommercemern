require("dotenv").config();
require("./config/db");
const colors = require("colors");
const express = require("express");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");

// app middlewares
const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(expressValidator());

app.use("/api", authRoutes);
app.use("/api", userRoutes);
const port = process.env.PORT || 9900;

app.listen(port, console.log(`Server running on port ${port}`));
