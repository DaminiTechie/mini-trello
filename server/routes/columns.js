const express = require('express');
const router = express.Router();
const Column = require('../models/Column');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Add new column
router.post('/', auth, role('admin'), async (req, res) => {
  try {
    const column = await Column.create({ title: req.body.title, BoardId: req.body.boardId });
    res.status(201).json(column);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete column
router.delete('/:id', auth, role('admin'), async (req, res) => {
  try {
    await Column.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Column deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;