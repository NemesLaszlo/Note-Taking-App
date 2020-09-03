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

// @desc Get Edit Page
// @route GET /notes/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
    }).lean();

    if (!note) {
      return res.render('error/404');
    }

    if (note.user != req.user.id) {
      res.redirect('/notes');
    } else {
      res.render('notes/edit', {
        note,
      });
    }
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
});

// @desc Edit Form Working function - Update note
// @route PUT /notes/:id
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id).lean();

    if (!note) {
      return res.render('error/404');
    }

    if (note.user != req.user.id) {
      res.redirect('/notes');
    } else {
      note = await Note.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });
      res.redirect('/dashboard');
    }
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
});

// @desc Delete note
// @route DELETE /notes/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id).lean();

    if (!note) {
      return res.render('error/404');
    }

    if (note.user != req.user.id) {
      res.redirect('/notes');
    } else {
      await Note.remove({ _id: req.params.id });
      res.redirect('/dashboard');
    }
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
});

module.exports = router;
