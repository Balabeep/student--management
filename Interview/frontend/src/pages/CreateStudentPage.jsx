
import React, { useState } from 'react';
import API from '../api.js';
import { useNavigate } from 'react-router-dom';

function CreateStudentPage() {
  const [form, setForm] = useState({
    name: '',
    class: '',
    age: '',
    gender: 'male',
    image: null,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((f) => ({ ...f, [name]: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', form.name);
    data.append('class', form.class);
    data.append('age', form.age);
    data.append('gender', form.gender);
    if (form.image) {
      data.append('image', form.image);
    }

    try {
      await API.post('/students', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Student created!');
      navigate('/students');
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating student');
    }
  };

  return (
    <div className="row">
      <div className="offset-3 col-6">
        <form className="d-flex flex-column gap-3 mt-5" onSubmit={handleSubmit}>
          <h2 className="text-center">Add Student</h2>

          <input
            className="form-control border-3"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Student Name"
            required
          />

          <input
            className="form-control border-3"
            name="class"
            value={form.class}
            onChange={handleChange}
            placeholder="Class"
            required
          />

          <input
            className="form-control border-3"
            name="age"
            type="number"
            value={form.age}
            onChange={handleChange}
            placeholder="Age"
            required
          />

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="form-select border-3"
            required
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <input
            className="form-control border-3"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />

          <button className="btn btn-success border-0 rounded-1" type="submit">
            Create Student
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateStudentPage;
