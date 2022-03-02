import express from 'express';

import Task from '../Models/task.js';
import isAuthorized from '../Utils/isAuthorized.js';

const router = express.Router();

router.get('/get', isAuthorized, async (req, res, next) => {
    let returnedTasks = [];
    try {
        const tasks = await Task.findAll({ where: { UserUsername: req.username }, order: [["id", "ASC"]] });
        tasks.map(task => {
            returnedTasks.push({ id: task.dataValues.id, label: task.dataValues.label, priority: task.dataValues.priority });
        })
        res.status(200).json(returnedTasks);
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

router.post('/create', isAuthorized, async (req, res, next) => {
    const newTask = { label: req.body.label, priority: +req.body.priority, UserUsername: req.username };
    try {
        await Task.create(newTask);
        res.status(200).json("Task Created");
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

router.post('/edit/:id', isAuthorized, async (req, res, next) => {
    const taskId = req.params.id;
    const editedLabel = req.body.label;
    // const editedPriority = req.body.priority;
    try {
        const updateTask = await Task.update({ label: editedLabel }, { where: { id: taskId } });
        res.status(200).json("Task Edited");
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

router.delete('/delete/:id', isAuthorized, async (req, res, next) => {
    const taskId = req.params.id;
    try {
        const deleteTask = await Task.destroy({ where: { id: taskId } });
        res.status(200).json("Task Deleted");
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

export default router;