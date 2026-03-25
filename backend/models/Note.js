const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  status:      { type: String, enum: ['pending', 'in-progress', 'done'], default: 'pending' },
  image:       { type: String, default: '' },
  dueDate:     { type: Date },
  assignedTo:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
