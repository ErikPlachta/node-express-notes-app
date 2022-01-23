const fs = require('fs');
const path = require('path');


function findById(id, notesArray) {
  const result = notesArray.filter(note => note.id === id)[0];
  return result;
}

function setNote(body, notesArray) {
  const note = body;
  notesArray.push(note);
  fs.writeFileSync(
    path.join(__dirname, '../db/notes.json'),
    JSON.stringify({ notesArray }, null, 2)
  );
  return note;
}

//-- make sure note has a title at least
function validateNote(note) {
  if (!note.title || typeof note.name !== 'string') {
    return false;
  }
  return true;
}

module.exports = {
  findById,
  setNote,
  validateNote
};
