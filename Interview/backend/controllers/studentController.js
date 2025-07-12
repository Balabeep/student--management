import { Student } from '../models/index.js';
import { Op } from 'sequelize';

export const createStudent = async (req, res) => {
  try {
    const { name, age, class: className, gender } = req.body;
    let image = null;

    if (req.files?.image) {
      const imageFile = req.files.image;
      const filename = `${Date.now()}_${imageFile.name}`;
      const uploadPath = `uploads/${filename}`;
      await imageFile.mv(uploadPath);
      image = filename;
    }

    const student = await Student.create({
      name,
      age,
      class: className,
      gender,
      image,
    });

    res.status(201).json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Student creation failed' });
  }
};


export const getStudents = async (req, res) => {
  try {
    const { name = '', class: classQuery = '', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (classQuery) where.class = classQuery;

    const result = await Student.findAndCountAll({
      where,
      offset: parseInt(offset),
      limit: parseInt(limit),
    });

    // ✅ Add full image URL
    const studentsWithImageUrl = result.rows.map((s) => {
      const student = s.toJSON();
      if (student.image) {
        student.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${student.image}`;
      }
      return student;
    });

    res.json({
      data: studentsWithImageUrl,
      total: result.count,
      page: parseInt(page),
      pages: Math.ceil(result.count / limit),
    });
  } catch (err) {
    console.error('Error in getStudents:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, class: className, gender } = req.body;

    const student = await Student.findByPk(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    let image = student.image;
    if (req.files?.image) {
      const imageFile = req.files.image;
      const filename = `${Date.now()}_${imageFile.name}`;
      const uploadPath = `uploads/${filename}`;

      await imageFile.mv(uploadPath);
      image = filename;
    }

    await student.update({
      name,
      age,
      class: className,
      gender,
      image,
    });

    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Student update failed' });
  }
};


export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    await student.destroy();
    res.json({ message: 'Student deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete student' });
  }
};
