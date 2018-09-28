var url = '/data';
var messageToDisplay;
var disp=[0,0];
var disp2=[0,0];

$(document).ready(function(){
  $('.tabs').tabs();
});
      
$('.btn1').on('click', function() {
  if($('#se').is(':checked')){
    query('SELECT paper_published_year year, COUNT(distinct paa.paper_ID) papers, COUNT(distinct author_ID) authors from Paper_Author_Affiliations_SE paa, Papers_SE p where paa.paper_ID =p.paper_ID group by (paper_published_year);');
    disp[0] =1;
    $(document).ready(function() {
      console.log(messageToDisplay+" click");
    });
    //display1(messageToDisplay);
  }
  if($('#am').is(':checked')){
    query('SELECT paper_year year,COUNT(distinct paa.paper_ID) papers, COUNT(distinct author_ID) authors from Paper_Author_AM paa, Papers_AM p where paa.paper_ID =p.paper_ID group by (paper_year);');
    disp[1] =1;
  }
});

//Authors/paper
$('.btn2').on('click', function() {
  if($('#se2').is(':checked')){
    Plotly.purge($('#plot0'));
    query('select paper_published_year, avg(authors) from (SELECT paper_published_year,paa.paper_ID,COUNT(distinct author_ID) authors from Paper_Author_Affiliations_SE paa, Papers_SE p where paa.paper_ID =p.paper_ID group by (paa.paper_ID)) t1 group by paper_published_year;');
    query('select paper_published_year, avg(papers) from (SELECT paper_published_year, author_ID,COUNT(distinct paa.paper_ID) papers from Paper_Author_Affiliations_SE paa, Papers_SE p where paa.paper_ID =p.paper_ID group by paper_published_year, author_ID) t2 group by paper_published_year;');    disp2[0] =1;
    disp2[0] =2;
  }
  if($('#am2').is(':checked')){
    Plotly.purge($('#plot0'));
    query('SELECT paper_year year,COUNT(distinct paa.paper_ID) papers, COUNT(distinct author_ID) authors from Paper_Author_AM paa, Papers_AM p where paa.paper_ID =p.paper_ID group by (paper_year);');
    disp2[1] =2;
  }
});


function onLoad() {
   var response = this.responseText;
   var parsedResponse = JSON.parse(response);

   // access your data newly received data here and update your DOM with appendChild(), findElementById(), etc...
   messageToDisplay = parsedResponse;
  if (disp[0] ==1){
    console.log(disp);
    display1(messageToDisplay,0);
  }
  else if (disp[1] ==1){
    console.log(disp);
    display1(messageToDisplay,1);
   }
  else if (disp2[0] =0){
    console.log(disp2);
    //display2(messageToDisplay,0);
  }
  else if (disp2[1] !=0){
    console.log(disp2);
    //display2(messageToDisplay,1);
   }  
}

function display1(parsedResponse,no){
   var xval =[];
   var yval1=[];
   var yval2=[];

   for(i=0;i<parsedResponse.length;i++){
     xval.push(parsedResponse[i].year);
     yval1.push(parsedResponse[i].papers);
     yval2.push(parsedResponse[i].authors);
   }   
   TESTER = document.getElementById('plot'+no);
   var trace1 = {
    x: xval,
    y: yval1,
    mode: 'lines'
  };
  
  var trace2 = {
    x: xval,
    y: yval2,
    mode: 'lines'
  };
   Plotly.purge(TESTER);
   Plotly.plot( TESTER, [trace1,trace2] );
   disp[no] =0;
   // append child (with text value o messageToDisplay for instance) here or do some more stuff
}

function display2(parsedResponse,no){
  var xval =[];
  var yval1=[];
  var yval2=[];

  for(i=0;i<parsedResponse.length;i++){
    xval.push(parsedResponse[i].year);

    yval1.push(parsedResponse[i].papers);
    yval2.push(parsedResponse[i].authors);
  }   
  TESTER = document.getElementById('plot'+no);
  var trace1 = {
   x: xval,
   y: yval1,
   mode: 'lines'
 };
 
 var trace2 = {
   x: xval,
   y: yval2,
   mode: 'lines'
 };
  Plotly.plot( TESTER, [trace1,trace2] );
  disp2[no] =disp2[no]-1;
  // append child (with text value o messageToDisplay for instance) here or do some more stuff
}

function onError() {
  // handle error here, print message perhaps
  console.log('error receiving async AJAX call');
}

function query (str){
  var http = new XMLHttpRequest();
  var url = '/query?q='+str;
  http.open('GET', url, true);
  
  //Send the proper header information along with the request
  http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  http.addEventListener('load',onLoad);
  http.addEventListener('error',onError);
  
  http.onreadystatechange = function() {//Call a function when the state changes.
      if(http.readyState == 4 && http.status == 200) {
          alert(http.responseText);
      }
  }
  console.log("query returning");
  http.send()   ;  
}