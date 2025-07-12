import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import StudentListPage from './pages/StudentListPage.jsx';
import CreateStudentPage from './pages/CreateStudentPage.jsx';
import ImportExportPage from './pages/ImportExportPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import EditStudentPage from './pages/EditStudentPage';
import PublicRoute from './components/PublicRoute.jsx';
function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />


        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }/>

        <Route path="/students" element={
          <ProtectedRoute>
            <StudentListPage />
          </ProtectedRoute>
        }/>

        <Route path="/students/new" element={
          <ProtectedRoute role="teacher">
            <CreateStudentPage />
          </ProtectedRoute>
        }/>

        <Route path="/import-export" element={
          <ProtectedRoute role="teacher">
            <ImportExportPage />
          </ProtectedRoute>
        }/>

        <Route path="/students/:id/edit" element={<EditStudentPage />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
