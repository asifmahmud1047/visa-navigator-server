const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  visa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Visa',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  fee: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema); 