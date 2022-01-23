//------------------------------------------------------------------------------
//-- Globals

//-- variables used to hold HTML Elements

let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

//-- If eu is on the `/notes`, store HTML elements in the above variables
if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
}

//------------------------------------------------------------------------------
//-- General functions used to simplify element style management

// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

//------------------------------------------------------------------------------
//-- Get the notes database from servers.js, expecting JSON of database as results

const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
  },
});

//----------------------------------------------/-------------------------------
//-- Set a note into the database by sending note into server.js

const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
  },
  body: JSON.stringify(note),
});

//------------------------------------------------------------------------------
//-- Delete a note from the database based on ID by sending id value to server.js

const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

//------------------------------------------------------------------------------
//-- When a note is clicked on the left column, open in center.

const renderActiveNote = () => {
  hide(saveNoteBtn);

  if (activeNote.id) {
    //-- TODO:: 01/23/2022 #EP || Ability to edit a note.
    // noteTitle.setAttribute('readonly', true);
    // noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

//------------------------------------------------------------------------------
//-- When SAVE is clicked, manages request to save note to database.

const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

//------------------------------------------------------------------------------
//-- When DELETE is clicked on the note, manages request to delete note from database.

// Delete the clicked note
const handleNoteDelete = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  //-- If the note is opened on right column, remove it as the active note.
  if (activeNote.id === noteId) {
    activeNote = {};
  }

  //-- Make the DELETE request, by sending noteId to server.js
  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

//------------------------------------------------------------------------------
//-- When note selected in left column, set as Active note and appears on right

const handleNoteView = (e) => {
  
  //-- Prevent env from performing default actions
  e.preventDefault();

  //-- Extracting data from LI element in left column (existing notes)
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  
  //-- Update right column, active note, with details from note LI
  renderActiveNote();
};

//------------------------------------------------------------------------------
// Sets the activeNote to and empty object and allows the user to enter a new note

const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

//------------------------------------------------------------------------------
// Listening for when a Note can be saved. That means defaults/blank fields changed

const handleRenderSaveBtn = () => {

  //-- If content in title or text, show save btn or hide ( excluding spaces )
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

//------------------------------------------------------------------------------
// Render the list of existing notes with title and delete icon in left column.

const renderNoteList = async (notes) => {
  
  //-- wait to convert notes into JSON, preparing to update HTML
  let jsonNotes = await notes.json();

  //-- if on the notes page, clear out list to prepare to rebuild
  if (window.location.pathname === '/notes') {
    noteList.forEach((el) => ( el.innerHTML = ''));
  }
  
  //-- array to hold list of notes
  let noteListItems = [];

  //-- Takes title text, Returns built LI element with delete button
  /* !! Delcared here, called below !! */
  const createLi = (text, delBtn = true) => {

    //-- Create a list element and add reqs
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    //-- build span to note title inside of above li with proper reqs
    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;

    //-- Add click listener for if EU clicks on note to view in right column
    spanEl.addEventListener('click', handleNoteView);

    //-- Add span inside of li
    liEl.append(spanEl);

    //-- Create delete button ele with reqs
    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      //-- add listener to call delete note 
      delBtnEl.addEventListener('click', handleNoteDelete);

      //-- Add to above defined li after the title.
      liEl.append(delBtnEl);
    }
    
    //-- returns LI used for left bar.
    return liEl;
  };

  //-- If there are NO notes, create li ele in existing notes col without delete
  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  //-- If there are notes, loop through EACH one and build notes col.
  jsonNotes.forEach((note) => {
    
    //-- Create list element of specific note with title
    const li = createLi(note.title);
    
    //-- Add to dataset holding all notes
    li.dataset.note = JSON.stringify(note);

    //-- add to array that will be used to update HTML notes col.
    noteListItems.push(li);
  });
  
  //-- IF the user is on the proper path, update page with all notes in noteListItems
  if (window.location.pathname === '/notes') {
    
    //-- For each li in noteListItems, add to noteList ( html container on left col )
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

//------------------------------------------------------------------------------
//-- Gets notes from the db and renders them to the notes col sidebar


const getAndRenderNotes = () => {
  
  //-- Get all notes in database
  getNotes()
  //-- Build notes col sidebar with results
 .then(renderNoteList);
}

//------------------------------------------------------------------------------
//-- Add Event Listners if on notes editing page.

if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
}

//------------------------------------------------------------------------------
//-- RUN primary function

getAndRenderNotes();
