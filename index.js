import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import sequelize from './Utils/database.js';

import taskRoutes from './Routes/taskRoutes.js'
import authRoutes from './Routes/authRoutes.js'

import User from './Models/user.js'
import Task from './Models/task.js'

import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 5000;

const app = express();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.set("trust proxy", 1);

app.use('/task', taskRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res, next) => {
    res.send("Hello");
})

//Association
Task.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Task);

sequelize.sync()
    .then(() => {
        app.listen(port);
    })
    .catch(err => console.log(err));

export default app;