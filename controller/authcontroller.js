const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { userModel } = require("../models/model");

const register = async (req, res) => {
  const { first_name, last_name, email, gender, password, age } = req.body;
  try {
    if (await userModel.findOne({ email })) {
      res.send({ msg: "User already exist, please login" });
    } else {
      const hashedpass = await bcrypt.hash(password, 5);
      const hasheduser = new userModel({
        first_name,
        last_name,
        email,
        gender,
        age,
        password: hashedpass,
      });
      console.log(hasheduser);
      await hasheduser.save();
      res.status(200).send({ msg: "User has been added successfully" });
    }
  } catch (err) {
    res.status(400).send({ msg: err });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const isUserExist = await userModel.findOne({ email });
    console.log(isUserExist);
    if (!isUserExist) {
      res.status(200).send({ msg: "User not exist. Please Register first" });
    } else if (!(await bcrypt.compare(password, isUserExist.password))) {
      res.status(200).send({ msg: "Password is not correct" });
    } else {
      const token = jwt.sign({ userId: isUserExist._id }, "linkedin");
      res.status(200).send({
        msg: "Login Successfull",
        token: token,
        username: isUserExist.first_name,
      });
    }
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports = { register, login };
