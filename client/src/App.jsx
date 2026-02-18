import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Base URL for your Backend
const API_URL = 'http://localhost:5000/api/interns';

function App() {
  const [interns, setInterns] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'Frontend',
    status: 'Applied',
    score: ''
  });

  // Fetch Interns (Load data on start)
  useEffect(() => {
    fetchInterns();
  }, []);

  const fetchInterns = async () => {
    try {
      const res = await axios.get(`${API_URL}?q=${search}`);
      setInterns(res.data);
    } catch (err) {
      console.error("Error fetching interns:", err);
    }
  };

  // Handle Form Submit (Create Intern)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, form);
      alert('Intern Added!');
      setForm({ name: '', email: '', role: 'Frontend', status: 'Applied', score: '' }); // Reset form
      fetchInterns(); // Refresh list
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this intern?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchInterns();
      } catch (err) {
        alert('Error deleting');
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Intern Tracker</h1>

      {/* --- ADD INTERN FORM --- */}
      <div style={{ background: '#f4f4f4', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Add New Intern</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          <input 
            placeholder="Name" 
            value={form.name} 
            onChange={e => setForm({...form, name: e.target.value})} 
            required 
            style={{ padding: '8px' }}
          />
          <input 
            placeholder="Email" 
            type="email" 
            value={form.email} 
            onChange={e => setForm({...form, email: e.target.value})} 
            required 
            style={{ padding: '8px' }}
          />
          <input 
            placeholder="Score (0-100)" 
            type="number" 
            value={form.score} 
            onChange={e => setForm({...form, score: e.target.value})} 
            required 
            style={{ padding: '8px' }}
          />
          <select 
            value={form.role} 
            onChange={e => setForm({...form, role: e.target.value})} 
            style={{ padding: '8px' }}
          >
            <option>Frontend</option>
            <option>Backend</option>
            <option>Fullstack</option>
          </select>
          <select 
            value={form.status} 
            onChange={e => setForm({...form, status: e.target.value})} 
            style={{ padding: '8px' }}
          >
            <option>Applied</option>
            <option>Interviewing</option>
            <option>Hired</option>
            <option>Rejected</option>
          </select>
          <button type="submit" style={{ background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}>
            Add Intern
          </button>
        </form>
      </div>

      {/* --- SEARCH & LIST --- */}
      <div style={{ marginBottom: '10px' }}>
        <input 
          placeholder="Search by name..." 
          value={search} 
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '8px', width: '300px', marginRight: '10px' }}
        />
        <button onClick={fetchInterns} style={{ padding: '8px' }}>Search</button>
      </div>

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Score</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {interns.map((intern) => (
            <tr key={intern._id}>
              <td>{intern.name}</td>
              <td>{intern.email}</td>
              <td>{intern.role}</td>
              <td>{intern.status}</td>
              <td>{intern.score}</td>
              <td>
                <button 
                  onClick={() => handleDelete(intern._id)} 
                  style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;