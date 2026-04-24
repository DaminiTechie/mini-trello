const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Create task (admin only)
router.post('/', auth, role('admin'), async (req, res) => {
  try {
    const { title, description, due_date, ColumnId, UserId } = req.body;
    const task = await Task.create({ title, description, due_date, ColumnId, UserId });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update task - title, description, column (drag & drop)
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await task.update(req.body);
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete task (admin only)
router.delete('/:id', auth, role('admin'), async (req, res) => {
  try {
    await Task.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;