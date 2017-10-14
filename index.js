var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json())

app.use(express.static(__dirname + '/public'));

// Views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

//Test
app.get('/hello', function(req, res) {
  res.send('hello');
});

// Verify
app.get('/webhook', function(req, res) {
  res.status(200).send(req.query['hub.challenge']);
});


//Post of a msg
app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging;
    
    for (i = 0; i < messaging_events.legth; i++) {
        event = rq.body.entry[0].messaging[i];
        sender = event.sender.id;
        if (event.message && event.message.text) {
            text = event.message.text;
            console.log(text);
        }
    }
    res.sendStatus(200);
});
  

app.listen(process.env.PORT || 5000);
