//NPM Express
var express = require('express');
var app = express();

//NPM Body-Parser
var bodyParser = require('body-parser');

//NPM Request
var request = require('request');

//NPM String
var S = require('string');

// Variables globals
var country = "";
var currency = "";
var locale = "";
var originPlace = "";
var destinationPlace = "";
var outboundPartialDate = "";
var inboundPartialDate = "";

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

// Views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

//Test
app.get('/hello', function(req, res) {
  res.send('hello world!');
});

// Verify
app.get('/webhook', function(req, res) {
  res.status(200).send(req.query['hub.challenge']);
});


//Post: MSG received
app.post('/webhook/', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.

    res.sendStatus(200);
  }
});

//Analize MSG received
function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:",
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {

    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    if (messageText) {
        detect_commands(senderID, messageText);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

//Function to analize commands
function detect_commands(recipientId, tmp) {
  console.log(tmp);
  console.log(" ");
  var q = tmp.toLowerCase();
  if (S(q).contains("fly") || S(q).includes("flight")) comanda_fly(recipientId, q);

  //TODO: Car commands
  //else if (S(q).contains("car") || S(q).includes("driver")) comanda_car(q);

  else if (S(q).contains('hello') ||  S(q).includes("hi") || S(q).includes("help") ) comanda_hello(recipientId);
  else comanda_default(recipientId);
}

//Command Hello
function comanda_hello(recipientId) {
  var helloMessage = "Have a good flight ! ✈";

  sendTextMessage(recipientId, helloMessage);
}

//Send a response
function sendTextMessage(recipientId, messageText) {

  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

//FaceBook API
function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages/',
    qs: { access_token: 'EAAERQwLFnEwBALjWcZBqXZBdoaYXYFt9cSvwDxXGb4oARA3eUZAFy3jUAOlXetCaG3GmCnrnfWCWxe98iZCil5ZAuSjcsrMua9NazIjX7996s0z5NdGZBbLFfOQABeVNDYUfvua1YR2V0pAR9K4LVtZAZCrOfQ1B6icCfr8ZAjhDDj0HasK5f8244' },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });
}

app.listen(process.env.PORT || 5000);
