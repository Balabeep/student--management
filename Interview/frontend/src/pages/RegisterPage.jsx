import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('teacher');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', { name, email, password, role });
      alert('Registered successfully. Please log in.');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="row">
      <div className="offset-3 col-6 ">
        <form className='d-flex flex-column gap-3' onSubmit={handleSubmit}>
          <h2 className='text-center mt-5'>Register</h2>
          <input
            className='form-control border-3'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            required
          />
          <input
            className='form-control border-3'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <input
            className='form-control border-3'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
          />
          <select className='form-select border-3' value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
          <button className='btn btn-primary border-0 rounded-1' type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;