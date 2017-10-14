var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// Views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

// Verify
app.get('/webhook', function(req, res) {
  res.status(200).send(req.query['hub.challenge']);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

//Post of a msg
app.post('/webhook', function (req, res) {
  console.log("Message data: ", res);
    app.get('/webhook', function(req, res) {
        res.send(res);
        res.status(200).send(req.query['hub.challenge']);
    });
});
  

