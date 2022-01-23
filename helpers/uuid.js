//-- used to ensure UUID is 100% unique
const d = new Date();

// Immediately export a function that generates a string of random numbers and letters.
module.exports = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1)
    .concat("_",d.getFullYear(),d.getMonth(),d.getDate(),d.getMinutes(),d.getSeconds(), d.getMilliseconds());

    /* 
    Returns 4 digit UUID, yyyy, 0-11, 1-31 , 0-59, 0-59, 0-999
      
      Example: 1cd5_20220231135548
    */
