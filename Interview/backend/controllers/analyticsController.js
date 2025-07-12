import { Student } from '../models/index.js';
import { fn, col } from 'sequelize';

export const getAnalytics = async (req, res) => {
  const total = await Student.count();
  const perClass = await Student.findAll({
    attributes: ['class', [fn('COUNT', col('id')), 'count']],
    group: ['class'],
  });
  const gender = await Student.findAll({
    attributes: ['gender', [fn('COUNT', col('id')), 'count']],
    group: ['gender'],
  });
  res.json({ total, perClass, gender });
};
