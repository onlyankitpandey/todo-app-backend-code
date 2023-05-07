import express from "express";
import { login, register } from "../controllers/User.js";
import { RegisterSchema, LoginSchema } from "../ValidationSchema/UserSchema.js";
import { completedMarkTodo, createTodo, deleteTodo, listAllTodo } from "../controllers/Todo.js";
import { check } from "express-validator";

const apiRoute = express.Router();
const apiProtected = express.Router();

apiRoute.post('/register', RegisterSchema, register);
apiRoute.post('/login', LoginSchema, login);

//protected Routes
apiProtected.post('/createTodo', [check("description", "Description is Required").exists(), check("title", "Title is Required").exists()], createTodo)

apiProtected.put('/markTodo', [check("todo_id", "Todo id is Required").exists()], completedMarkTodo)
apiProtected.delete('/deleteTodo', [check("todo_id", "Todo id is Required").exists()], deleteTodo)

apiProtected.get('/getTodoList', listAllTodo);
export { apiRoute, apiProtected };