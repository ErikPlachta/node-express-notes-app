//------------------------------------------------------------------------------
//-- Setting up express

//-- onboard express.js server
const express = require('express');

//-- define port locally or based on env
const PORT = process.env.PORT || 3001;
//-- create instance
const app = express();

//-- Required to push to a HTML
const path = require('path');

//-- to write note to database
const fs = require('fs');

// Helper method for generating unique ids
const uuid = require('./helpers/uuid');

//------------------------------------------------------------------------------
//-- Route definitions
// const apiRoutes = require('./routes/apiRoutes');
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


//---------------------------------
//-- API Routes

const db_Path = './db/db.json'; 

//-- Try to import the database. If it d oesn't exist, build it.
try {
  
  //-- notes database location
  const notes = require('./db/db.json');

}
//-- It doesn't exist, build it
catch (e) {
  console.info(`//-- ERROR: ${e}\n//-- Database ${db_Path} does not exist. Creating new database at ${db_Path}...`);
  
    //-- Get date
    var d = new Date(); 
    
    const db_Default = [
      {

        "title" : `New Database Created ${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`,
        "text" : `Database did not exist or was corrupt. Created a new database on ${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()} at ${d.getMinutes()}:${d.getSeconds()}:${d.getMilliseconds()}.`,
        "id" : uuid()
      }
    ];
    
    fs.writeFile(db_Path, JSON.stringify(db_Default, null, 4), function(err){
      //-- if error, exit
      if (e) {
        console.error(`//-- ERROR: ${e}\n//-- Unable to create new database. See admin.`)
        throw e;
      }
      //-- otherwise log
      console.info(`//-- Success. New blank database created: ${db_Path} `);
    });
}




//-- getting notes
app.get('/api/notes', (req, res) =>  {
  fs.readFile('./db/db.json', function (err, data) {

    //-- exit if errors
    if (err) throw err;
    res.json(JSON.parse(data))
  });
});


//-- setting note into database
app.post('/api/notes', (req, res) => {

  console.info(`${req.method} request received to add a note.`);


  //-- Extract payload
  const { title, text } = req.body;
  
  //-- Info log for awareness during testing and database logs
  console.info(`//-- Received new note: ${JSON.stringify(req.body)}`);
  
  //--Creating var to hold response 
  let response = {};
  
  //-- If the note has a title and text, open the database and then write to database.
  if (title && text) {

    //-- Build note obj with UID to be written to database
    const newNote = {
      title,
      text,
      id: uuid(),
    }
    
    //-- Build response to send back to client containing note in standard GET response formatting
    response = {
      status: 'success',
      body: JSON.stringify(newNote),
    };
    
    
    //-- Open database, and append new note to it if able to open.
    fs.readFile('./db/db.json', function (err, data) {

      //-- exit if errors
      if (err) {

        response.status = '//-- ERROR: Failed to open database.'
        throw err;
      }
      //-- Else 
      //-- Attempt to add new note to database
      
      //-- grab database and convert to JSON
      var database_New = JSON.parse(data);
      
      //-- Add new note to database
      database_New.push(newNote); 
      
      // TODO:: 01/22/2022 #EP || Verify if UID already exists or not. 
      
      //-- Overwrite existing database with database_New, which contains new note.
      fs.writeFile("db/db.json", JSON.stringify(database_New, null, 4), function(err){
        
        //-- if error, don't try to write.
        if (err) throw err;
        
        //-- otherwise log
        console.info('//-- SUCCESS. The new note was added to database.');
      });
    });
    
    //-- send response back to HTML POST request
    res.json(response);
  }
  
  //-- Payload does not match requrirements, responding with error and what was sent in.
  else {
    res.json(`//-- ERROR: Unable to save new note: ${JSON.stringify(req.body)}`);
  }

});


//-- Ran a delete request is made from `./public/assets/js/index.js deleteNote(id)
app.delete('/api/notes/:id', (req, res) => {

  const { id } = req.params;
  // console.info(req);
  if(id){
    console.info(`//-- ${req.method} request received to /api/notes/:id for note ${id}.`);

    //-- Grab database
    fs.readFile('./db/db.json', function (err, data) {

      //-- exit if errors
      if (err) throw err;
      
      //-- ELSE
      /*
        Remove deleted note from database, by making a new array and overwrite
        without note with provided id.
      */

      //-- 
      var database_Old = JSON.parse(data);
      var datbase_New = [];

      for (note in database_Old){
        
        let id_Holder = database_Old[note].id;
        
        //-- if not the selected, add to database to prepare to overwrite
        if (id_Holder != id){
          // json.splice(note,0);
          datbase_New.push(database_Old[note])
          
        };
      };

      //-- update database with new 
      fs.writeFile("db/db.json", JSON.stringify(datbase_New, null, 4), function(err){
        //-- if error, exit
        if (err) throw err;
        
        //-- otherwise log
        console.info(`//-- The note with id: ${id} has been removed from the database.`);
        res.json(`The note with id: ${id} has been removed from the database.`);

        res.me
      });
    });
  }

});


//-- TODO:: 01/23/2022 #EP || Add routes vs direct in server.js

// app.use('/api', apiRoutes);
// // app.use('/', htmlRoutes);

//-- Testing to verify direct routing works, here.
// const path = require('path');

//-- to get a JSON database
// const notes = require('./db/db.json');
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
  console.info(`\n//-- API server now on port ${PORT}. http://127.0.0.1:${PORT}/\n`);
});
