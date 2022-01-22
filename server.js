//------------------------------------------------------------------------------
//-- IMPORTS

//-- onboard express.js server
const express = require('express');

//------------------------------------------------------------------------------
//-- 

//-- define port
const PORT = process.env.PORT || 3001;

//-- create instance
const app = express();

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

// Use apiRoutes
// app.use('/api', apiRoutes);
// app.use('/', htmlRoutes);

const path = require('path');
const notes = require('./db/notes.json');
app.get('/note', (req, res) => res.json(notes));


//------------------------------------------------------------------------------
//-- Starting express server and telling it to stay open / listen for traffic

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}. http://127.0.0.1:${PORT}/`);
});
