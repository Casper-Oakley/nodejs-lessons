var express = require('express'),
    app = express(),
    path = require('path'),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    mongoose = require('mongoose');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'public')));


//mongodb stuff
mongoose.connect('mongodb://localhost/chat');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// we're connected!
var chatSchema = mongoose.Schema({
    user: String,
    message: String
});

var Message = mongoose.model('Message', chatSchema);

db.once('open', function() {
  console.log('connected to db!');
});


//Express site location
app.get('/', function(req, res) {
  res.render('index');
});

//Sockets stuff
io.on('connection', function(client) {
  console.log('Client connected');

  Message.find(function(err, messages) {
    messages.forEach(function(e) {
      client.emit('receive-message', {
        user:e.user,
        message:e.message
      });
    });
  });

  client.on('send-message', function(data) {
    console.log('New message received!');
    var newMessage = new Message(data);
    newMessage.save(function(err) {
      if(err) console.log(err);
    });
    io.sockets.emit('receive-message', data);
  });
});


server.listen(3000, function() {
  console.log('App listening at http://localhost:3000');
});
