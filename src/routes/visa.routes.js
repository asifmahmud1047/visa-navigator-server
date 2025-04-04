const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Visa = require('../models/visa.model');
const auth = require('../middleware/auth.middleware');

// Get all visas with optional filtering
router.get('/', async (req, res) => {
  try {
    const { visaType, limit = 6 } = req.query;
    let query = {};

    if (visaType) {
      query.visaType = visaType;
    }

    const visas = await Visa.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('addedBy', 'name email photoURL');

    res.json(visas);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single visa
router.get('/:id', async (req, res) => {
  try {
    const visa = await Visa.findById(req.params.id)
      .populate('addedBy', 'name email photoURL');

    if (!visa) {
      return res.status(404).json({ message: 'Visa not found' });
    }

    res.json(visa);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new visa (protected route)
router.post('/',
  auth,
  [
    body('country').trim().notEmpty().withMessage('Country is required'),
    body('countryImage').isURL().withMessage('Please enter a valid image URL'),
    body('visaType').isIn(['Tourist visa', 'Student visa', 'Official visa', 'Business visa', 'Work visa'])
      .withMessage('Invalid visa type'),
    body('processingTime').trim().notEmpty().withMessage('Processing time is required'),
    body('requiredDocuments').isArray().withMessage('Required documents must be an array'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('ageRestriction').isInt({ min: 0 }).withMessage('Age restriction must be a positive number'),
    body('fee').isFloat({ min: 0 }).withMessage('Fee must be a positive number'),
    body('validity').trim().notEmpty().withMessage('Validity is required'),
    body('applicationMethod').trim().notEmpty().withMessage('Application method is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const visa = new Visa({
        ...req.body,
        addedBy: req.user._id
      });

      await visa.save();
      res.status(201).json(visa);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update visa (protected route)
router.put('/:id',
  auth,
  [
    body('country').optional().trim().notEmpty().withMessage('Country is required'),
    body('countryImage').optional().isURL().withMessage('Please enter a valid image URL'),
    body('visaType').optional().isIn(['Tourist visa', 'Student visa', 'Official visa', 'Business visa', 'Work visa'])
      .withMessage('Invalid visa type'),
    body('processingTime').optional().trim().notEmpty().withMessage('Processing time is required'),
    body('requiredDocuments').optional().isArray().withMessage('Required documents must be an array'),
    body('description').optional().trim().notEmpty().withMessage('Description is required'),
    body('ageRestriction').optional().isInt({ min: 0 }).withMessage('Age restriction must be a positive number'),
    body('fee').optional().isFloat({ min: 0 }).withMessage('Fee must be a positive number'),
    body('validity').optional().trim().notEmpty().withMessage('Validity is required'),
    body('applicationMethod').optional().trim().notEmpty().withMessage('Application method is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const visa = await Visa.findById(req.params.id);
      if (!visa) {
        return res.status(404).json({ message: 'Visa not found' });
      }

      // Check if user is the owner
      if (visa.addedBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this visa' });
      }

      Object.assign(visa, req.body);
      await visa.save();

      res.json(visa);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete visa (protected route)
router.delete('/:id', auth, async (req, res) => {
  try {
    const visa = await Visa.findById(req.params.id);
    if (!visa) {
      return res.status(404).json({ message: 'Visa not found' });
    }

    // Check if user is the owner
    if (visa.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this visa' });
    }

    await visa.remove();
    res.json({ message: 'Visa deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's added visas (protected route)
router.get('/user/visas', auth, async (req, res) => {
  try {
    const visas = await Visa.find({ addedBy: req.user._id })
      .sort({ createdAt: -1 });
    res.json(visas);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 