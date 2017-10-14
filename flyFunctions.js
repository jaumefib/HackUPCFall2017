
var S = require('string');
// prova de les funcions de fly
detect_commands("I want to fly from Barcelona to Madrid");
detect_commands("How are you doing");

// Variables globals
var country = "";
var currency = "";
var locale = "";
var originPlace = "";
var destinationPlace = "";
var outboundPartialDate = "";
var inboundPartialDate = "";








// funcio gestionar missatge

function detect_commands(q) {
  S(q).toLowerCase();
  if (S(q).contains("fly") || S(q).includes("flight")) comanda_fly(q);
  //else if (S(q).contains("car") || S(q).includes("driver")) comanda_car(q);
  else if (S(q).contains('hello') ||  S(q).includes("hi") || S(q).includes("help") ) comanda_hello();
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
    for (i; i > 0 && q[i] != ' ' && i < S(q).length; ++i) {
      originPlace = originPlace + q[i];
    }
    var tmp = "";
    for (j; j < S(q).length; ++j) tmp = tmp + q[j];
    q = tmp;
    for (i = S(q).indexOf("to")+3; i > 0 && q[i] != ' ' && i < S(q).length; ++i) {
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
    for (i; i > 0 && q[i] != ' ' && i < S(q).length; ++i) {
      outboundPartialDate = outboundPartialDate + q[i];
    }
    var tmp = "";
    for (j; j < S(q).length; ++j) tmp = tmp + q[j];
    q = tmp;
    for (i = S(q).indexOf("in")+3; i > 0 && q[i] != ' ' && i < S(q).length; ++i) {
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

    // falta la opcio nomes de anada


  // ara crida a la funcio de GET de Skyscanner
}
