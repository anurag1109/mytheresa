const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  console.log(token);
  if (token) {
    jwt.verify(token, "linkedin", (err, decoded) => {
      if (decoded) {
        req.body.user = decoded.userId;
        next();
      } else {
        res.status(200).send({ msg: "Please login first" });
      }
    });
  } else {
    res.status(200).send({ msg: "Please login first" });
  }
};

module.exports = { authenticate };
