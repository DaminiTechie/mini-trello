const express = require('express');
const router = express.Router();
const Board = require('../models/Board');
const Column = require('../models/Column');
const Task = require('../models/Task');
const User = require('../models/User');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Get all boards
router.get('/', auth, async (req, res) => {
  try {
    const boards = await Board.findAll();
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create board (admin only)
router.post('/', auth, role('admin'), async (req, res) => {
  try {
    const board = await Board.create({ title: req.body.title, UserId: req.user.id });

    // Create default columns
    await Column.bulkCreate([
      { title: 'Todo', order: 1, BoardId: board.id },
      { title: 'In Progress', order: 2, BoardId: board.id },
      { title: 'Done', order: 3, BoardId: board.id }
    ]);

    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single board with columns and tasks
router.get('/:id', auth, async (req, res) => {
  try {
    const board = await Board.findByPk(req.params.id, {
      include: {
        model: Column,
        include: {
          model: Task,
          include: { model: User, attributes: ['id', 'name'] }
        }
      }
    });
    if (!board) return res.status(404).json({ message: 'Board not found' });
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete board (admin only)
router.delete('/:id', auth, role('admin'), async (req, res) => {
  try {
    await Board.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Board deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;