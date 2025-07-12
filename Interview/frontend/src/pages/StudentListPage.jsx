
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import useDebounce from '../hooks/useDebounce';

function StudentListPage() {
  const [search, setSearch] = React.useState('');
  const [classFilter, setClassFilter] = React.useState('');
  const [page, setPage] = React.useState(1);

  const debouncedSearch = useDebounce(search, 500);
  const debouncedClassFilter = useDebounce(classFilter, 500);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isTeacher = user?.role === 'teacher';

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['students', debouncedSearch, debouncedClassFilter, page],
    queryFn: async () => {
      const res = await API.get('/students', {
        params: { name: debouncedSearch, class: debouncedClassFilter, page },
      });
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => API.delete(`/students/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['students']),
  });

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleClassChange = (e) => setClassFilter(e.target.value);

  return (
    <div className="row w-100">
      <div className='mt-4 offset-1 col-10 d-flex flex-column align-items-center'>
        <h2>Student List</h2>

        {isTeacher && (
          <button className='btn btn-warning mb-3' onClick={() => navigate('/students/new')}>
            ➕ Add Student
          </button>
        )}

        {/* Search + Filter Form */}
        <div className='d-flex gap-2 w-100 mb-3'>
          <input
            className='form-control border-3'
            placeholder="Search name"
            value={search}
            onChange={handleSearchChange}
          />
          <input
            className='form-control border-3'
            placeholder="Filter class"
            value={classFilter}
            onChange={handleClassChange}
          />
        </div>

        {isLoading && <div>Loading...</div>}
        {isError && <div>Error: {error.message}</div>}

        {!isLoading && !isError && (
          <>
            <div className="table-responsive w-100">
              <table className="table table-bordered table-hover">
                <thead className="table-dark text-center">
                  <tr>
                    <th>S.No</th>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Class</th>
                    <th>Age</th>
                    {isTeacher && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody className="text-center">
                  {data.data.map((s, index) => (
                    <tr key={s.id}>
                      <td>{(page - 1) * 10 + index + 1}</td>
                      <td>
                        {s.imageUrl ? (
                          <img
                            src={s.imageUrl}
                            alt={s.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                          />
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td>{s.name}</td>
                      <td>{s.class}</td>
                      <td>{s.age}</td>
                      {isTeacher && (
                        <td>
                          <button
                            className="btn btn-sm btn-info me-2"
                            onClick={() => navigate(`/students/${s.id}/edit`)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => deleteMutation.mutate(s.id)}
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-3 d-flex justify-content-center align-items-center gap-2">
              <button className="btn btn-secondary" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
                Prev
              </button>
              <span>Page {page} of {data.pages}</span>
              <button className="btn btn-secondary" onClick={() => setPage((p) => p + 1)} disabled={page >= data.pages}>
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StudentListPage;
