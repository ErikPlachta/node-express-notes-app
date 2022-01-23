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


//------
//-- API

//-- notes database location
const notes = require('./db/db.json');
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
  console.log(req.body);
  let response = {};
  
  if (title && text) {
    
    
    //-- check database
    fs.readFile('./db/db.json', function (err, data) {

      //-- exit if errors
      if (err) throw err;
      
      //-- otherwise itterate thru database
      // TODO:: 01/22/2022 #EP || Verify if UID already exists or not.

      //-- prepare to write new entry
      const newNote = {
        title,
        text,
        id: uuid(),
      }
  
      response = {
        status: 'success',
        body: JSON.stringify(newNote),
      };
  
      //-- Testing a response here
      // console.log(`Received post response: ${newNote}`);
    
      // console.log(`Received payload: ${data}`)
      var json = JSON.parse(data);
      json.push(newNote); 
      fs.writeFile("db/db.json", JSON.stringify(json, null, 4), function(err){
        //-- if error, exit
        if (err) throw err;
        
        //-- otherwise log
        console.log('The "data to append" was appended to file!');
      });
    });


    
    //-- send response back to request
    res.json(response);
  }
  else {
    //-- If it receives a bad payload, to client
    res.json(`Error in posting review: ${JSON.stringify(req.body)}`);
  }

});



app.delete('/api/notes/:id', (req, res) => {

  const { id } = req.params;
  // console.info(req);
  if(id){
    console.info(`${req.method} request received to /api/notes/:id for note ${id}.`);

    //-- Grab database
    fs.readFile('./db/db.json', function (err, data) {

      //-- exit if errors
      if (err) throw err;

      //-- otherwise, pull ID out of array
      // console.log(`Received payload: ${data}`)
      var json = JSON.parse(data);
      var datbase_New = [];

      for (note in json){
        
        let id_Holder = json[note].id;
        
        //-- if not the selected, add to database to prepare to overwrite
        if (id_Holder != id){
          // json.splice(note,0);
          datbase_New.push(json[note])
          
        };
      };

      //-- update database with new 
      fs.writeFile("db/db.json", JSON.stringify(datbase_New, null, 4), function(err){
        //-- if error, exit
        if (err) throw err;
        
        //-- otherwise log
        console.log('The "data to append" was appended to file!');
      });
    });
  }

});


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
  console.log(`API server now on port ${PORT}. http://127.0.0.1:${PORT}/`);
});
