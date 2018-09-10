var http = require('http');
var mysql = require('mysql');
var express = require('express');
var fs = require('fs');
var query = 'select year,count(*) journal_count from Aminer_cite_se group by year;'
var output ;

var con = mysql.createConnection({
  host: "129.150.204.34",
  user: "root",
  password: "Root@123",
  database : "bigscholarlydata"
});
console.log('MySQL Connection details  '+con);
/*
fs.readFile('./index.html', function (err, html) {
    if (err) throw err;
    http.createServer(function (request, response)
    {
            console.log('Creating the http server');

    }).listen(3000, "127.0.0.1");
});*/
var app = express();
app.get('/',function(req,resp){
    resp.sendFile('./index.html',{'root':__dirname});
});

app.get('/data', function(req, res){
  var obj = {};
  con.query(query,[1, 2], function(err, resp, fields)
  {
          console.log('Connection result error '+err);
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

app.get('/main.js',function(req,resp){
    resp.sendFile('./main.js',{'root':__dirname});
});

app.listen(3000, "127.0.0.1");
console.log('Server running at http://127.0.0.1:3000/');
