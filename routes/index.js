const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const Note = require('../models/Note');

// @desc Login / Landing Page
// @route GET /
router.get('/', ensureGuest, (req, res) => {
  res.render('login', { layout: 'login' });
});

// @desc Dashboard
// @route GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).lean();
    res.render('dashboard', { name: req.user.firstName, notes });
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
});

module.exports = router;
