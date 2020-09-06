const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

const User = require("../models/User");
const { errorHandler } = require("../helpers/dbErrorHandler");
exports.signup = (req, res) => {
  const newuser = new User(req.body);
  newuser.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err),
      });
    }

    user.salt = undefined;
    user.hashed_password = undefined;

    res.json({
      user,
    });
  });

  //console.log(newuser);
};

exports.signin = (req, res) => {
  //Find the user based on the email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        err: "User with that email does not exist. Please signup",
      });
    }
    //If user is found then ensure that there are matching user and password in the system

    //creat authenticated method in the user model
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match",
      });
    }

    //generate a signed token with user id and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    //persiste the token as "t" in the cookie with an expirey date
    res.cookie("t", token, { expire: new Date() + 9999 });

    //return response with user and token to frontend client

    const { _id, name, email, role } = user;
    return res.json({
      token,
      user: {
        _id,
        email,
        name,
        role,
      },
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  res.json({
    message: "Signout success",
  });
};
