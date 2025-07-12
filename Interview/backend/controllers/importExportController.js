import xlsx from 'xlsx';
import { Student } from '../models/index.js';

export const exportStudents = async (req, res) => {
  const students = await Student.findAll();
  const data = students.map(s => s.toJSON());
  const worksheet = xlsx.utils.json_to_sheet(data);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Students');
  const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader('Content-Disposition', 'attachment; filename=students.xlsx');
  res.send(buffer);
};

export const importStudents = async (req, res) => {
  const file = req.files?.file;
  if (!file) return res.status(400).json({ message: 'No file uploaded' });

  const workbook = xlsx.read(file.data);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet);

  const inserted = [];
  for (const row of rows) {
    const exists = await Student.findOne({ where: { name: row.name, class: row.class } });
    if (!exists && row.name && row.class && row.gender) {
      const student = await Student.create(row);
      inserted.push(student);
    }
  }
  res.json({ inserted: inserted.length });
};
