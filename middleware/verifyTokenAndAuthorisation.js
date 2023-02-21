const jwt = require("jsonwebtoken");
const { verifyToken } = require("./verifyToken");

const verifyTokenAndAuthorisation = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).send("you are not allowed to do that");
    }
  });
};

module.exports = { verifyTokenAndAuthorisation };
