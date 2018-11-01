var url = '/data';
var messageToDisplay;
var disp=[0,0];
var disp2=[0,0];
var disp3=[0,0];
var disp4=[0,0];
var disp5=[0,0];
var result;
var i;
var layout = {
  showlegend: true,
  legend: {"orientation": "h",
    font:{color:'white'},
    bgcolor: 'rgba(0,0,0,0)'    
  },
  margin: {
    l: 40,
    r: 40,
    b: 20,
    t: 20,
    pad: 0
  },
  xaxis: {title: 'year',
          color: 'white'
        },
  yaxis: {title:'count',
          color: 'white',
        },

  //opacity=0.1,  
  paper_bgcolor: 'rgba(0.1,0.1,0.1,0.1)',
  plot_bgcolor: 'rgba(0.2,0.2,0.2,0.3)'
}; 

var array = [10, 13, 7, 11, 12, 9, 6, 5];

function smooth(values, alpha) {
    var weighted = average(values) * alpha;
    var smoothed = [];
    for (var i in values) {
        var curr = values[i];
        var prev = smoothed[i - 1] || values[values.length - 1];
        var next = curr || values[0];
        var improved = Number(this.average([weighted, prev, curr, next]).toFixed(2));
        smoothed.push(improved);
    }
    return smoothed;
}

function average(data) {
    var sum = data.reduce(function(sum, value) {
        return sum + value;
    }, 0);
    var avg = sum / data.length;
    return avg;
}

function doublevalues (yval,year){
  var i=0;
  while (yval[i] == 0 || yval[i] == null){
    i++;
  } 
  var base = yval[i];
  var y=[];
  var x=[];
  y.push(yval[i]);
  x.push(year[i]);
  var j=2;
  var diff=0;
  for (i =i+1;i<yval.length;i++){
    diff= diff+yval[i];
  }
  console.log(diff/(yval.length*2));
  diff = diff/(yval.length*2);
  for (i =1;i<yval.length;i++){
    if(yval[i]>=(base*2)){
        y.push(yval[i]);
        x.push(year[i]);
        console.log(base*j,yval[i]);
        base = yval[i];
    }
  }
  console.log(x,y)
  return [x,y];
}

$(document).ready(function(){
  $('.tabs').tabs();
});
      
$('.btn1').on('click', function() {
  if($('#se').is(':checked')){
    query('SELECT paper_published_year year, COUNT(distinct paa.paper_ID) papers, COUNT(distinct author_ID) authors from Paper_Author_Affiliations_SE paa, Papers_SE p where paa.paper_ID =p.paper_ID and paper_published_year>1970 group by (paper_published_year);');
    disp[0] =1;
    $(document).ready(function() {
      console.log(messageToDisplay+" click");
    });
    //display1(messageToDisplay);
  }
  if($('#am').is(':checked')){
    query('SELECT paper_year year,COUNT(distinct paa.paper_ID) papers, COUNT(distinct author_ID) authors from Paper_Author_AM paa, Papers_AM p where paa.paper_ID =p.paper_ID and paper_year>1970 group by (paper_year);');
    disp[1] =1;
  }
});

//Authors/paper
$('.btn2').on('click', function() {
  if($('#se2').is(':checked')){
    Plotly.purge($('#plot0'));
    query('select paper_published_year year, avg(authors) avg from (SELECT paper_published_year,paa.paper_ID,COUNT(distinct author_ID) authors from Paper_Author_Affiliations_SE paa, Papers_SE p where paa.paper_ID =p.paper_ID and paper_published_year>1970 group by (paa.paper_ID)) t1 group by paper_published_year;');
    console.log(messageToDisplay);
    query('select paper_published_year year, avg(papers) as avg from (SELECT paper_published_year, author_ID,COUNT(distinct paa.paper_ID) papers from Paper_Author_Affiliations_SE paa, Papers_SE p where paa.paper_ID =p.paper_ID and paper_published_year>1970 group by paper_published_year, author_ID) t2 group by paper_published_year;');   
    disp2[0] =2;
    console.log(messageToDisplay)
  }
  if($('#am2').is(':checked')){
    Plotly.purge($('#plot1'));
    query('select paper_year year, avg(papers) avg from (SELECT paper_year, author_ID,COUNT(distinct paa.paper_ID) papers from Paper_Author_AM paa, Papers_AM p where paa.paper_ID =p.paper_ID and paper_year>1970 group by paper_year, author_ID) t2 group by paper_year;');   
    query('select paper_year year, avg(authors) avg from (SELECT paper_year, paa.paper_ID,COUNT(distinct paa.author_ID) authors from Paper_Author_AM paa, Papers_AM p where paa.paper_ID =p.paper_ID and paper_year>1970 group by paper_ID) t2 group by paper_year;');
    disp2[1] =2;
  }
});

//Authors/paper
$('.btn3').on('click', function() {
  //if($('#se3').is(':checked')){
  console.log("cl");
  Plotly.purge($('#plot0'));
  query('select * from (select  paper_year, avg(ai_citations) aiav from (select pai.paper_year, count(ai.paper_cite_id) ai_citations from Paper_Citations_AI ai, Papers_AI pai where ai.paper_id =pai.paper_id and pai.paper_year >1970 group by pai.paper_id) ai group by paper_year) t1 left JOIN (select  paper_year, avg(se_citations) seav from (select pse.paper_published_year paper_year, count(se.paper_cite_ID) se_citations from Paper_Citations_SE se, Papers_SE pse where se.paper_ID =pse.paper_ID and pse.paper_published_year >1970 group by pse.paper_ID) se group by paper_year) t2 on t1.paper_year = t2.paper_year;');
  disp3[0] =1;
  console.log(messageToDisplay)
  //}
});

$('.btn4').on('click', function() {
  //if($('#se3').is(':checked')){
  console.log("cl");
  Plotly.purge($('#plot0'));
  query('select paper_published_year paper_year, avg(self_cite_percent) avg_self_cite_percent from Papers_SE pse ,(  select t1.paper_ID, nonself/count(paper_cite_ID) self_cite_percent from Paper_Citations_SE t1, (select paper_ID,count(paper_cite_ID) nonself from Paper_Citations_SE pc where exists( select author_ID from Paper_Author_Affiliations_SE where paper_ID=pc.paper_ID and author_ID in  (select author_ID from Paper_Author_Affiliations_SE where pc.paper_ID=paper_cite_ID)) group by paper_ID) t2 where t1.paper_ID = t2.paper_ID group by t1.paper_ID) tout where tout.paper_ID = pse.paper_ID and paper_published_year>1970 group by paper_published_year;');
  disp4[0] =1;
  console.log(messageToDisplay)
  //}
});
$('.btn5').on('click', function() {
  Plotly.purge($('#plot0'));
  //query('select paper_published_year paper_year,  paper_id,  paper_published_year-min(paper_cite_published_year) difference from Paper_Citations_SE where paper_published_year>1970 group by paper_ID,paper_published_year having paper_published_year>min(paper_cite_published_year) order by paper_published_year;');
  query('select paper_year, avg(difference) difference from( select paper_published_year paper_year,  paper_id,  paper_published_year-min(paper_cite_published_year) difference from Paper_Citations_SE where paper_published_year>1970 group by paper_ID,paper_published_year having paper_published_year>min(paper_cite_published_year) order by paper_published_year) t group by paper_year;');
  disp5[0] =1;
  console.log(messageToDisplay)
  //}
});


function onLoad() {
  var response = this.responseText;

  console.log("in onload");
  var parsedResponse = JSON.parse(response);
     
  // access your data newly received data here and update your DOM with appendChild(), findElementById(), etc...
  messageToDisplay = parsedResponse;
  if (disp[0] ==1){
    console.log(disp);
    display1(messageToDisplay,0);``
  }
  else if (disp[1] ==1){
    console.log(disp);
    display1(messageToDisplay,1);
  }
  else if (disp2[0] !=0){
    console.log(disp2);
    messageToDisplay = JSON.parse(result);
    console.log(messageToDisplay[0]);
    display2(messageToDisplay,0);
  }
  else if (disp2[1] !=0){
    console.log(disp2);
    messageToDisplay = JSON.parse(result);
    display2(messageToDisplay,1);
    //display2(messageToDisplay,1);
  }  
  else if (disp3[0] !=0){
    console.log(disp3);
    display3(messageToDisplay,0);
    console.log(messageToDisplay);
    //display2(messageToDisplay,1);
  }
  else if (disp4[0] !=0){
    console.log(disp4);
    display4(messageToDisplay,0);
    console.log(messageToDisplay);
    //display2(messageToDisplay,1);
  }
  else if (disp5[0] !=0){
    console.log(disp5);
    display5(messageToDisplay,0);
    console.log(messageToDisplay);
    //display2(messageToDisplay,1);
  }
  else{
    table11(messageToDisplay);
  }
}

function display1(parsedResponse,no){
   var xval =[];
   var yval1=[];
   var yval2=[];

   for(i=0;i<parsedResponse.length-1;i++){
     xval.push(parsedResponse[i].year);
     yval1.push(parsedResponse[i].papers);
     yval2.push(parsedResponse[i].authors);
   }      

   TESTER = document.getElementById('plot'+no);
   var markers = {
    x:(doublevalues(yval1,xval)[0]).concat(doublevalues(yval2,xval)[0]),
    y:(doublevalues(yval1,xval)[1]).concat(doublevalues(yval2,xval)[1]),
    mode: 'markers',
    name: 'double',
    marker: {color:'red'}
  };
   var papers = {
    x: xval,
    y: yval1,
    mode: 'lines',
    name: 'papers'
  };
  
  var authors = {
    x: xval,
    y: yval2,
    mode: 'lines',
    name: 'authors'
  };
   Plotly.purge(TESTER);
   Plotly.plot( TESTER, [papers,authors,markers],layout,{responsive: true} );
   disp[no] =0;
   // append child (with text value o messageToDisplay for instance) here or do some more stuff
}

function display2(parsedResponse,no){
  var xval =[];
  var yval =[];
  
    
  TESTER = document.getElementById('plot'+no);

  for(i=0;i<parsedResponse.length-1;i++){
    xval.push(parsedResponse[i].year);
    yval.push(parsedResponse[i].avg);
  }
  yval=smooth(yval, 0.99);
  //
  if (disp2[no]==2){  
    Plotly.purge(TESTER); 
    var nametitle = 'avgAuth_per_paper';
  }
  else if(disp2[no]==1){
    var nametitle= 'avgPapers_per_author';
  }    
    var trace = {
      x: xval,
      y: yval,
      mode: 'lines',
      name: nametitle
    };
    var markers = {
      x:(doublevalues(yval,xval)[0]),
      y:(doublevalues(yval,xval)[1]),
      mode: 'markers',
      name: 'double',
      marker: {color:'red'}
    };
    Plotly.plot( TESTER, [trace,markers],layout,{responsive: true});
    disp2[no] =disp2[no]-1;   
}

// append child (with text value o messageToDisplay for instance) here or do some more stuff

function display3(parsedResponse,no){
   var xval =[];
   var yval1=[];
   var yval2=[];

   for(i=0;i<parsedResponse.length-1;i++){
     xval.push(parsedResponse[i].paper_year);
     yval1.push(parsedResponse[i].aiav);
     yval2.push(parsedResponse[i].seav);
   }   
   TESTER = document.getElementById('plot'+no);
   var markers = {
    x:(doublevalues(yval1,xval)[0]).concat(doublevalues(yval2,xval)[0]),
    y:(doublevalues(yval1,xval)[1]).concat(doublevalues(yval2,xval)[1]),
    mode: 'markers',
    name: 'double',
    marker: {color:'red'}
  };
   var papers = {
    x: xval,
    y: yval1,
    mode: 'lines',
    name: 'ai'
  };
  
  var authors = {
    x: xval,
    y: yval2,
    mode: 'lines',
    name: 'se'
  };

   Plotly.purge(TESTER);
   Plotly.plot( TESTER, [papers,authors,markers],layout,{responsive: true} );
   disp3[no] =0;
   // append child (with text value o messageToDisplay for instance) here or do some more stuff
}

function display4(parsedResponse,no){
  var xval =[];
  var yval=[];

  for(i=0;i<parsedResponse.length-1;i++){
    xval.push(parsedResponse[i].paper_year);
    yval.push(parsedResponse[i].avg_self_cite_percent);
  }   
  TESTER = document.getElementById('plot'+no);
  var markers = {
   x:(doublevalues(yval,xval)[0]),
   y:(doublevalues(yval,xval)[1]),
   mode: 'markers',
   name: 'double',
   marker: {color:'red'}
 };
  var papers = {
   x: xval,
   y: yval,
   mode: 'lines',
   name: 'avg_self_cite_percent'
 };

  Plotly.purge(TESTER);
  Plotly.plot( TESTER, [papers,markers],layout,{responsive: true} );
  disp4[no] =0;
  // append child (with text value o messageToDisplay for instance) here or do some more stuff
}

function display5(parsedResponse,no){
  var xval =[];
  var yval=[];

  for(i=0;i<parsedResponse.length-1;i++){
    xval.push(parsedResponse[i].paper_year);
    yval.push(parsedResponse[i].difference);
  }   
  TESTER = document.getElementById('plot'+no);
  var markers = {
   x:(doublevalues(yval,xval)[0]),
   y:(doublevalues(yval,xval)[1]),
   mode: 'markers',
   name: 'double',
   marker: {color:'red'}
 };
  var papers = {
   x: xval,
   y: yval,
   mode: 'lines',
   name: 'year difference'
 };

  Plotly.purge(TESTER);
  Plotly.plot( TESTER, [papers,markers],layout,{responsive: true} );
  disp5[no] =0;
  // append child (with text value o messageToDisplay for instance) here or do some more stuff
}


function onError() {
  // handle error here, print message perhaps
  
  console.log('error receiving async AJAX call');
  console.error();
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
          result=http.responseText;
      }
  }
  console.log("query returning");
  http.send()   ;  
}

/*
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems, options);
});
*/
// Or with jQuery

$(document).ready(function(){
  $('select').formSelect();
});

///////////////////////////////////////////////////////////////
//                       Nimisha's part                      //
//                        (Home page)                        //
///////////////////////////////////////////////////////////////



// Automatic Slideshow - change image every 3 seconds
var myIndex = 0;
carousel();

function carousel() {
    var i;
    var x = document.getElementsByClassName("dataImg");
    for (i = 0; i < x.length; i++) {
       x[i].style.display = "none";
    }
    myIndex++;
    if (myIndex > x.length) {myIndex = 1}
    x[myIndex-1].style.display = "block";
    setTimeout(carousel, 2500);
}

// Get the modal
var modal = document.getElementById("infoModal");
// Get the button that opens the modal
var infoBtn = document.getElementById('infoBtn');
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

infoBtn.onclick = function() {
    modal.style.display ="block";
};

$('span').on('click',function(){
    modal.style.display ="none";
});
/*
window.on('click', function(event){
  if(event.target == modal) {
      modal.style.display = "none";
  }
})
*/

var acc = document.getElementsByClassName("accordion");
var i;
var flag=0;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight){
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight +100+ "px";
    } 
  });
}

var acc1 = document.getElementsByClassName("accordion1");

/*
for (i = 0; i < acc1.length; i++) {
  console.log(i + "forloop");
  acc1[i].addEventListener("click", function() {
    
    /*var panel1 = this.nextElementSibling;
    if (panel1.style.maxHeight){
      panel1.style.maxHeight = null;
    } else {
      panel1.style.maxHeight = panel1.scrollHeight+100 + "px";
    } 
  });
}
*/


acc11.addEventListener("click",function() {
  console.log("acc11");
  console.log("event Listener");
  console.log("in button acc11 click")

  i=11
  description(i);
  //this.classList.toggle("active");
});


acc12.addEventListener("click",function(){
  console.log("in button acc12 click")

  i=12
  description(i);
});


acc13.addEventListener("click",function(){
  i=13
  console.log("in button acc13 click" + i);

  description(i);
});

acc14.addEventListener("click",function(){
  i=14
  console.log("in button acc14 click" + i);

  description(i);
});


acc21.addEventListener("click",function(){
  i=21
  console.log("in button acc21 click" + i);

  description(i);
});


acc22.addEventListener("click",function(){
  i=22
  console.log("in button acc22 click" + i);

  description(i);
});


acc23.addEventListener("click",function(){
  i=23
  console.log("in button acc23 click" + i);

  description(i);
});


acc24.addEventListener("click",function(){
  i=14
  console.log("in button acc24 click" + i);

  description(i);
});

acc31.addEventListener("click",function(){
  i=31
  console.log("in button acc31 click" + i);

  description(i);
});


acc32.addEventListener("click",function(){
  i=32
  console.log("in button acc32 click" + i);

  description(i);
});

function description(ii){
  console.log("in desc");
  console.log(ii);
  if(ii==11){
    query('select paper_ID,paper_title,paper_published_year,paper_abstract from Papers_SE limit 5;');
  }
  else if (ii == 12){
    query("select pse.paper_title as 'Paper_Title',a.author_name as Author from Paper_Author_Affiliations_SE p,Papers_SE pse, Authors_SE a where pse.paper_ID = p.paper_ID and  p.author_ID=a.author_ID limit 10;");
  }
  else if (ii == 13){
    
    query("select p1.paper_title as Paper_Title , pc.paper_published_year as Paper_published_year, p2.paper_title as Cited_Paper, pc.paper_cite_published_year as Paper_Citation_Published_Year from Paper_Citations_SE pc,Papers_SE p1, Papers_SE p2 where pc.paper_ID = p1.paper_ID and pc.paper_cite_ID = p2.paper_ID order by pc.paper_published_year desc limit 10 ;");
  }
  else if(ii == 14){
    query("select author_name as Author , author_keywords as Key_Words from Authors_SE limit 10;");
  }
  else if(ii == 21){
    query("select paper_id as Paper_ID ,paper_title as Paper_Title ,paper_year as Published_Year from Papers_AM limit 10;");
  }
  else if(ii == 22){
    query("select pam.paper_title as 'Paper_Title',a.author_name as Author from Paper_Author_AM p,Papers_AM pam, Authors_AM a where pam.paper_ID = p.paper_ID and  p.author_ID=a.author_ID limit 10;");
  }
  else if(ii == 23){
    query("select p1.paper_title as Paper_Title , p1.paper_year as Paper_published_year, p2.paper_title as Cited_Paper, p2.paper_year as Paper_Citation_Published_Year from Paper_Citations_AM pc,Papers_AM p1, Papers_AM p2 where pc.paper_ID = p1.paper_ID and pc.paper_cite_ID = p2.paper_ID order by p1.paper_year desc limit 10 ;");
  }
  else if(ii == 24){
    query("select author_name as Author , author_keywords as Key_Words from Authors_AM limit 10;");
  }
  else if(ii == 31){
    query("select paper_id as Paper_ID ,paper_title as Paper_Title ,paper_year as Published_Year from Papers_AI limit 10;");
  }
  else if(ii == 32){
    query("select p1.paper_title as Paper_Title , p1.paper_year as Paper_published_year, p2.paper_title as Cited_Paper, p2.paper_year as Paper_Citation_Published_Year from Paper_Citations_AI pc,Papers_AI p1, Papers_AM p2 where pc.paper_ID = p1.paper_ID and pc.paper_cite_ID = p2.paper_ID order by p1.paper_year limit 10 ;");
  }
}

function table11(res){
  var table = "";
  console.log("try11")
  table = '<tr>'
  for (x in res[0]) 
      table +='<th>'+ x +'</th>';
  table +='</tr>';
  for(var a=0; a < res.length; a++){  
    table += "<tr>";
    for (var key in res[a]) {
      if (res[a].hasOwnProperty(key)) {
          table += "<td>" + res[a][key] +"</td>";
      }
    }
    table += "<tr/>";
  }
  console.log(Object.keys(res)[1]);
   
  document.getElementById("data").innerHTML =table;
}




function selected() {
  var x = document.getElementById("mySel").value;
  document.getElementById("demo1").innerHTML = "You selected: " + x;
  if( x === "Publication Growth") {
      var y = document.getElementById("q1");
      y.style.display = "block";
      document.getElementById("q2").style.display= "none";
      document.getElementById("q3").style.display= "none";
      document.getElementById("q4").style.display= "none";
      document.getElementById("q5").style.display= "none";
  }
  else if( x === "Query2") {
    var y = document.getElementById("q2");
    y.style.display = "block";
    document.getElementById("q1").style.display= "none";
    document.getElementById("q3").style.display= "none";
    document.getElementById("q4").style.display= "none";
    document.getElementById("q5").style.display= "none";
  }
  else if( x === "Depth of related Study") {
    var y = document.getElementById("q3");
    y.style.display = "block";
    document.getElementById("q1").style.display= "none";
    document.getElementById("q2").style.display= "none";
    document.getElementById("q4").style.display= "none";
    document.getElementById("q5").style.display= "none";
  }
  else if( x === "Self Citations") {
    var y = document.getElementById("q4");
    y.style.display = "block";
    document.getElementById("q1").style.display= "none";
    document.getElementById("q3").style.display= "none";
    document.getElementById("q2").style.display= "none";
    document.getElementById("q5").style.display= "none";
  }
  else if( x === "Myopic vs Deep Referencing ") {
    var y = document.getElementById("q5");
    y.style.display = "block";
    document.getElementById("q1").style.display= "none";
    document.getElementById("q3").style.display= "none";
    document.getElementById("q4").style.display= "none";
    document.getElementById("q2").style.display= "none";
  }
}