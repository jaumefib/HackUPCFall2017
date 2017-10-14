detect_commands("I want to fly from Barcelona to Madrid");

// funcio gestionar missatge

function detect_commands(q) {
  q.toLowerCase();
  if (q.includes("fly") || q.includes("flight")) comanda_fly(q.text);



  else if (q.includes("hello") || q.includes("Hello")) comanda_hello();
}

function comanda_fly(q) {  // from to
  if (q.includes("from")) {
    var originId = "a";
    var destinationId = "b";
    var i;
    for (i = q.indexOf("from")+5; i > 0 && q[i] != ' ' && i < q.length; ++i) {
      originId = originId + q[i].text;
    }
    for (i = q.indexOf("to")+3; i > 0 && q[i] != ' ' && i < q.length; ++i) {
      destinationId = destinationId + q[i].text;
    }
    if (originId.length == 0) originId = "everywhere";
    if (destinationId.length == 0) destinationId = "everywhere";
  }
  console.log(originId);
  console.log(destinationId);
}
