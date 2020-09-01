const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const Note = require('../models/Note');

// @desc Get Add Page
// @route GET /notes/add
router.get('/add', ensureAuth, (req, res) => {
  res.render('notes/add');
});

// @desc Add Form Working function - Add new note
// @route POST /notes
router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Note.create(req.body);
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
});

// @desc Get All Public Notes - "Shared with others"
// @route GET /notes/
router.get('/', ensureAuth, async (req, res) => {
  try {
    const notes = await Note.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean();

    res.render('notes/index', { notes });
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
});

module.exports = router;
