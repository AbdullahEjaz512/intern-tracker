const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- 1. CORS CONFIGURATION (THE FIX) ---
// This allows your frontend (both local and Vercel) to talk to this backend
app.use(cors({
    origin: "*", // Allow ANY website to connect (Fixes the error guaranteed)
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true
}));

app.use(express.json());

// --- 2. DATABASE CONNECTION ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/intern_tracker';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    // process.exit(1); // Optional: Exit if DB fails, but Vercel handles restarts
  });

// --- 3. SCHEMA & MODEL ---
const internSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2 },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['Frontend', 'Backend', 'Fullstack'], required: true },
  status: { type: String, enum: ['Applied', 'Interviewing', 'Hired', 'Rejected'], default: 'Applied' },
  score: { type: Number, min: 0, max: 100, default: 0 }
}, { timestamps: true });

const Intern = mongoose.model('Intern', internSchema);

// --- 4. ROUTES ---

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

// UPDATE Intern
app.patch('/api/interns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Check if ID is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Intern not found" });
    }

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
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Intern not found" });
    }
    await Intern.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Root Route (Just to check if API is running)
app.get('/', (req, res) => {
    res.send('Intern Tracker API is Running');
});

const PORT = process.env.PORT || 5000;
// Remove or comment out this line:
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// ADD THIS INSTEAD:
module.exports = app;