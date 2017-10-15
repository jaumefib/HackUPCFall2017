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
var country = "ES";
var currency = "eur";
var locale = "en-US";
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
    if (messageText) detect_commands(senderID, messageText);

  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

//Function to analize commands
function detect_commands(recipientId, tmp) {

  var q = tmp.toLowerCase();
  if (S(q).contains("fly") || S(q).includes("flight")) comanda_fly(recipientId, q);

  //TODO: Car commands
  //else if (S(q).contains("car") || S(q).includes("driver")) comanda_car(q);

  else if (S(q).contains('hello') ||  S(q).includes("hi") || S(q).includes("help") ) comanda_hello(recipientId);
  else comanda_default(recipientId);
}

//Command Hello
function comanda_hello(recipientId) {
  var helloMessage = "Hello, welcome to SkyChat.\nI can search the best flights for you.\n\n" +
    "If you want to fly to somewhere text me:\n'I want to fly from [Location1] to [Location2]'\n\n" +
    "And if you want to fly in a context of time don't forget to remind me that:\n'I want to departure in yyyy-mm-dd and arrive in yyyy-mm-dd'\n\n" +
    "In case that the time doesn't matter to you, don't put it.\n\n" +
    "Have a good flight ! ✈";

  sendTextMessage(recipientId, helloMessage);
}

function comanda_default(recipientId) {
  var defaultMessage = "Sorry, I didn't understand you. Can I help you?";

  sendTextMessage(recipientId, defaultMessage);
}

function comanda_fly(recipientId, q) {

  originPlace = "";
  destinationPlace = "";
  // si la comanda conte la paraula from
  var original = q;
  if (S(q).indexOf("from") != -1) {
    var i, j;
    i =  S(q).indexOf("from")+5;
    j = i;
    for (i; i > 0 && i < S(q).length && q[i] != ' '; ++i) {
      originPlace = originPlace + q[i];
    }
    var tmp = "";
    for (j; j < S(q).length; ++j) tmp = tmp + q[j];
    q = tmp;
    for (i = S(q).indexOf("to")+3; i > 0 && i < S(q).length && q[i] != ' '; ++i) {
      destinationPlace = destinationPlace + q[i];
    }
  }
  if (originPlace.length == 0) originPlace = "everywhere";
  if (destinationPlace.length == 0) destinationPlace = "everywhere";

  //originDestination = originplace
  //destinationPlace = destinetionplace

  // assignem la comanda original a q, que ha estat modificada
  q = tmp;

  inboundPartialDate = "";
  outboundPartialDate = "";
  if (S(q).indexOf("in") != -1) {
    i =  S(q).indexOf("in")+3;
    j = i;
    for (i; i > 0 && i < S(q).length && q[i] != ' '; ++i) {
      outboundPartialDate = outboundPartialDate + q[i];
    }
    var tmp = "";
    for (j; j < S(q).length; ++j) tmp = tmp + q[j];
    q = tmp;
    for (i = S(q).indexOf("in")+3; i > 0 && i < S(q).length && q[i] != ' '; ++i) {
      inboundPartialDate = inboundPartialDate + q[i];
    }
  }

  if (outboundPartialDate.length == 0) {
    outboundPartialDate = "anytime";  //Departure
  }



    var url = "http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/" +
      country + "/" + currency + "/" + locale + "/" + originPlace + "/" + destinationPlace +
      "/" + outboundPartialDate + "/" + inboundPartialDate + "?apiKey=ha362120123102246681333182178859";

    request(url, function requestCallback(err, response, events) {
      if (!err && response.statusCode === 200) {
        console.log('Start search news:');
        try{
          var data = JSON.parse(events);

          searchInData(recipientId, data);
        }
        catch(err) {
          console.log(`${err}`);
        }
      } else {
        console.log(`${err}`);
      }
    });

}

function searchInData(recipientId, data) {

  var flightMessage = "";

  if (data.length == 0 || !data) flightMessage = "Not flights found";
  else {

    for (var i = 0; i < 5 && i < data.Quotes.length; ++i) {
      flightMessage += data.Quotes[i].MinPrice + "€\n\n";

      flightMessage += "Outbound :\n\n"

      flightMessage += searchCarrierId(data, data.Quotes[i].OutboundLeg.CarrierIds[0]) + "\n";

      flightMessage += searchCity(data, data.Quotes[i].OutboundLeg.OriginId) + " ✈ " + searchCity(data,data.Quotes[i].OutboundLeg.DestinationId) + "\n";

      flightMessage += data.Quotes[i].InboundLeg.keys(jsonArray).length + "\n";

      if (data.Quotes[i].InboundLeg.keys(jsonArray).length > 0) {
        flightMessage += "Return:\n"

        flightMessage += searchCarrierId(data, data.Quotes[i].InboundLeg.CarrierIds[0]) + "\n";

        flightMessage += searchCity(data, data.Quotes[i].InboundLeg.OriginId, data.Quotes[i].InboundLeg.DestinationId) + "\n";
      }

      sendTextMessage(recipientId, flightMessage);
      flightMessage = "";
    }
  }
}

function searchCity(data, cityId) {
  var j = 0;
  var city = "";

  for (j; j < data.Places.length && city.length == 0; ++j) {
    if (data.Places[j].PlaceId == cityId) city = data.Places[j].SkyscannerCode;
  }

  return city;
}

function searchCarrierId(data, carrierId) {
  var j = 0;
  var carrier = "";
  for (j; j < data.Carriers.length && carrier.length == 0; ++j) {
    if (data.Carriers[j].CarrierId == carrierId) carrier = data.Carriers[j].Name;
  }

  return carrier;
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
