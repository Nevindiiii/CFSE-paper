const Note = require('../models/Note');

const createNote = async (req, res, next) => {
  try {
    const note = await Note.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ createdBy: req.user._id })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    next(err);
  }
};

const getNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, createdBy: req.user._id })
      .populate('assignedTo', 'name email');
    if (!note) {
      res.status(404);
      return next(new Error('Note not found'));
    }
    res.json(note);
  } catch (err) {
    next(err);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!note) {
      res.status(404);
      return next(new Error('Note not found'));
    }
    res.json(note);
  } catch (err) {
    next(err);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!note) {
      res.status(404);
      return next(new Error('Note not found'));
    }
    res.json({ message: 'Note deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createNote, getNotes, getNote, updateNote, deleteNote };
