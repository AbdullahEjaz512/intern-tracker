const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. DATABASE CONNECTION
// Replace with your MongoDB URI or local 'mongodb://localhost:27017/intern_tracker'
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/intern_tracker';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// 2. SCHEMA & MODEL
const internSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2 },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['Frontend', 'Backend', 'Fullstack'], required: true },
  status: { type: String, enum: ['Applied', 'Interviewing', 'Hired', 'Rejected'], default: 'Applied' },
  score: { type: Number, min: 0, max: 100, default: 0 }
}, { timestamps: true });

const Intern = mongoose.model('Intern', internSchema);

// 3. ROUTES

// Create Intern
app.post('/api/interns', async (req, res) => {
  try {
    const intern = new Intern(req.body);
    await intern.save();
    res.status(201).json(intern);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All (With Search & Filter)
app.get('/api/interns', async (req, res) => {
  try {
    const { q, role, status } = req.query;
    const query = {};
    
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ];
    }
    if (role) query.role = role;
    if (status) query.status = status;

    const interns = await Intern.find(query).sort({ createdAt: -1 });
    res.json(interns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Intern
app.patch('/api/interns/:id', async (req, res) => {
  try {
    const intern = await Intern.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!intern) return res.status(404).json({ message: 'Intern not found' });
    res.json(intern);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Intern
app.delete('/api/interns/:id', async (req, res) => {
  try {
    await Intern.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));