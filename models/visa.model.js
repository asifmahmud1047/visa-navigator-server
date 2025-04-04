const mongoose = require('mongoose');

const visaSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    trim: true
  },
  countryImage: {
    type: String,
    required: true
  },
  visaType: {
    type: String,
    required: true,
    enum: ['Tourist visa', 'Student visa', 'Official visa', 'Business visa', 'Work visa']
  },
  processingTime: {
    type: String,
    required: true
  },
  requiredDocuments: [{
    type: String,
    required: true
  }],
  description: {
    type: String,
    required: true
  },
  ageRestriction: {
    type: Number,
    required: true
  },
  fee: {
    type: Number,
    required: true
  },
  validity: {
    type: String,
    required: true
  },
  applicationMethod: {
    type: String,
    required: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Visa', visaSchema); 