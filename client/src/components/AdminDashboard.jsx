import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Ensure you have axios installed, or use fetch

const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Fetch Issues on Load
  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming you store token here
      const res = await axios.get('http://localhost:5000/api/admin/issues', {
        headers: { 'x-auth-token': token }
      });
      setIssues(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch issues. Are you an Admin?');
      setLoading(false);
    }
  };

  // 2. Update Status
  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(`http://localhost:5000/api/admin/issues/${id}/status`, 
        { status: newStatus },
        { headers: { 'x-auth-token': token } }
      );
      
      // Update UI instantly
      setIssues(issues.map(issue => 
        issue._id === id ? { ...issue, status: res.data.status } : issue
      ));
    } catch (err) {
      alert('Error updating status');
    }
  };

  // 3. Delete Issue
  const deleteIssue = async (id) => {
    if(!window.confirm('Are you sure you want to delete this?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/issues/${id}`, {
        headers: { 'x-auth-token': token }
      });
      
      // Remove from UI
      setIssues(issues.filter(issue => issue._id !== id));
    } catch (err) {
      alert('Error deleting issue');
    }
  };

  if (loading) return <div>Loading Admin Panel...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;

  return (
    <div className="admin-container" style={{ padding: '20px' }}>
      <h2>Admin Dashboard - Civic Issue Reporter</h2>
      
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
            <th style={{ padding: '10px' }}>Issue Type</th>
            <th style={{ padding: '10px' }}>Description</th>
            <th style={{ padding: '10px' }}>Location</th>
            <th style={{ padding: '10px' }}>Status</th>
            <th style={{ padding: '10px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue._id}>
              <td style={{ padding: '10px' }}>{issue.type || 'General'}</td>
              <td style={{ padding: '10px' }}>{issue.description}</td>
              <td style={{ padding: '10px' }}>{issue.address || 'N/A'}</td>
              <td style={{ padding: '10px' }}>
                <span style={{ 
                  fontWeight: 'bold', 
                  color: issue.status === 'Resolved' ? 'green' : 'orange' 
                }}>
                  {issue.status || 'Pending'}
                </span>
              </td>
              <td style={{ padding: '10px' }}>
                {issue.status !== 'Resolved' && (
                  <button 
                    onClick={() => updateStatus(issue._id, 'Resolved')}
                    style={{ marginRight: '10px', background: 'green', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer' }}>
                    Mark Resolved
                  </button>
                )}
                <button 
                  onClick={() => deleteIssue(issue._id)}
                  style={{ background: 'red', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer' }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
