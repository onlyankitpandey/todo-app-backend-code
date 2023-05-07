import { check } from 'express-validator'
export const RegisterSchema = [
  check('name').trim().isAlpha().withMessage("Name should be Alphabets only"),
  check('username', 'username is required').trim().exists().isLength({ min: 6, max: 32 }).isAlphanumeric().withMessage('username should be alphanumerc character only'),
  check('password', 'Password is required').isLength({ min: 6, max: 30 }).exists().trim(),
  check('email', 'email is required').exists().isEmail()
];

export const LoginSchema = [
  check('username', 'username is required').exists().isAlphanumeric().withMessage('username should be alphanumerc character only').trim().isLength({ min: 6, max: 32 }),
  check('password', 'Password is required').exists().isLength({ min: 6, max: 30 }).trim(),
]