const http = require('http');
const mongoClient = require('mongodb').MongoClient;
const url = require('url');
const app = require('express')();
//const fs = require("fs");
const mongoUrl = "mongodb://127.0.0.1:27017/markers";
var db;
mongoClient.connect(mongoUrl,(err,database) => {
  if(err) console.log(err);
  console.log("database opened");
  db = database;
  //start server
  server.listen(8000,'127.0.0.1');
});
const server = http.createServer((req,res) => {
  const myURL = url.parse(req.url);
  console.log(req.headers);
  var body = "";
  //console.log(myURL);
  req.on('data',(chunk) => {
    body += chunk;
  });
  req.on('end',() => {
    //console.log(JSON.parse(body));
    var bound = JSON.parse(body);
    var query = {
      "coords.lat": {$lt: bound.north,$gt:  bound.south},
      "coords.lng": {$lt: bound.east,$gt:  bound.west}
    };
    db.collection("locations").find(query).toArray(function(err,result){
        if(err) console.log(err);
        //console.log(result);
        result = JSON.stringify(result);
        res.writeHead(200,{'Content-type':'application/json'});
        res.end(result,"utf8");
    });
  });
});

server.on('listening',() => {
  console.log("listening");
});
