import express from 'express';
import { exportStudents, importStudents } from '../controllers/importExportController.js';
import { authMiddleware, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/export', authMiddleware, exportStudents);
router.post('/import', authMiddleware, authorizeRoles('admin'), importStudents);

export default router;
