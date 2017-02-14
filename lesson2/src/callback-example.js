var fs = require('fs');

fs.readFile('example.txt', function(err, data) {
  if(err) {
    console.log(err);
  } else {
    //Now we can do stuff with the data in the file
    console.log(data.toString());
  }
});

