import mongoose from 'mongoose';
const userSchema = mongoose.Schema({
  name: {
    type: String,
    min: 6,
    max: 30,
  },
  username: {
    type: String,
    min: 6,
    max: 30,
    required: true,
  },
  password: {
    type: String,
    min: 6,
    max: 30,
    required: true,
  },
  email: {
    type: String,
    min: 6,
    max: 30,
    required: true,
  },
  todos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Todo",
  }],
  date: {
    type: Date,
    default: Date.now
  }
})
export default mongoose.model("User", userSchema);