import { validationResult } from 'express-validator'
import { jsonGenerator } from '../utils/helpers.js';
import { StatusCode, JWT_SECRET_KEY } from '../utils/constant.js';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const register = async (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const { name, username, password, email } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const userExist = await User.findOne({
      $or: [{ email: email }, { username: username }]
    })

    if (userExist) {
      return res.json(jsonGenerator(StatusCode.UNPROCESSABLE_ENTITY, "User or Email already exist."))
    }

    // Save to DataBse
    try {
      const result = await User.create({
        name: name,
        email: email,
        password: hashPassword,
        username: username
      })
      const token = jwt.sign({ userId: result._id }, JWT_SECRET_KEY)
      res.json(jsonGenerator(StatusCode.SUCCESS, "Registration Successfully", { userId: result._id, token: token }))
    } catch (error) {
      console.log(error)
    }
  }
  res.json(jsonGenerator(StatusCode.VALIDATION_ERROR, "Validation error", errors.mapped()));
};


const login = async (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username });
    if (!user) {
      return res.send(jsonGenerator(StatusCode.UNPROCESSABLE_ENTITY, "username or password is incorrect"))
    }

    const verified = bcrypt.compareSync(password, user.password)
    if (!verified) {
      return res.send(jsonGenerator(StatusCode.UNPROCESSABLE_ENTITY, "username or password is incorrect"))
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY);

    return res.json(jsonGenerator(StatusCode.SUCCESS, "Login Successful!", { userId: user._id, token: token }))

  }
  res.json(jsonGenerator(StatusCode.VALIDATION_ERROR, "Validation error", errors.mapped()));
};


export { register, login };