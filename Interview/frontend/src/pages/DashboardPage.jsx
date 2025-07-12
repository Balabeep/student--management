
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import API from '../api.js';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice'; // 👈 make sure this path is correct
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

// const COLORS = ['#0088FE', '#FF8042'];
const GENDER_COLORS = {
  male: '#0088FE',    // blue
  female: '#FF69B4',  // pink
  other: '#AAAAAA',   // optional if you support more
};


function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await API.get('/analytics');
      return res.data;
    },
  });

  const handleLogout = () => {
    dispatch(logout()); // remove user from store
    navigate('/login'); // redirect to login page
  };

  if (!data) return 'Loading...';

  return (
    <div className="row w-100">
      <div className='mt-4 offset-2 col-8  border border-3 d-flex flex-column '>
        <div  className='d-flex gap-3 mt-3 justify-content-between'>
          <h2 className='m-0'>Total Students: {data.total}</h2>
          <div className='d-lg-flex gap-3  d-none'>
            <button className='btn btn-warning border-0 rounded-1' onClick={() => navigate('/students')}>📋 View Students</button>
            <button className='btn btn-primary border-0 rounded-1' onClick={() => navigate('/import-export')}>📂 Import / Export</button>
          </div>
          <button className='btn btn-danger border-0 rounded-1'  onClick={handleLogout} >
            🔓 Logout
          </button>
        </div>
        <div className='d-flex d-lg-none gap-3 mt-4 justify-content-center'>
          <button  className='btn btn-warning border-0 rounded-1' onClick={() => navigate('/students')}>📋 View Students</button>
          <button className='btn btn-primary border-0 rounded-1'  onClick={() => navigate('/import-export')}>📂 Import / Export</button>
        </div>
        <div className="row w-100">
          <div className="col-12 col-lg-6">
            <div className='d-flex flex-column align-items-center'>
              <h3 className='mt-4'>Students per Class</h3>
              <BarChart width={300} height={200} data={data.perClass}>
                <XAxis dataKey="class" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className='d-flex flex-column align-items-center'>
              <h3 className='mt-4'>Gender Ratio</h3>
              <PieChart width={300} height={250}>
              <Pie
                data={data.gender}
                dataKey="count"
                nameKey="gender"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name }) => name}
              >
                {data.gender.map((entry, i) => (
                  <Cell
                    key={`cell-${i}`}
                    fill={GENDER_COLORS[entry.gender.toLowerCase()] || '#cccccc'}
                  />
                ))}
              </Pie>

                <Tooltip />
              </PieChart>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
                {data.gender.map((entry, i) => {
                  const color = GENDER_COLORS[entry.gender.toLowerCase()] || '#cccccc';
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                      <div
                        style={{
                          width: '15px',
                          height: '15px',
                          backgroundColor: color,
                          marginRight: '5px',
                          borderRadius: '50%',
                        }}
                      />
                      <span>{entry.gender}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}

export default DashboardPage;
