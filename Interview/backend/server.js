import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

import authRoutes from './routes/auth.js';
import studentRoutes from './routes/student.js';
import analyticsRoutes from './routes/analytics.js';
import importExportRoutes from './routes/importExport.js';

import db from './models/index.js';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/importExport', importExportRoutes);

// Start
db.sequelize.sync({ alter: true }).then(() => {
  app.listen(process.env.PORT || 5000, () => {
    console.log('Server running on port', process.env.PORT || 5000);
  });
});
