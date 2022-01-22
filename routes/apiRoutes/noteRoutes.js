//-- use existing express app
const router = require('express').Router();

//-- define what can be imported
const { findById, setNotes, validateNote } = require('../../lib/notes');
// //-- import notes data
const { notes } = require('../../db/notes');

router.get('/note', (req, res) => {
  let results = notes;
  // if (req.query) {
  //   results = filterByQuery(req.query, results);
  // }
  
  res.json("results");
});

// router.get('/notes/:id', (req, res) => {
//   const result = findById(req.params.id, notes);
//   if (result) {
//     res.json(result);
//   } else {
//     res.send(404);
//   }
// });

// router.post('/notes', (req, res) => {
//   // set id based on what the next index of the array will be
//   req.body.id = animals.length.toString();

//   if (!validateNote(req.body)) {
//     res.status(400).send('The animal is not properly formatted.');
//   } else {
//     const note = setNote(req.body, notes);
//     res.json(note);
//   }
// });

module.exports = router;
