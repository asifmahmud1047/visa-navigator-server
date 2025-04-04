const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Application = require('../models/application.model');
const Visa = require('../models/visa.model');
const auth = require('../middleware/auth.middleware');

// Apply for a visa (protected route)
router.post('/',
  auth,
  [
    body('visaId').notEmpty().withMessage('Visa ID is required'),
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Please enter a valid email')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { visaId, firstName, lastName, email } = req.body;

      // Check if visa exists
      const visa = await Visa.findById(visaId);
      if (!visa) {
        return res.status(404).json({ message: 'Visa not found' });
      }

      // Check if user has already applied
      const existingApplication = await Application.findOne({
        visa: visaId,
        applicant: req.user._id
      });

      if (existingApplication) {
        return res.status(400).json({ message: 'You have already applied for this visa' });
      }

      const application = new Application({
        visa: visaId,
        applicant: req.user._id,
        firstName,
        lastName,
        email,
        fee: visa.fee
      });

      await application.save();
      res.status(201).json(application);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get user's applications (protected route)
router.get('/my-applications', auth, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('visa')
      .sort({ appliedDate: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel application (protected route)
router.delete('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is the applicant
    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this application' });
    }

    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: 'Application cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Search applications by country (protected route)
router.get('/search', auth, async (req, res) => {
  try {
    const { country } = req.query;
    if (!country) {
      return res.status(400).json({ message: 'Country parameter is required' });
    }

    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: 'visa',
        match: { country: { $regex: country, $options: 'i' } }
      })
      .sort({ appliedDate: -1 });

    // Filter out applications where visa is null (no match)
    const filteredApplications = applications.filter(app => app.visa !== null);

    res.json(filteredApplications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 