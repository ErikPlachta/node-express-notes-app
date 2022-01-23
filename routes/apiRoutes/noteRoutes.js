//-- use existing express app
const router = require('express').Router();

//-- define what can be imported
// const { findById, setNotes, validateNote } = require('../../lib/notes');

// //-- import notes data
const notes = require('../../db/notes.json');


// router.get('/notes', (req, res) => res.json(notes));
router.get('/notes', (req, res) => res.json(notes));


module.exports = router;
