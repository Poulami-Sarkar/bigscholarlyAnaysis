var req = new XMLHttpRequest();
var url = '/data';

req.open('GET',url,true); // set this to POST if you would like
req.addEventListener('load',onLoad);
req.addEventListener('error',onError);

req.send();

function onLoad() {
   var response = this.responseText;
   var parsedResponse = JSON.parse(response);

   // access your data newly received data here and update your DOM with appendChild(), findElementById(), etc...
   var messageToDisplay = parsedResponse;
   console.log(parsedResponse);
   var xval =[];
   var yval=[];

   for(i=0;i<parsedResponse.length;i++){
     xval.push(parsedResponse[i].year)
     yval.push(parsedResponse[i].journal_count)
   }

   TESTER = document.getElementById('tester');
   Plotly.plot( TESTER, [{
   x: xval,
   y: yval,
   type: 'bar'}], {
   margin: { t: 0 } } );
   console.log("ugi");
   // append child (with text value o messageToDisplay for instance) here or do some more stuff
}

function onError() {
  // handle error here, print message perhaps
  console.log('error receiving async AJAX call');
}
