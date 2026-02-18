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
// GET Interns with Filters & Pagination
app.get('/api/interns', async (req, res) => {
  try {
    const { q, role, status, page = 1, limit = 10 } = req.query;
    const query = {};

    // Search logic (Name or Email)
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ];
    }

    // Filter logic
    if (role) query.role = role;
    if (status) query.status = status;

    const interns = await Intern.find(query)
      .sort({ createdAt: -1 }) // Newest first
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Intern.countDocuments(query);

    res.json({
      data: interns,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE Intern (The missing feature!)
app.patch('/api/interns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedIntern = await Intern.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedIntern) return res.status(404).json({ error: "Intern not found" });
    res.json(updatedIntern);
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