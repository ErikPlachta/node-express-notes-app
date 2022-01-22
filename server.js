//------------------------------------------------------------------------------
//-- Setting up express

//-- onboard express.js server
const express = require('express');
//-- define port
const PORT = process.env.PORT || 3001;
//-- create instance
const app = express();

//-- Required to push to a HTML
const path = require('path');


// Helper method for generating unique ids
const uuid = require('./helpers/uuid');

//------------------------------------------------------------------------------
//-- Route definitions
const apiRoutes = require('./routes/apiRoutes');
// const htmlRoutes = require('./routes/htmlRoutes');

//------------------------------------------------------------------------------
//-- Ability to use JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//------------------------------------------------------------------------------
//-- Defining path to public content
app.use(express.static('public'));

//------------------------------------------------------------------------------
//-- Defining Routes


//------
//-- API

//-- getting notes
app.get('/api/notes', (req, res) => {
  const notes = require('./db/notes.json');
  res.json(notes);
});

//-- setting notes
app.post('/api/notes', (req, res) => {

  console.info(`${req.method} request received to add a note.`);


  //-- Extract payload
  const { title, body } = req.body;
  
  if (title && body) {
    const newNote = {
      title,
      body,
      note_ID: uuid(),
    }

    const response = {
      status: 'success',
      body: newNote,
    };

    //-- Testing a response here
    console.log(response);

    res.json(response);
  }
  else {
    //-- If it receives a bad payload, to client
    res.json(`Error in posting review: ${JSON.stringify(req.body)}`);
  }

});


// app.use('/api', apiRoutes);
// // app.use('/', htmlRoutes);


app.get('/test', (reg, res) => res.status(200).send("Local response from server.js successful."));

//-- Testing to verify direct routing works, here.
// const path = require('path');

//-- to get a JSON database
// const notes = require('./db/notes.json');
// app.get('/notes', (req, res) => res.json(notes));



//-------
//-- HTML 

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

//-- bad path, go to index
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});



//------------------------------------------------------------------------------
//-- Starting express server and telling it to stay open / listen for traffic

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}. http://127.0.0.1:${PORT}/`);
});
