

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  // ✅ Redirect if already logged in (move this into useEffect)
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      dispatch(loginSuccess(res.data)); // assuming res.data = { user, token }
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      alert('Invalid email or password');
    }
  };

return (
  <div className='row'>
    <div className="offset-3 col-6 d-flex flex-column gap-3">
      <h2 className='text-center mt-5'>Login</h2>
      <form className='d-flex flex-column gap-3' onSubmit={handleSubmit}>
        <input
          className='form-control border-3'
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          className='form-control border-3'
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button className='btn btn-primary border-0 rounded-1' type="submit">Login</button>
      </form>
      <p>Don't have an account? <a href="/register">Register</a></p>
    </div>
  </div>
);

}

export default LoginPage;
