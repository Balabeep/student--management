
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { useSelector } from 'react-redux';

function EditStudentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isTeacher = user?.role === 'teacher';

  const [form, setForm] = useState({
    name: '',
    class: '',
    age: '',
    gender: '',
  });

  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await API.get(`/students`, { params: { id } });
        const student = res.data.data.find((s) => s.id === parseInt(id));
        if (student) {
          setForm({
            name: student.name,
            class: student.class,
            age: student.age,
            gender: student.gender ?? '',
          });
          if (student.imageUrl) {
            setExistingImage(student.imageUrl);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error('Failed to load student', err);
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('class', form.class);
    formData.append('age', form.age);
    formData.append('gender', form.gender);
    if (image) {
      formData.append('image', image);
    }

    try {
      await API.put(`/students/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Student updated!');
      navigate('/students');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update student');
    }
  };

  if (!isTeacher) {
    return <p className="text-center mt-5 text-danger">Access denied. Only teachers can edit students.</p>;
  }

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="row">
      <div className="offset-3 col-6">
        <form className="d-flex flex-column gap-3 mt-5" onSubmit={handleSubmit}>
          <h2 className="text-center">Edit Student</h2>

          <input
            className="form-control border-3"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            className="form-control border-3"
            name="class"
            placeholder="Class"
            value={form.class}
            onChange={handleChange}
            required
          />

          <input
            className="form-control border-3"
            name="age"
            type="number"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
            required
          />

          <select
            className="form-select border-3"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          {existingImage && (
            <div className="text-center">
              <p className="mb-1">Current Image:</p>
              <img
                src={existingImage}
                alt="Student"
                style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
              />
            </div>
          )}

          <input
            className="form-control border-3"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          <button className="btn btn-primary border-0 rounded-1 mt-2" type="submit">
            Update Student
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditStudentPage;
