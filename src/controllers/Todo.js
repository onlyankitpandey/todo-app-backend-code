import { validationResult } from "express-validator";
import { StatusCode } from "../utils/constant.js";
import { jsonGenerator } from "../utils/helpers.js";
import Todo from "../models/Todo.js";
import User from "../models/User.js";

// Create Todo
const createTodo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json(jsonGenerator(StatusCode.VALIDATION_ERROR, "Todo is Required", errors.mapped()));
  }
  try {
    const result = await Todo.create({
      userId: req.userId,
      title: req.body.title,
      description: req.body.description
    })
    if (result) {
      const user = await User.findOneAndUpdate({ _id: req.userId }, { $push: { todos: result } });
      return res.json(jsonGenerator(StatusCode.SUCCESS, "Todo Created successful", result))
    }
  } catch (error) {
    return res.json(jsonGenerator(StatusCode.UNPROCESSABLE_ENTITY, "Something went wrong", error))
  }
}

// List All Todo
const listAllTodo = async (req, res) => {
  try {
    const listTodo = await User.findById(req.userId).select("-password").populate('todos').exec();
    return res.json(jsonGenerator(StatusCode.SUCCESS, "Todo list data fetch succesful", listTodo))
  } catch (error) {
    return res.json(jsonGenerator(StatusCode.UNPROCESSABLE_ENTITY, "Error", error))
  }
}

// Mark as Completed
const completedMarkTodo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json(jsonGenerator(StatusCode.VALIDATION_ERROR, "Todo id is Required", errors.mapped()));
  }

  try {
    const todo = await Todo.findOneAndUpdate({ _id: req.body.todo_id, userId: req.userId }, [
      {
        $set: {
          isCompleted: {
            $eq: [false, "$isCompleted"]
          }
        }
      }
    ])
    if (todo) {
      return res.json(jsonGenerator(StatusCode.SUCCESS, "Marked Completed succesful", todo))
    }
  } catch (error) {
    return res.json(jsonGenerator(StatusCode.UNPROCESSABLE_ENTITY, "Error", null))
  }
}
// Delete Todo
const deleteTodo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json(jsonGenerator(StatusCode.VALIDATION_ERROR, "Todo id is Required", errors.mapped()));
  }

  try {
    const result = await Todo.findOneAndDelete({ _id: req.body.todo_id, userId: req.userId });

    if (result) {
      const user = await User.findOneAndUpdate({ _id: req.userId }, { $pull: { todos: req.body.todo_id } });
      return res.json(jsonGenerator(StatusCode.SUCCESS, "Todo Deleted Successfully", null))
    }
  } catch (error) {
    return res.json(jsonGenerator(StatusCode.UNPROCESSABLE_ENTITY, "Error", null))
  }
}

export { createTodo, listAllTodo, completedMarkTodo, deleteTodo }