const express = require('express');
const protect = require('../middleware/protect');
const { createNote, getNotes, getNote, updateNote, deleteNote } = require('../controllers/noteController');

const router = express.Router();

router.use(protect);

router.route('/').get(getNotes).post(createNote);
router.route('/:id').get(getNote).put(updateNote).delete(deleteNote);

module.exports = router;
