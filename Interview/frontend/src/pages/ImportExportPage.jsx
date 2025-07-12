
import React, { useRef } from 'react';
import API from '../api.js';

function ImportExportPage() {
  const fileRef = useRef();

  const handleExport = async () => {
    try {
      const res = await API.get('/importExport/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'students.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Export failed');
    }
  };

  const handleImport = async () => {
    if (!fileRef.current.files[0]) {
      return alert('Please select a file first.');
    }

    const formData = new FormData();
    formData.append('file', fileRef.current.files[0]);

    try {
      await API.post('/importExport/import', formData);
      alert('Import successful');
      fileRef.current.value = ''; // Clear input
    } catch (err) {
      alert(err.response?.data?.message || 'Import failed');
    }
  };

  return (
    <div className="row">
      <div className="offset-3 col-6 mt-5">
        <div className="card shadow-lg p-4">
          <h3 className="text-center mb-4">📂 Import / Export Students</h3>

          <div className="d-flex flex-column gap-3">
            {/* Export Button */}
            <button className="btn btn-success border-0 rounded-1" onClick={handleExport}>
              ⬇️ Export Students (.xlsx)
            </button>

            {/* File Input */}
            <input
              className="form-control border-3"
              type="file"
              ref={fileRef}
              accept=".xlsx, .xls"
            />

            {/* Import Button */}
            <button className="btn btn-primary border-0 rounded-1" onClick={handleImport}>
              ⬆️ Import Students
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImportExportPage;
