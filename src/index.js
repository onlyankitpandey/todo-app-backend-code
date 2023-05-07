import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { apiRoute, apiProtected } from './routes/api.js';
import { CONNECT_DATABASE_URL } from './utils/constant.js'
import AuthMiddleware from './middlewares/AuthMiddleware.js';

const app = express();

mongoose.connect(CONNECT_DATABASE_URL, { useNewUrlParser: true }).then(() => {
  console.log("DataBase Connected!")
}).catch((error) => {
  console.log(error)
})

const PORT = 5000;
app.use(
  cors({
    origin: "http://localhost:3000",
  })
)
app.use(express.json());
app.use('/api/', apiRoute)
app.use('/api/', AuthMiddleware, apiProtected)

app.listen(PORT, () => console.log("Server is running"))