const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/db');
const User = require('./models/User');
const Board = require('./models/Board');
const Column = require('./models/Column');
const Task = require('./models/Task');

// Associations
User.hasMany(Task, { foreignKey: 'UserId' });
Task.belongsTo(User, { foreignKey: 'UserId' });
Board.hasMany(Column, { foreignKey: 'BoardId', onDelete: 'CASCADE' });
Column.belongsTo(Board, { foreignKey: 'BoardId' });
Column.hasMany(Task, { foreignKey: 'ColumnId', onDelete: 'CASCADE' });
Task.belongsTo(Column, { foreignKey: 'ColumnId' });
Board.belongsTo(User, { foreignKey: 'UserId' });

const app = express();
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/boards', require('./routes/boards'));
app.use('/api/columns', require('./routes/columns'));
app.use('/api/tasks', require('./routes/tasks'));

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
  console.log('Database connected & synced!');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.log(err));