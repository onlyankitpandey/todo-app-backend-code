import { JWT_SECRET_KEY, StatusCode } from "../utils/constant.js"
import { jsonGenerator } from "../utils/helpers.js"
import Jwt from "jsonwebtoken"

const AuthMiddleware = (req, res, next) => {
  if (req.headers["auth"] === undefined) {
    return res.json(jsonGenerator(StatusCode.AUTH_ERROR, "Please Login first!"))
  }
  const token = req.headers["auth"];
  try {
    const decoded = Jwt.verify(token, JWT_SECRET_KEY)
    console.log(decoded)
    req.userId = decoded.userId;
    return next();
  } catch (error) {
    return res.json(jsonGenerator(StatusCode.UNPROCESSABLE_ENTITY, "Invalid Token"))
  }
}

export default AuthMiddleware;