import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

import UserModel from './User.js';
import StudentModel from './Student.js';
import AuditLogModel from './AuditLog.js';

const sequelize = new Sequelize(
  process.env.db_name,
  process.env.db_user,
  process.env.db_password,
  {
    host: process.env.db_host,
    dialect: process.env.db_dialect,
    logging: false,
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = UserModel(sequelize, DataTypes);
db.Student = StudentModel(sequelize, DataTypes);
db.AuditLog = AuditLogModel(sequelize, DataTypes);

export const { User, Student, AuditLog } = db;
export default db;
