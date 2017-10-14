
var S = require('string');

// prova de les funcions de fly
detect_commands("Hello");
detect_commands("I want to fly from Barcelona to Madrid");
detect_commands("I want to fly");
detect_commands("gfgf fgjfgm fgjfg");
detect_commands("I want to fly from London to Lisboa and I want to departure in 2017-10-10 and arrive in 2017-10-15");
detect_commands("Flight from [Loc1] to [Loc2]");

// Variables globals
var country = "";
var currency = "";
var locale = "";
var originPlace = "";
var destinationPlace = "";
var outboundPartialDate = "";
var inboundPartialDate = "";


// funcio gestionar missatge

function detect_commands(tmp) {
  console.log(tmp);
  console.log(" ");
  var q = tmp.toLowerCase();
  if (S(q).contains("fly") || S(q).includes("flight")) comanda_fly(q);
  //else if (S(q).contains("car") || S(q).includes("driver")) comanda_car(q);
  else if (S(q).contains('hello') ||  S(q).includes("hi") || S(q).includes("help") ) comanda_hello();
  else comanda_default();
}

function comanda_hello() {
  console.log("Hello, welcome to SkyChat.");
  console.log("I can search the best flights for you. ");
  console.log("     ");
  console.log("If you want to fly to somewhere text me: 'I want to fly from [Location1] to [Location2]'");
  console.log("And if you want to fly in a context of time don't forget to remind me that: 'I want to departure in yyyy-mm-dd and arrive in yyyy-mm-dd'");
  console.log("In case that the time doesn't matter to you, don't put it.");
  console.log("Have a good flight ! ✈");
  console.log("  ");
}

function comanda_default() {
  console.log("Sorry, I didn't understand you. Can I help you? ");
  console.log(" ");
}

function comanda_fly(q) {
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
  console.log("Origin " + originPlace);
  console.log("Destination " + destinationPlace);

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
      console.log("Departure anytime");
      if (inboundPartialDate.length != 0) {
        console.log("Arrival " + inboundPartialDate);
      }
  }
  else console.log("Departure " + outboundPartialDate);

  if (inboundPartialDate.length != 0) {
    console.log("Arrival " + inboundPartialDate);
  }
  console.log(" ");

    // falta la opcio nomes de anada


  // ara crida a la funcio de GET de Skyscanner
}
