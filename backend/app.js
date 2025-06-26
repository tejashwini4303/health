const express = require('express'); // Import Express
const mongoose = require('mongoose'); // Import Mongoose
const Patient = require('./models/Patient');  // Adjust the path to your Patient model

const app = express(); // Define app as an Express instance
require('dotenv').config(); // Load environment variables

// Middleware to parse incoming JSON requests
app.use(express.json());

const cors = require('cors');
app.use(cors());

// Connect to MongoDB using the URI from the .env file
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// POST route to add a new patient
app.post('/add-patient', async (req, res) => {
  try {
    const newPatient = new Patient(req.body);
    await newPatient.save();
    console.log('New patient saved:', newPatient);
    res.status(201).send({
      message: 'Patient added successfully',
      patient: newPatient
    });
  } catch (error) {
    console.error('Error adding patient:', error);
    res.status(400).send({
      message: 'Error adding patient',
      error: error.message
    });
  }
});

// GET all patients
app.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a patient by ID
app.delete('/patients/:id', async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE a patient by ID
app.put('/patients/:id', async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ message: 'Patient updated successfully', patient: updatedPatient });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
