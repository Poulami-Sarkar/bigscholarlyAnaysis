var http = require('http');
var mysql = require('mysql');
var express = require('express');
var fs = require('fs');
var query //= 'select year,count(*) journal_count from Aminer_cite_se group by year;'
var output ;
var url

var con = mysql.createConnection({
  host: "129.150.204.34",
  user: "root",
  password: "Root@123",
  database : "bigscholarlydata"
});
console.log('MySQL Connection details  '+con);

con.connect(function(err){
//safer to add querries after this
  if(err) throw err;
  console.log("Connected!");

});

var app = express();
//set view engine to ejs
app.set('view engine','ejs')

//This has to be done in order to link materialize
app.use(express.static('public'))

app.get('/',function(req,resp){

  resp.sendFile('./public/index.html',{'root':__dirname});
});

app.get('/data', function(req, res){
  var obj = {};
  con.query(query, function(err, resp, fields)
  {
	  	
          if(err) console.log('Connection result error '+err);
          console.log('no of records is '+resp.length);
          //response.writeHead(200, { 'Content-Type': 'application/json'});
          output =  JSON.stringify(resp)
          console.log(resp[0].year);
          res.send(resp);
          //response.write(rows[0].year);
  });
  console.log('body: ' + JSON.stringify());
  //res.send(rows);
});

app.listen(8088);
console.log('Server running at http://127.0.0.1:8000/');

app.get('/query', function (req, res) {
  query = req.query.q
    con.query(query, function(err, resp, fields)
    {
            if (err) console.log('Connection result error '+err);
            console.log('no of records is '+resp.length);
            output =  JSON.stringify(resp)
            console.log(resp[0].year);
            res.send(resp);
    });  
})
