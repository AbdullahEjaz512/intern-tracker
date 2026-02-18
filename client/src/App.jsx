import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Keep your existing CSS

// Configure Base URL (Change to your deployed URL later, keep localhost for now)
const API_URL = 'http://localhost:5000/api/interns';

function App() {
  const [interns, setInterns] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', role: 'Frontend', status: 'Applied', score: '' });
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ role: '', status: '' });
  const [editingId, setEditingId] = useState(null); // Track which ID we are editing
  const [loading, setLoading] = useState(false);

  // Fetch Interns (with filters)
  const fetchInterns = async () => {
    setLoading(true);
    try {
      const params = { q: search, ...filters };
      const { data } = await axios.get(API_URL, { params });
      setInterns(data.data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, [search, filters]); // Re-run when search or filters change

  // Handle Form Submit (Create OR Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update Logic
        await axios.patch(`${API_URL}/${editingId}`, form);
        setEditingId(null); // Clear edit mode
      } else {
        // Create Logic
        await axios.post(API_URL, form);
      }
      setForm({ name: '', email: '', role: 'Frontend', status: 'Applied', score: '' }); // Reset form
      fetchInterns();
    } catch (error) {
      alert("Error saving intern. Check console for details.");
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    await axios.delete(`${API_URL}/${id}`);
    fetchInterns();
  };

  // Handle Edit Click
  const handleEdit = (intern) => {
    setForm({ 
      name: intern.name, 
      email: intern.email, 
      role: intern.role, 
      status: intern.status, 
      score: intern.score 
    });
    setEditingId(intern._id);
    // Scroll to top to see form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container">
      <h1>Intern Tracker</h1>

      {/* --- FORM SECTION --- */}
      <div className="card">
        <h2>{editingId ? 'Edit Intern' : 'Add New Intern'}</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <input 
            placeholder="Name" 
            value={form.name} 
            onChange={e => setForm({...form, name: e.target.value})} 
            required 
          />
          <input 
            placeholder="Email" 
            value={form.email} 
            onChange={e => setForm({...form, email: e.target.value})} 
            required 
            disabled={!!editingId} // Disable email edit if you want unique constraints
          />
          <input 
            type="number" 
            placeholder="Score (0-100)" 
            value={form.score} 
            onChange={e => setForm({...form, score: e.target.value})} 
            required 
            min="0" max="100"
          />
          <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Fullstack">Fullstack</option>
          </select>
          <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Hired">Hired</option>
            <option value="Rejected">Rejected</option>
          </select>
          
          <button type="submit" className={editingId ? 'btn-edit' : 'btn-add'}>
            {editingId ? 'Update Intern' : 'Add Intern'}
          </button>
          
          {editingId && (
            <button type="button" className="btn-cancel" onClick={() => {
              setEditingId(null);
              setForm({ name: '', email: '', role: 'Frontend', status: 'Applied', score: '' });
            }}>Cancel</button>
          )}
        </form>
      </div>

      {/* --- FILTERS & SEARCH --- */}
      <div className="controls">
        <input 
          placeholder="Search by name..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          className="search-bar"
        />
        
        <select onChange={e => setFilters({...filters, role: e.target.value})} className="filter">
          <option value="">All Roles</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="Fullstack">Fullstack</option>
        </select>

        <select onChange={e => setFilters({...filters, status: e.target.value})} className="filter">
          <option value="">All Statuses</option>
          <option value="Applied">Applied</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Hired">Hired</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* --- TABLE SECTION --- */}
      {loading ? <p>Loading...</p> : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Score</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {interns.map(intern => (
              <tr key={intern._id}>
                <td>{intern.name}</td>
                <td>{intern.email}</td>
                <td>{intern.role}</td>
                <td>
                  <span className={`status-badge ${intern.status.toLowerCase()}`}>
                    {intern.status}
                  </span>
                </td>
                <td>{intern.score}</td>
                <td className="actions">
                  <button className="btn-small edit" onClick={() => handleEdit(intern)}>Edit</button>
                  <button className="btn-small delete" onClick={() => handleDelete(intern._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;