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
  app.listen(8000,'192.168.0.6');
});

app.post('/',function(req,res){
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

app.post('/update',function(req,res){
  //console.log(req.headers);
  var body = '';
  req.on('data',(chunk) => {
    body += chunk;
  });
  req.on('end',() => {
    var marker = JSON.parse(body);
    marker.coords.lng = parseFloat(marker.coords.lng.toFixed(6));
    marker.tags = marker.tags.split(',');
    console.log(marker.tags);
    var query = {
      coords : marker.coords
    };
    console.log(query);
    db.collection("locations").findAndModify(query,[],{$set: {name : marker.name,tags : marker.tags}},function(err,object){
      //console.log(err);
      if(err) {
        console.log(err);
        res.writeHead(400);
        res.end();
      } else {
      console.log("no error");
      console.log(object);
      res.writeHead(200);
      res.end();
      }
    });
  });
});

app.post('/add',function(req,res){
  var body = '';
  req.on('data',(chunk) => {
    body += chunk;
  });

  req.on('end',function(){
    console.log(body);
    var marker = JSON.parse(body);
    console.log(marker);
    db.collection('locations').insert(marker,function(err,result){
      if(err){
        console.log(err);
        res.writeHead(400);
        res.end();
      } else {
        console.log(result);
        res.writeHead(200);
        res.end();
      }
    });
  });
})
