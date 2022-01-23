//-- use existing express app
const router = require('express').Router();

//-- point to noteRoutes
const noteRoutes = require('../apiRoutes/noteRoutes');

//-- tell express to use it
router.use(noteRoutes);


//-- export it for index
module.exports = router;
