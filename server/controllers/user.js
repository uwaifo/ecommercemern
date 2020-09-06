const User = require("../models/User");
exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    req.profile = user;
    //NOTE. We always use next() when th efunction is serving as a middleware .
    //The next() transfers controll to anothet designated function
    next();
  });
};
