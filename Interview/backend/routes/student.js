import express from 'express';
import {
  createStudent,
  getStudents,
  updateStudent,
  deleteStudent,
} from '../controllers/studentController.js';
import { authMiddleware, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.post('/', authorizeRoles('teacher'), createStudent);
router.get('/', getStudents);
router.put('/:id', authorizeRoles('teacher'), updateStudent);
router.delete('/:id', authorizeRoles('teacher'), deleteStudent);

export default router;
