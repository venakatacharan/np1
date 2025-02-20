const express = require('express');
const {
  createTask,
  deleteTask,
  getAllTasks,
  getTask,
  updateTask
} = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);
router.post('/', createTask);
router.get('/', getAllTasks);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
